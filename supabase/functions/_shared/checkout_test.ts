// deno test supabase/functions/_shared/checkout_test.ts
import { checkouts } from "./checkout.ts";
import type { StripeSession } from "./orders.ts";
import { argOf, fakeDb, has, withFetch, type Query } from "./testing.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const SESSION: StripeSession = {
  id: "cs_live_test1",
  status: "complete",
  payment_status: "paid",
  amount_total: 17016,
  created: 1789925488,
  success_url:
    "https://baytowngokarts.com/success?session_id={CHECKOUT_SESSION_ID}",
  customer_email: "buyer@example.com",
  customer_details: { email: "buyer@example.com" },
  metadata: { user_id: "u1", promo_code_id: "promo1" },
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

const stripe = (url: string) =>
  url.includes("/line_items")
    ? new Response(JSON.stringify(LINES))
    : new Response("{}", { status: 404 });

const ok = { data: null, error: null };

/** Answers the order lookup with `existing` and each insert from `inserts`. */
function answering(existing: boolean, inserts: unknown[]) {
  return (query: Query) => {
    if (query.table === "purchases" && has(query, "select")) {
      return { data: existing ? [{ id: "p1" }] : [], error: null };
    }
    if (query.table === "purchases" && has(query, "insert")) {
      return inserts.shift() ?? ok;
    }
    return ok;
  };
}

Deno.test(
  "a paid checkout with no order gets one, and its attempt and code are closed",
  async () => {
    const db = fakeDb(answering(false, []));
    await withFetch(stripe, async (calls) => {
      const { completeCheckout } = checkouts(db, "sk");
      const { outcome, row } = await completeCheckout(SESSION, "u1", false);
      assert(outcome === "recorded", `outcome was ${outcome}`);
      assert(row?.items.length === 1, "tax and fee written as products");
      assert(calls.length === 1, "Stripe asked more than once");
    });
    const insert = db.queries.find(
      (q) => q.table === "purchases" && has(q, "insert"),
    );
    const written = argOf(insert!, "insert") as {
      total_amount: number;
      created_at: string;
    };
    assert(written.total_amount === 17016, "total wrong");
    assert(
      written.created_at === "2026-09-20T17:33:08.000Z",
      "not dated when paid",
    );
    const attempt = db.queries.find((q) => q.table === "checkout_attempts");
    assert(attempt && argOf(attempt, "update"), "attempt not closed");
    const promo = db.queries.find((q) => q.table === "promo_codes");
    assert(promo && argOf(promo, "eq") === "id", "code not spent");
  },
);

Deno.test(
  "an order the other caller already wrote is left alone, and the attempt still closes",
  async () => {
    const db = fakeDb(answering(true, []));
    await withFetch(stripe, async (calls) => {
      const { completeCheckout } = checkouts(db, "sk");
      const { outcome } = await completeCheckout(SESSION, "u1", false);
      assert(outcome === "exists", `outcome was ${outcome}`);
      assert(
        calls.length === 0,
        "Stripe asked for lines of an order already saved",
      );
    });
    assert(!db.queries.some((q) => has(q, "insert")), "wrote a second order");
    assert(
      db.queries.some((q) => q.table === "checkout_attempts"),
      "attempt left open",
    );
  },
);

Deno.test(
  "losing the race on the session's index counts as written",
  async () => {
    const db = fakeDb(
      answering(false, [
        {
          data: null,
          error: {
            code: "23505",
            message:
              'duplicate key value violates unique constraint "purchases_stripe_session_id_unique"',
          },
        },
      ]),
    );
    await withFetch(stripe, async () => {
      const { recordPurchase } = checkouts(db, "sk");
      const { outcome } = await recordPurchase(SESSION, "u1", false);
      assert(outcome === "exists", `outcome was ${outcome}`);
    });
  },
);

Deno.test("an order number already taken is drawn again", async () => {
  const db = fakeDb(
    answering(false, [
      {
        data: null,
        error: {
          code: "23505",
          message:
            'duplicate key value violates unique constraint "purchases_order_number_key"',
        },
      },
      ok,
    ]),
  );
  await withFetch(stripe, async () => {
    const { recordPurchase } = checkouts(db, "sk");
    const { outcome } = await recordPurchase(SESSION, "u1", false);
    assert(outcome === "recorded", `outcome was ${outcome}`);
  });
  const inserts = db.queries.filter((q) => has(q, "insert"));
  assert(inserts.length === 2, `${inserts.length} inserts`);
});

