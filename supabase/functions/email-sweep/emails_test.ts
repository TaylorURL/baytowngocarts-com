// deno test supabase/functions/email-sweep/emails_test.ts
import {
  KINDS,
  cartUrl,
  centralHour,
  formatDay,
  newPromoCode,
  renderEmail,
} from "./emails.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const UNSUBSCRIBE = "https://baytowngokarts.com/unsubscribe?token=abc";
const ITEMS = [
  { id: "prod_single_kart_15", quantity: 2 },
  { id: "prod_party_bounce_upgrade", quantity: 1 },
];
const OFFER = {
  code: "RACE-ABC234",
  percentOff: 10,
  expiresAt: new Date("2026-10-30T17:00:00Z"),
};

Deno.test(
  "every kind renders a subject, a link to the site and an unsubscribe",
  () => {
    for (const kind of KINDS) {
      const email = renderEmail({
        kind,
        items: ITEMS,
        offer: OFFER,
        unsubscribeUrl: UNSUBSCRIBE,
      });
      assert(email.subject.length > 0, `${kind} has no subject`);
      assert(
        email.html.includes(UNSUBSCRIBE),
        `${kind} html has no unsubscribe link`,
      );
      assert(
        email.text.includes(UNSUBSCRIBE),
        `${kind} text has no unsubscribe link`,
      );
      assert(
        email.html.includes("6750 TX-146, Baytown, TX 77523"),
        `${kind} has no address`,
      );
      assert(
        email.html.includes("https://baytowngokarts.com/"),
        `${kind} links nowhere`,
      );
    }
  },
);

Deno.test("the cart reminder lists the cart and links back to it", () => {
  const email = renderEmail({
    kind: "checkout_reminder",
    items: ITEMS,
    unsubscribeUrl: UNSUBSCRIBE,
  });
  assert(email.text.includes("15 Tickets × 2"), "ticket line missing");
  assert(
    email.text.includes("Bounce House + Game Tables × 1"),
    "upgrade line missing",
  );
  const link = cartUrl(ITEMS);
  assert(
    email.html.includes(link.replace(/&/g, "&amp;")),
    "cart link missing from html",
  );
  assert(!email.text.includes("RACE-"), "a reminder carries no code");
});

Deno.test("the offers carry the code and the expiry day", () => {
  for (const kind of ["checkout_offer", "come_back_offer"] as const) {
    const email = renderEmail({
      kind,
      items: ITEMS,
      offer: OFFER,
      unsubscribeUrl: UNSUBSCRIBE,
    });
    assert(email.text.includes("RACE-ABC234"), `${kind} has no code`);
    assert(email.text.includes("Friday, October 30"), `${kind} has no expiry`);
    assert(email.subject.includes("10%"), `${kind} subject has no percent`);
  }
  const checkout = renderEmail({
    kind: "checkout_offer",
    items: ITEMS,
    offer: OFFER,
    unsubscribeUrl: UNSUBSCRIBE,
  });
  assert(
    checkout.text.includes("code=RACE-ABC234"),
    "checkout offer link does not fill the code",
  );
  assert(
    checkout.text.includes("add=prod_single_kart_15%3A2"),
    "checkout offer link does not rebuild the cart",
  );
});

Deno.test("the cart link drops products the site does not sell", () => {
  const url = new URL(
    cartUrl(
      [
        { id: "prod_nope", quantity: 1 },
        { id: "prod_single_kart_1", quantity: 3 },
      ],
      "RACE-ABC234",
    ),
  );
  assert(
    url.searchParams.get("add") === "prod_single_kart_1:3",
    `add was ${url.searchParams.get("add")}`,
  );
  assert(url.searchParams.get("code") === "RACE-ABC234", "code lost");
  assert(
    cartUrl([]) === "https://baytowngokarts.com/cart",
    "an empty cart link carries a query",
  );
});

Deno.test("promo codes match what create-checkout and the table accept", () => {
  const seen = new Set<string>();
  for (let i = 0; i < 500; i += 1) {
    const code = newPromoCode();
    assert(/^[A-Z0-9-]{6,32}$/.test(code), `${code} fails the table check`);
    assert(
      !/[01OIL]/.test(code.slice(5)),
      `${code} has a misreadable character`,
    );
    seen.add(code);
  }
  assert(seen.size > 490, "codes repeat");
});

Deno.test("names are escaped in html", () => {
  const email = renderEmail({
    kind: "checkout_offer",
    items: ITEMS,
    offer: { ...OFFER, code: "RACE-<B>" },
    unsubscribeUrl: 'https://x.test/?a="b"',
  });
  assert(!email.html.includes("RACE-<B>"), "code is not escaped");
  assert(!email.html.includes('a="b"'), "unsubscribe url is not escaped");
});

Deno.test("the track's clock is Central time", () => {
  assert(
    centralHour(new Date("2026-10-27T20:00:00Z")) === 15,
    "CDT hour wrong",
  );
  assert(
    centralHour(new Date("2026-12-01T20:00:00Z")) === 14,
    "CST hour wrong",
  );
  assert(
    formatDay(new Date("2026-10-31T03:00:00Z")) === "Friday, October 30",
    "day boundary wrong",
  );
});
