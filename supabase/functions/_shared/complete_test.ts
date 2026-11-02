// deno test supabase/functions/_shared/complete_test.ts
import { checkouts } from "./checkout.ts";
import { completer } from "./complete.ts";
import { mailer } from "./mail.ts";
import type { StripeSession } from "./orders.ts";
import { argOf, fakeDb, has, withFetch, type Query } from "./testing.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

// What the success page sends the moment a buyer lands back from Stripe.
const landing = (sessionId: unknown) =>
  new Request("https://example.test/functions/v1/checkout-complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId }),
  });

const SESSION: StripeSession = {
  id: "cs_live_landed",
  status: "complete",
  payment_status: "paid",
  amount_total: 17016,
  created: 1789925488,
  success_url:
    "https://baytowngokarts.com/success?session_id={CHECKOUT_SESSION_ID}",
  customer_email: "buyer@example.com",
  customer_details: { email: "buyer@example.com" },
  metadata: { user_id: "u1" },
  payment_intent: { id: "pi_1", created: 1789925588 },
};

const LINES = {
  data: [
    {
      description: "15 Tickets",
      quantity: 1,
      amount_total: 14999,
      price: { unit_amount: 14999 },
    },
    {
      description: "Sales Tax",
      quantity: 1,
      amount_total: 1237,
      price: { unit_amount: 1237 },
    },
    {
      description: "Transaction Fee",
      quantity: 1,
      amount_total: 780,
      price: { unit_amount: 780 },
    },
  ],
};

const MAIL = {
  resendKey: "re",
  from: "Speedway 146 <hello@baytowngokarts.com>",
  replyTo: "hello@baytowngokarts.com",
  confirmationsOn: true,
};

/** A database with no order for the session until one is inserted. */
function store() {
  let saved: Record<string, unknown> | null = null;
  const db = fakeDb((query: Query) => {
    if (query.table === "purchases" && has(query, "insert")) {
      saved = { id: "p1", ...(argOf(query, "insert") as object) };
      return { data: null, error: null };
    }
    if (query.table === "purchases" && has(query, "single")) {
      return { data: saved, error: saved ? null : { message: "none" } };
    }
    if (query.table === "purchases") {
      return { data: saved ? [saved] : [], error: null };
    }
    if (query.table === "email_log" && has(query, "insert")) {
      return { data: { id: "l1", attempts: 1 }, error: null };
    }
    return { data: null, error: null };
  });
  db.rpcAnswer = () => ({
    data: saved
      ? [
          {
            purchase_id: "p1",
            user_id: "u1",
            email: (saved as { customer_email: string }).customer_email,
            order_number: (saved as { order_number: string }).order_number,
            items: (saved as { items: unknown }).items,
            total_amount: (saved as { total_amount: number }).total_amount,
            placed_at: (saved as { created_at: string }).created_at,
          },
        ]
      : [],
    error: null,
  });
  return db;
}

const stripeAndResend = (session: StripeSession | null) => (url: string) => {
  if (url.startsWith("https://api.resend.com")) {
    return new Response(JSON.stringify({ id: "email_1" }));
  }
  if (url.includes("/line_items")) return new Response(JSON.stringify(LINES));
  return session
    ? new Response(JSON.stringify(session))
    : new Response("{}", { status: 404 });
};

Deno.test(
  "landing back saves the order and sends one confirmation right away",
  async () => {
    const db = store();
    await withFetch(stripeAndResend(SESSION), async (calls) => {
      const handle = completer(db, checkouts(db, "sk"), mailer(db, MAIL));
      const response = await handle(landing("cs_live_landed"));
      const answer = await response.json();
      assert(response.status === 200, `answered ${response.status}`);
      assert(
        /^SPW146-2026-\d{6}$/.test(answer.order),
        `order was ${answer.order}`,
      );
      assert(
        answer.confirmation === "sent",
        `confirmation was ${answer.confirmation}`,
      );
      const sends = calls.filter((call) =>
        call.url.startsWith("https://api.resend.com"),
      );
      assert(sends.length === 1, `${sends.length} emails sent`);
      const email = JSON.parse(String(sends[0].init?.body));
      assert(email.to[0] === "buyer@example.com", "emailed the wrong address");
      assert(email.subject.includes(answer.order), "email names another order");
    });
    const inserts = db.queries.filter(
      (q) => q.table === "purchases" && has(q, "insert"),
    );
    assert(inserts.length === 1, `${inserts.length} orders written`);
  },
);

Deno.test(
  "landing back on an order already saved and confirmed changes nothing",
  async () => {
    const db = store();
    await withFetch(stripeAndResend(SESSION), async () => {
      const handle = completer(db, checkouts(db, "sk"), mailer(db, MAIL));
      await handle(landing("cs_live_landed"));
    });
    db.rpcAnswer = () => ({ data: [], error: null });
    await withFetch(stripeAndResend(SESSION), async (calls) => {
      const handle = completer(db, checkouts(db, "sk"), mailer(db, MAIL));
      const answer = await (await handle(landing("cs_live_landed"))).json();
      assert(
        answer.confirmation === "done",
        `confirmation was ${answer.confirmation}`,
      );
      assert(
        !calls.some((call) => call.url.startsWith("https://api.resend.com")),
        "emailed twice",
      );
    });
    const inserts = db.queries.filter(
      (q) => q.table === "purchases" && has(q, "insert"),
    );
    assert(inserts.length === 1, `${inserts.length} orders written`);
  },
);

Deno.test(
  "with confirmations off the order is saved and nobody is emailed",
  async () => {
    const db = store();
    await withFetch(stripeAndResend(SESSION), async (calls) => {
      const handle = completer(
        db,
        checkouts(db, "sk"),
        mailer(db, { ...MAIL, confirmationsOn: false }),
      );
      const answer = await (await handle(landing("cs_live_landed"))).json();
      assert(answer.order, "order not saved");
      assert(
        answer.confirmation === "off",
        `confirmation was ${answer.confirmation}`,
      );
      assert(
        !calls.some((call) => call.url.startsWith("https://api.resend.com")),
        "emailed while off",
      );
    });
  },
);

Deno.test(
  "another site's checkout, an unpaid one and a made-up id are refused",
  async () => {
    const cases: [StripeSession | null, unknown, number][] = [
      [
        { ...SESSION, success_url: "https://www.taylorurl.com/thanks" },
        "cs_live_landed",
        404,
      ],
      [{ ...SESSION, payment_status: "unpaid" }, "cs_live_landed", 409],
      [null, "cs_live_missing", 404],
      [SESSION, "not-a-session", 400],
      [SESSION, 42, 400],
    ];
    for (const [session, id, status] of cases) {
      const db = store();
      await withFetch(stripeAndResend(session), async (calls) => {
        const handle = completer(db, checkouts(db, "sk"), mailer(db, MAIL));
        const response = await handle(landing(id));
        assert(
          response.status === status,
          `${JSON.stringify(id)} answered ${response.status}, not ${status}`,
        );
        assert(
          !calls.some((call) => call.url.startsWith("https://api.resend.com")),
          "emailed on a refusal",
        );
      });
      assert(!db.queries.some((q) => has(q, "insert")), `wrote on a ${status}`);
    }
  },
);

Deno.test("only the site may call it from a browser", async () => {
  const db = store();
  const handle = completer(db, checkouts(db, "sk"), mailer(db, MAIL));
  const response = await handle(
    new Request("https://example.test", { method: "OPTIONS" }),
  );
  assert(
    response.headers.get("Access-Control-Allow-Origin") ===
      "https://baytowngokarts.com",
    "another origin allowed",
  );
});
