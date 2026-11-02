// deno test supabase/functions/_shared/orders_test.ts
import {
  isPaid,
  isSiteSession,
  orderNumber,
  paidAt,
  purchaseRow,
  type StripeLineItem,
  type StripeSession,
} from "./orders.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

// The 9/20 checkout the portal never saw, as Stripe returns it, with the
// buyer's address swapped for a placeholder.
const SESSION: StripeSession = {
  id: "cs_live_b1LLmCaq78N5tdEQ6IYZAcL3MhmTnrYfFkrzFyLLR2diTKPmQmS1lfMtnZ",
  status: "complete",
  payment_status: "paid",
  amount_total: 17016,
  created: 1789925488,
  success_url:
    "https://baytowngokarts.com/success?session_id={CHECKOUT_SESSION_ID}",
  customer_email: "buyer@example.com",
  customer_details: { email: "buyer@example.com" },
  metadata: { user_id: "7034afcf-718c-4ff7-a33a-ba80f18e53a7" },
  payment_intent: { id: "pi_3UHobwRl1Yxm7pjb1moWewan", created: 1789925588 },
};

const LINES: StripeLineItem[] = [
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
];

Deno.test("the order keeps the products and leaves tax and fees out", () => {
  const row = purchaseRow(
    SESSION,
    LINES,
    "7034afcf-718c-4ff7-a33a-ba80f18e53a7",
    "SPW146-2026-000001",
  );
  assert(row.items.length === 1, `kept ${row.items.length} lines`);
  assert(row.items[0].product_name === "15 Tickets", "product name lost");
  assert(row.items[0].price === 14999, "price wrong");
  assert(row.items[0].subtotal === 14999, "subtotal wrong");
  assert(row.total_amount === 17016, "total should be what the buyer paid");
  assert(row.total_quantity === 1, "tax and fee counted as people");
  assert(row.stripe_session_id === SESSION.id, "session lost");
  assert(
    row.stripe_payment_intent_id === "pi_3UHobwRl1Yxm7pjb1moWewan",
    "payment intent lost",
  );
  assert(row.customer_email === "buyer@example.com", "email lost");
  assert(row.status === "completed", "status wrong");
});

Deno.test(
  "a line of several carries each one's price, as the success page writes it",
  () => {
    const row = purchaseRow(
      SESSION,
      [
        {
          description: "Adult Race",
          quantity: 2,
          amount_total: 2798,
          price: { unit_amount: 1399 },
        },
        {
          description: "SALES TAX",
          quantity: 1,
          amount_total: 231,
          price: { unit_amount: 231 },
        },
      ],
      "u",
      "SPW146-2026-000002",
    );
    assert(row.items.length === 1, "tax kept regardless of case");
    assert(row.items[0].price === 1399, `price was ${row.items[0].price}`);
    assert(row.items[0].subtotal === 2798, "subtotal wrong");
    assert(row.total_quantity === 2, "quantity wrong");
  },
);

Deno.test(
  "a line without a price falls back to its total over its count",
  () => {
    const row = purchaseRow(
      SESSION,
      [{ description: "4 Tickets", quantity: 2, amount_total: 10398 }],
      "u",
      "n",
    );
    assert(row.items[0].price === 5199, `price was ${row.items[0].price}`);
  },
);

Deno.test(
  "the order is dated when the buyer paid, not when they reached Stripe",
  () => {
    assert(
      paidAt(SESSION).toISOString() === "2026-09-20T17:33:08.000Z",
      `paid at ${paidAt(SESSION).toISOString()}`,
    );
    assert(
      paidAt({ ...SESSION, payment_intent: "pi_x" }).toISOString() ===
        "2026-09-20T17:31:28.000Z",
      "an unexpanded intent should fall back to the session",
    );
    const row = purchaseRow(SESSION, LINES, "u", "n");
    assert(row.created_at === "2026-09-20T17:33:08.000Z", "row dated wrong");
  },
);

Deno.test("only finished, paid sessions count as paid", () => {
  assert(isPaid(SESSION), "a paid session reads unpaid");
  assert(
    !isPaid({ ...SESSION, payment_status: "unpaid" }),
    "a session still waiting on a bank debit reads paid",
  );
  assert(!isPaid({ ...SESSION, status: "open" }), "an open session reads paid");
  assert(
    !isPaid({ ...SESSION, status: "expired", payment_status: "unpaid" }),
    "an expired session reads paid",
  );
});

Deno.test("only checkouts that return to this site are its orders", () => {
  assert(isSiteSession(SESSION), "this site's session refused");
  assert(
    isSiteSession({
      ...SESSION,
      success_url:
        "https://baytowngocarts.com/success?session_id={CHECKOUT_SESSION_ID}",
    }),
    "the old domain's session refused",
  );
  assert(
    !isSiteSession({
      ...SESSION,
      success_url: "https://www.taylorurl.com/thanks?session_id=x",
    }),
    "another site's session accepted",
  );
  assert(
    !isSiteSession({ ...SESSION, success_url: null }),
    "a session with no return address accepted",
  );
});

Deno.test(
  "order numbers have the success page's shape and the track's year",
  () => {
    for (let i = 0; i < 200; i += 1) {
      const number = orderNumber(new Date("2026-09-20T17:33:08Z"));
      assert(
        /^SPW146-2026-\d{6}$/.test(number),
        `${number} has the wrong shape`,
      );
    }
    assert(
      orderNumber(new Date("2027-01-01T03:00:00Z"), "123456") ===
        "SPW146-2026-123456",
      "New Year's Eve in Baytown is still the old year",
    );
  },
);