Deno.test("a dry run writes nothing", async () => {
  const db = fakeDb(answering(false, []));
  await withFetch(stripe, async () => {
    const { completeCheckout } = checkouts(db, "sk");
    const { outcome, row } = await completeCheckout(SESSION, "u1", true);
    assert(outcome === "would record" && row, `outcome was ${outcome}`);
  });
  assert(
    !db.queries.some((q) => has(q, "insert") || has(q, "update")),
    "a dry run wrote",
  );
});

Deno.test(
  "the thirty-second check saves a paid order nobody came back for, and closes the rest",
  async () => {
    const attempts = [
      { id: "a1", user_id: "u1", stripe_session_id: "cs_live_paid" },
      { id: "a2", user_id: "u2", stripe_session_id: "cs_live_expired" },
      { id: "a3", user_id: "u3", stripe_session_id: "cs_live_still_open" },
      { id: "a4", user_id: "u4", stripe_session_id: "cs_live_gone" },
    ];
    const sessions: Record<string, StripeSession> = {
      cs_live_paid: { ...SESSION, id: "cs_live_paid" },
      cs_live_expired: {
        ...SESSION,
        id: "cs_live_expired",
        status: "expired",
        payment_status: "unpaid",
      },
      cs_live_still_open: {
        ...SESSION,
        id: "cs_live_still_open",
        status: "open",
        payment_status: "unpaid",
      },
    };
    const db = fakeDb((query) => {
      if (query.table === "checkout_attempts" && has(query, "select")) {
        return { data: attempts, error: null };
      }
      return answering(false, [])(query);
    });
    const routes = (url: string) => {
      if (url.includes("/line_items"))
        return new Response(JSON.stringify(LINES));
      const id = decodeURIComponent(
        url.split("/checkout/sessions/")[1].split("?")[0],
      );
      return sessions[id]
        ? new Response(JSON.stringify(sessions[id]))
        : new Response("{}", { status: 404 });
    };
    await withFetch(routes, async () => {
      const { settleOpen } = checkouts(db, "sk");
      const settled = await settleOpen(false);
      assert(settled.recorded === 1, `recorded ${settled.recorded}`);
      assert(settled.completed === 1, `completed ${settled.completed}`);
      assert(settled.expired === 1, `expired ${settled.expired}`);
      assert(settled.void === 1, `void ${settled.void}`);
      assert(settled.open === 1, `open ${settled.open}`);
    });
    const written = db.queries.filter(
      (q) => q.table === "purchases" && has(q, "insert"),
    );
    assert(written.length === 1, `${written.length} orders written`);
    const row = argOf(written[0], "insert") as {
      stripe_session_id: string;
      user_id: string;
    };
    assert(
      row.stripe_session_id === "cs_live_paid" && row.user_id === "u1",
      "wrong order written",
    );
    const closes = db.queries.filter(
      (q) => q.table === "checkout_attempts" && has(q, "update"),
    );
    const statuses = closes
      .map((q) => (argOf(q, "update") as { status: string }).status)
      .sort();
    assert(
      JSON.stringify(statuses) ===
        JSON.stringify(["completed", "expired", "void"]),
      `closed as ${statuses.join(", ")}`,
    );
  },
);

Deno.test(
  "a dry run of the check reports the order it would save and writes nothing",
  async () => {
    const db = fakeDb((query) => {
      if (query.table === "checkout_attempts" && has(query, "select")) {
        return {
          data: [
            { id: "a1", user_id: "u1", stripe_session_id: "cs_live_paid" },
          ],
          error: null,
        };
      }
      return answering(false, [])(query);
    });
    await withFetch(
      (url) =>
        url.includes("/line_items")
          ? new Response(JSON.stringify(LINES))
          : new Response(JSON.stringify({ ...SESSION, id: "cs_live_paid" })),
      async () => {
        const settled = await checkouts(db, "sk").settleOpen(true);
        assert(
          "wouldRecord" in settled && settled.wouldRecord.length === 1,
          "no order reported",
        );
        assert(settled.wouldRecord[0].total === 17016, "wrong total reported");
      },
    );
    assert(
      !db.queries.some((q) => has(q, "insert") || has(q, "update")),
      "a dry run wrote",
    );
  },
);
