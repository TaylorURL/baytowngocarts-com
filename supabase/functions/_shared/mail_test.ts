// deno test supabase/functions/_shared/mail_test.ts
import { mailer, type MailConfig } from "./mail.ts";
import { fakeDb, has, withFetch, type Query } from "./testing.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const CONFIG: MailConfig = {
  resendKey: "re",
  from: "Speedway 146 <hello@baytowngokarts.com>",
  replyTo: "hello@baytowngokarts.com",
  confirmationsOn: true,
};

const ORDER = {
  purchase_id: "p1",
  user_id: "u1",
  email: "buyer@example.com",
  order_number: "SPW146-2026-482913",
  items: [
    { product_name: "15 Tickets", price: 14999, quantity: 1, subtotal: 14999 },
  ],
  total_amount: 17016,
  placed_at: "2026-09-20T17:33:08Z",
};

const resend = () => new Response(JSON.stringify({ id: "email_1" }));

const claims = (inserted: unknown, held?: unknown) => (query: Query) => {
  if (query.table === "email_log" && has(query, "insert")) return inserted;
  if (query.table === "email_log" && has(query, "select")) return held;
  return { data: null, error: null };
};

Deno.test("nothing is sent while confirmations are off", async () => {
  const db = fakeDb(claims({ data: { id: "l1", attempts: 1 }, error: null }));
  await withFetch(resend, async (calls) => {
    const { confirmPurchase } = mailer(db, {
      ...CONFIG,
      confirmationsOn: false,
    });
    const outcome = await confirmPurchase("p1");
    assert(outcome === "off", `outcome was ${outcome}`);
    assert(calls.length === 0, "Resend was called");
  });
  assert(
    db.rpcs.length === 0 && db.queries.length === 0,
    "the database was touched",
  );
});

Deno.test("an order already confirmed is not confirmed again", async () => {
  const db = fakeDb(claims({ data: { id: "l1", attempts: 1 }, error: null }));
  db.rpcAnswer = () => ({ data: [], error: null });
  await withFetch(resend, async (calls) => {
    const outcome = await mailer(db, CONFIG).confirmPurchase("p1");
    assert(outcome === "done", `outcome was ${outcome}`);
    assert(calls.length === 0, "Resend was called");
  });
});

Deno.test(
  "a due order is claimed, sent without an unsubscribe, and stamped",
  async () => {
    const db = fakeDb(claims({ data: { id: "l1", attempts: 1 }, error: null }));
    db.rpcAnswer = () => ({ data: [ORDER], error: null });
    await withFetch(resend, async (calls) => {
      const outcome = await mailer(db, CONFIG).confirmPurchase("p1");
      assert(outcome === "sent", `outcome was ${outcome}`);
      assert(calls.length === 1, `${calls.length} sends`);
      const sent = JSON.parse(String(calls[0].init?.body));
      assert(sent.to[0] === "buyer@example.com", "sent to the wrong address");
      assert(
        sent.subject.includes("SPW146-2026-482913"),
        "subject has no order",
      );
      assert(
        !("List-Unsubscribe" in sent.headers),
        "a receipt carries an unsubscribe",
      );
    });
    assert(
      (db.rpcs[0].args as { p_purchase_id: string }).p_purchase_id === "p1",
      "asked about the wrong order",
    );
    const stamp = db.queries.find(
      (q) => q.table === "email_log" && has(q, "update"),
    );
    assert(stamp, "the send was never stamped");
  },
);

Deno.test("a confirmation somebody else holds is not sent twice", async () => {
  const db = fakeDb(
    claims(
      { data: null, error: { code: "23505", message: "duplicate" } },
      { data: { id: "l1", attempts: 1, status: "sent" }, error: null },
    ),
  );
  db.rpcAnswer = () => ({ data: [ORDER], error: null });
  await withFetch(resend, async (calls) => {
    const outcome = await mailer(db, CONFIG).confirmPurchase("p1");
    assert(outcome === "held", `outcome was ${outcome}`);
    assert(calls.length === 0, "sent a second confirmation");
  });
});
