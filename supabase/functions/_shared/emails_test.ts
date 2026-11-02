// deno test supabase/functions/_shared/emails_test.ts
import {
  cartUrl,
  centralHour,
  formatDay,
  KINDS,
  newPromoCode,
  novemberOpen,
  ORDER_KIND,
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

Deno.test(
  "the cart reminder lists the cart with prices and links back to it",
  () => {
    const email = renderEmail({
      kind: "checkout_reminder",
      items: ITEMS,
      unsubscribeUrl: UNSUBSCRIBE,
    });
    assert(
      email.text.includes("15 Tickets, 2 × $149.99 = $299.98"),
      "ticket line missing",
    );
    assert(
      email.text.includes("Bounce House + Game Tables, 1 × $150.00 = $150.00"),
      "upgrade line missing",
    );
    assert(email.text.includes("$449.98"), "subtotal missing");
    const link = cartUrl(ITEMS);
    assert(
      email.html.includes(link.replace(/&/g, "&amp;")),
      "cart link missing from html",
    );
    assert(!email.text.includes("RACE-"), "a reminder carries no code");
  },
);

Deno.test(
  "the offers are claimed by a link and carry the code as a fallback",
  () => {
    for (const kind of ["checkout_offer", "come_back_offer"] as const) {
      const email = renderEmail({
        kind,
        items: ITEMS,
        offer: OFFER,
        unsubscribeUrl: UNSUBSCRIBE,
      });
      assert(email.text.includes("RACE-ABC234"), `${kind} has no code`);
      assert(
        email.text.includes("Friday, October 30"),
        `${kind} has no expiry`,
      );
      assert(email.subject.includes("10%"), `${kind} subject has no percent`);
      assert(
        email.html.includes("Claim my 10% off"),
        `${kind} has no claim button`,
      );
    }
    const checkout = renderEmail({
      kind: "checkout_offer",
      items: ITEMS,
      offer: OFFER,
      unsubscribeUrl: UNSUBSCRIBE,
    });
    assert(
      checkout.text.includes("/cart?add=prod_single_kart_15%3A2"),
      "checkout offer link does not rebuild the cart",
    );
    assert(
      checkout.text.includes("code=RACE-ABC234"),
      "checkout offer link does not carry the code",
    );
    const comeBack = renderEmail({
      kind: "come_back_offer",
      offer: OFFER,
      unsubscribeUrl: UNSUBSCRIBE,
    });
    assert(
      comeBack.text.includes(
        "https://baytowngokarts.com/pricing?code=RACE-ABC234",
      ),
      "come-back offer link does not carry the code to pricing",
    );
  },
);

Deno.test("every email shows the shield and a photo from the site", () => {
  for (const kind of KINDS) {
    const email = renderEmail({
      kind,
      items: ITEMS,
      offer: OFFER,
      unsubscribeUrl: UNSUBSCRIBE,
    });
    assert(
      email.html.includes("https://baytowngokarts.com/images/email/logo.png"),
      `${kind} has no logo`,
    );
    assert(
      /images\/email\/(track|driver)\.jpg/.test(email.html),
      `${kind} has no photo`,
    );
  }
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

const ORDER = {
  number: "SPW146-2026-482913",
  items: [
    { product_name: "15 Tickets", price: 14999, quantity: 1 },
    { product_name: "Adult Race", price: 1399, quantity: 2 },
  ],
  total: 20112,
  placedAt: new Date("2026-09-20T17:33:08Z"),
};

Deno.test(
  "the confirmation shows the order, what it cost and what to bring",
  () => {
    const email = renderEmail({ kind: ORDER_KIND, order: ORDER });
    assert(
      email.subject.includes("SPW146-2026-482913"),
      "subject has no order",
    );
    assert(
      email.text.includes("15 Tickets, 1 × $149.99 = $149.99"),
      "ticket line missing",
    );
    assert(
      email.text.includes("Adult Race, 2 × $13.99 = $27.98"),
      "race line missing",
    );
    assert(
      email.text.includes("Total paid, with tax and fees: $201.12"),
      "total missing",
    );
    assert(email.text.includes("Placed Sunday, September 20"), "date missing");
    assert(email.text.includes("valid ID"), "what to bring is missing");
    assert(
      email.text.includes("https://baytowngokarts.com/dashboard"),
      "no link to the buyer's purchases",
    );
    assert(
      email.html.includes("6750 TX-146, Baytown, TX 77523"),
      "confirmation has no address",
    );
  },
);

Deno.test(
  "a confirmation carries no unsubscribe, the marketing kinds still do",
  () => {
    const email = renderEmail({ kind: ORDER_KIND, order: ORDER });
    assert(
      !/unsubscribe/i.test(email.html),
      "confirmation html offers an unsubscribe",
    );
    assert(
      !/unsubscribe/i.test(email.text),
      "confirmation text offers an unsubscribe",
    );
    for (const kind of KINDS) {
      const marketing = renderEmail({
        kind,
        items: ITEMS,
        offer: OFFER,
        unsubscribeUrl: UNSUBSCRIBE,
      });
      assert(
        marketing.html.includes(UNSUBSCRIBE),
        `${kind} lost its unsubscribe`,
      );
    }
  },
);

Deno.test("a confirmation without its order refuses to render", () => {
  let threw = false;
  try {
    renderEmail({ kind: ORDER_KIND });
  } catch {
    threw = true;
  }
  assert(threw, "rendered a confirmation for no order");
});

Deno.test(
  "the hours are the site's, with November's Thursday only in November",
  () => {
    const november = renderEmail({
      kind: ORDER_KIND,
      order: ORDER,
      now: new Date("2026-11-12T18:00:00Z"),
    });
    assert(
      november.text.includes("Thursday (November): 5:00 PM – 10:30 PM"),
      "November Thursday missing",
    );
    assert(
      november.text.includes("Friday: 5:00 PM – 10:30 PM"),
      "Friday missing",
    );
    assert(
      november.text.includes("Saturday – Sunday: 10:30 AM – 10:30 PM"),
      "weekend missing",
    );
    assert(
      november.text.includes("Closed Monday to Wednesday in November."),
      "November closed days wrong",
    );

    const december = renderEmail({
      kind: ORDER_KIND,
      order: ORDER,
      now: new Date("2026-12-01T18:00:00Z"),
    });
    assert(
      !december.text.includes("Thursday (November)"),
      "December still opens Thursday",
    );
    assert(
      december.text.includes("Closed Monday to Thursday."),
      "December closed days wrong",
    );

    assert(
      novemberOpen(new Date("2026-12-01T05:30:00Z")),
      "the 30th in Baytown ends at its midnight",
    );
    assert(
      !novemberOpen(new Date("2026-12-01T06:30:00Z")),
      "December 1 in Baytown still November",
    );
  },
);

Deno.test("no email sells the wristband as a Thursday deal any more", () => {
  for (const kind of KINDS) {
    const email = renderEmail({
      kind,
      items: ITEMS,
      offer: OFFER,
      unsubscribeUrl: UNSUBSCRIBE,
      now: new Date("2026-12-05T18:00:00Z"),
    });
    assert(
      !/thursdays only/i.test(email.text),
      `${kind} still says Thursdays only`,
    );
    assert(
      !/thursdays only/i.test(email.html),
      `${kind} html still says Thursdays only`,
    );
  }
});
