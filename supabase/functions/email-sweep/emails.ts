/*
 * What each email says and how it looks. Pure: given a kind and what it is
 * about, it returns the subject, the HTML and the plain text, so the cases can
 * render every email without a database or a mail server.
 *
 * The look is the site's: the asphalt header with the shield, a checkered
 * strip, Bebas Neue headings in race red and asphalt, Barlow for the words. Web
 * fonts only load in some mail clients, so every font names the closest
 * system face behind it, and the layout is tables with inline styles because
 * that is all Outlook and Gmail both draw.
 *
 * The business details are written out here rather than imported from
 * src/lib/content, because an edge function is bundled from this folder alone.
 * They are the same values as src/lib/content/business.js, specials.js and
 * src/lib/stripe-config.js.
 */

export const SITE_URL = "https://baytowngokarts.com";
const ASSETS = `${SITE_URL}/images/email`;

const BUSINESS = {
  name: "Speedway 146",
  phone: "(281) 722-4468",
  phoneTel: "tel:+12817224468",
  address: "6750 TX-146, Baytown, TX 77523",
  directions:
    "https://www.google.com/maps/dir/?api=1&destination=6750+TX-146+Baytown+TX+77523",
  hours: [
    ["Thursday – Friday", "5:00 PM – 10:30 PM"],
    ["Saturday – Sunday", "10:30 AM – 10:30 PM"],
  ],
  social: [
    ["Facebook", "https://www.facebook.com/p/Speedway146-61575710985956/"],
    ["Instagram", "https://www.instagram.com/Speedway146/"],
    ["TikTok", "https://www.tiktok.com/@Speedway146"],
  ],
};

const COLORS = {
  asphalt950: "#07080a",
  asphalt900: "#0e0f12",
  asphalt800: "#17191e",
  asphalt700: "#22252c",
  asphalt400: "#7a7f8a",
  asphalt300: "#b0b5bf",
  line: "#e7eaef",
  page: "#f4f5f8",
  chalk: "#fbfbf8",
  race600: "#dc1f28",
  race500: "#e11d2a",
  race50: "#fef4f5",
  caution: "#f2c100",
};

const DISPLAY =
  "'Bebas Neue', Impact, 'Arial Narrow', 'Helvetica Neue', Arial, sans-serif";
const BODY = "Barlow, 'Helvetica Neue', Helvetica, Arial, sans-serif";

export const KINDS = [
  "checkout_reminder",
  "checkout_offer",
  "first_race",
  "come_back",
  "come_back_offer",
] as const;

export type Kind = (typeof KINDS)[number];

export const CHECKOUT_KINDS: readonly Kind[] = [
  "checkout_reminder",
  "checkout_offer",
];

export const OFFER_KINDS: readonly Kind[] = [
  "checkout_offer",
  "come_back_offer",
];

export type CartLine = { id: string; quantity: number };

export type Offer = { code: string; percentOff: number; expiresAt: Date };

export type EmailInput = {
  kind: Kind;
  items?: CartLine[] | null;
  offer?: Offer | null;
  unsubscribeUrl: string;
};

export type Email = { subject: string; html: string; text: string };

/** What the pricing page shows for each id the cart carries. */
const PRODUCTS: Record<
  string,
  { name: string; detail: string; price: number }
> = {
  prod_single_kart_1: {
    name: "1 Ticket",
    detail: "Single 5-min race",
    price: 13.99,
  },
  prod_single_kart_4: {
    name: "4 Tickets",
    detail: "4 races · 5 min each",
    price: 51.99,
  },
  prod_single_kart_8: {
    name: "8 Tickets",
    detail: "8 races · 5 min each",
    price: 87.99,
  },
  prod_single_kart_15: {
    name: "15 Tickets",
    detail: "15 races · 5 min each",
    price: 149.99,
  },
  prod_single_kart_25: {
    name: "25 Tickets",
    detail: "25 races · 5 min each",
    price: 224.99,
  },
  prod_single_kart_35: {
    name: "35 Tickets",
    detail: "35 races · 5 min each",
    price: 297.99,
  },
  prod_single_kart_50: {
    name: "50 Tickets",
    detail: "50 races · 5 min each",
    price: 399.99,
  },
  prod_party_all_access: {
    name: "All-Access Family Race Party",
    detail: "20 wristbands, 2hr racing, 3hr party room",
    price: 699.0,
  },
  prod_party_bounce_upgrade: {
    name: "Bounce House + Game Tables",
    detail: "Party upgrade add-on",
    price: 150.0,
  },
  prod_party_race_together: {
    name: "Race Together Upgrade",
    detail: "Your group races together",
    price: 150.0,
  },
  prod_party_private_track: {
    name: "Private Track (2 Hours)",
    detail: "Exclusive track access",
    price: 700.0,
  },
};

const PROMO_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** A code nobody can guess or misread: no 0/O, no 1/I/L. */
export function newPromoCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  let suffix = "";
  for (const byte of bytes)
    suffix += PROMO_ALPHABET[byte % PROMO_ALPHABET.length];
  return `RACE-${suffix}`;
}

const knownLines = (items: CartLine[] | null | undefined) =>
  (items ?? []).filter(
    (line) =>
      PRODUCTS[line.id] && Number.isInteger(line.quantity) && line.quantity > 0,
  );

/**
 * A link into the site that rebuilds the cart from `add` and puts the code on
 * it from `code`, on whatever page it lands. Tapping it is the whole of
 * claiming an offer; the code printed beside it is the fallback.
 */
export function siteUrl(
  path: "/cart" | "/pricing",
  items?: CartLine[] | null,
  code?: string,
) {
  const params = new URLSearchParams();
  const lines = knownLines(items);
  if (lines.length) {
    params.set(
      "add",
      lines.map((line) => `${line.id}:${line.quantity}`).join(","),
    );
  }
  if (code) params.set("code", code);
  const query = params.toString();
  return `${SITE_URL}${path}${query ? `?${query}` : ""}`;
}

/** The cart page's own link, kept as the name the cases read. */
export const cartUrl = (items: CartLine[] | null | undefined, code?: string) =>
  siteUrl("/cart", items, code);

/** "Friday, October 30", on the track's own clock. */
export function formatDay(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

/** The hour on the track's clock, 0 to 23. */
export function centralHour(now: Date = new Date()): number {
  return Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      hour: "numeric",
      hourCycle: "h23",
    }).format(now),
  );
}

const dollars = (value: number) =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type Block =
  | { type: "p"; text: string }
  | { type: "cart"; items: CartLine[] }
  | { type: "offer"; offer: Offer; url: string }
  | { type: "special" }
  | { type: "hours" }
  | { type: "button"; label: string; url: string };

type Content = {
  subject: string;
  preheader: string;
  hero: { src: string; alt: string };
  eyebrow: string;
  heading: string;
  blocks: Block[];
  signoff: string;
  reason: string;
};

const HEROES = {
  track: {
    src: `${ASSETS}/track.jpg`,
    alt: "Two drivers lined up in their karts at Speedway 146",
  },
  driver: {
    src: `${ASSETS}/driver.jpg`,
    alt: "A young driver at the wheel at Speedway 146",
  },
};

function contentFor(input: EmailInput): Content {
  const items = knownLines(input.items);
  const offer = input.offer ?? null;
  const percent = offer?.percentOff ?? 10;
  const signoff =
    "Questions about racing or a party? Just reply. Your message goes straight to the track.";
  const accountReason =
    "You're getting this because you have an account at baytowngokarts.com.";
  const checkoutReason =
    "You're getting this because you started a checkout at baytowngokarts.com.";

  switch (input.kind) {
    case "checkout_reminder":
      return {
        subject: "Your races are still on the grid",
        preheader:
          "We saved your Speedway 146 cart. Finish checking out in under a minute.",
        hero: HEROES.track,
        eyebrow: "Your cart is saved",
        heading: "Still on the starting line?",
        blocks: [
          {
            type: "p",
            text: "You were one step from the track. Everything you picked is still in your cart, so you can pick up right where you left off.",
          },
          { type: "cart", items },
          {
            type: "button",
            label: "Finish my order",
            url: siteUrl("/cart", items),
          },
        ],
        signoff,
        reason: checkoutReason,
      };
    case "checkout_offer":
      return {
        subject: `Here's ${percent}% off your races`,
        preheader: offer
          ? `Tap once and ${percent}% comes off your cart. Good through ${formatDay(offer.expiresAt)}.`
          : `${percent}% off your Speedway 146 cart.`,
        hero: HEROES.track,
        eyebrow: "A little push to the finish",
        heading: `${percent}% off. Your cart's waiting.`,
        blocks: [
          {
            type: "p",
            text: `Still deciding? We'll make it easy. Tap the button and ${percent}% comes off the races and packages in your cart, no code to type.`,
          },
          ...(offer
            ? [
                {
                  type: "offer",
                  offer,
                  url: siteUrl("/cart", items, offer.code),
                } as Block,
              ]
            : []),
          { type: "cart", items },
        ],
        signoff,
        reason: checkoutReason,
      };
    case "first_race":
      return {
        subject: "Your first lap at Speedway 146",
        preheader:
          "Grab wristbands online and go straight to the track. Thursdays: unlimited racing for $49.99.",
        hero: HEROES.driver,
        eyebrow: "Welcome to Speedway 146",
        heading: "Ready for your first race?",
        blocks: [
          {
            type: "p",
            text: "Thanks for joining. Buy your wristbands online, skip the line at the window, and get straight to racing on Baytown's outdoor track.",
          },
          { type: "special" },
          {
            type: "button",
            label: "See race prices",
            url: siteUrl("/pricing"),
          },
          { type: "hours" },
        ],
        signoff,
        reason: accountReason,
      };
    case "come_back":
      return {
        subject: "The track's been quiet without you",
        preheader:
          "Speedway 146 is open Thursday to Sunday. Bigger bundles bring races down to $8 each.",
        hero: HEROES.driver,
        eyebrow: "We miss you out here",
        heading: "Time for a rematch?",
        blocks: [
          {
            type: "p",
            text: "It's been a while since your last race. Round up the crew and settle the score. Our bigger ticket bundles bring each race down to as little as $8.",
          },
          { type: "special" },
          {
            type: "button",
            label: "Book your next race",
            url: siteUrl("/pricing"),
          },
          { type: "hours" },
        ],
        signoff,
        reason: accountReason,
      };
    case "come_back_offer":
      return {
        subject: `${percent}% off your next race at Speedway 146`,
        preheader: offer
          ? `Tap to claim ${percent}% off your next online order, good through ${formatDay(offer.expiresAt)}.`
          : `${percent}% off your next Speedway 146 order.`,
        hero: HEROES.track,
        eyebrow: "Welcome-back deal",
        heading: `Come back for ${percent}% off`,
        blocks: [
          {
            type: "p",
            text: `We'd love to see you back on the track. Tap below, pick your races, and ${percent}% comes off at checkout.`,
          },
          ...(offer
            ? [
                {
                  type: "offer",
                  offer,
                  url: siteUrl("/pricing", null, offer.code),
                } as Block,
              ]
            : [
                {
                  type: "button",
                  label: "See race prices",
                  url: siteUrl("/pricing"),
                } as Block,
              ]),
          { type: "hours" },
        ],
        signoff,
        reason: accountReason,
      };
  }
}

/* ---------- HTML ---------- */

function button(
  label: string,
  url: string,
  tone: "race" | "dark" = "race",
): string {
  const background = tone === "race" ? COLORS.race600 : COLORS.asphalt900;
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;"><tr><td align="center" bgcolor="${background}" style="background:${background};border-radius:6px;mso-padding-alt:16px 36px;">
<a href="${escapeHtml(url)}" target="_blank" style="display:inline-block;padding:16px 36px;font-family:${DISPLAY};font-size:22px;line-height:24px;letter-spacing:1.5px;text-transform:uppercase;color:#ffffff;text-decoration:none;border-radius:6px;">${escapeHtml(label)} &rarr;</a>
</td></tr></table>`;
}

/** Two rows of black and white squares, the strip under the site's header. */
function checkerStrip(): string {
  // Percent widths rather than pixels, so the strip narrows with a phone
  // screen instead of holding the email at 600px wide.
  const cell = (dark: boolean) => {
    const color = dark ? COLORS.asphalt950 : "#ffffff";
    return `<td height="10" bgcolor="${color}" style="width:2.5%;height:10px;font-size:0;line-height:0;background:${color};">&nbsp;</td>`;
  };
  const row = (offset: number) =>
    `<tr>${Array.from({ length: 40 }, (_, i) => cell((i + offset) % 2 === 0)).join("")}</tr>`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;table-layout:fixed;">${row(0)}${row(1)}</table>`;
}

function blockHtml(block: Block): string {
  const p = `margin:0 0 22px;font-family:${BODY};font-size:17px;line-height:27px;color:${COLORS.asphalt700};`;
  switch (block.type) {
    case "p":
      return `<p style="${p}">${escapeHtml(block.text)}</p>`;
    case "button":
      return `<div style="margin:6px 0 30px;">${button(block.label, block.url)}</div>`;
    case "cart": {
      if (!block.items.length) return "";
      const rows = block.items
        .map((line) => {
          const product = PRODUCTS[line.id];
          return `<tr>
<td style="padding:14px 0;border-top:1px solid ${COLORS.line};font-family:${BODY};">
<div style="font-size:16px;line-height:22px;font-weight:700;color:${COLORS.asphalt900};">${escapeHtml(product.name)}</div>
<div style="font-size:14px;line-height:20px;color:${COLORS.asphalt400};">${escapeHtml(product.detail)} &middot; ${line.quantity} &times; ${dollars(product.price)}</div>
</td>
<td align="right" valign="top" style="padding:14px 0 14px 12px;border-top:1px solid ${COLORS.line};font-family:${DISPLAY};font-size:24px;line-height:24px;color:${COLORS.asphalt900};white-space:nowrap;">${dollars(product.price * line.quantity)}</td>
</tr>`;
        })
        .join("");
      const subtotal = block.items.reduce(
        (sum, line) => sum + PRODUCTS[line.id].price * line.quantity,
        0,
      );
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
<tr><td colspan="2" style="padding:0 0 8px;font-family:${DISPLAY};font-size:16px;letter-spacing:2px;text-transform:uppercase;color:${COLORS.race600};">Your cart</td></tr>
${rows}
<tr><td style="padding:14px 0 0;border-top:2px solid ${COLORS.asphalt900};font-family:${BODY};font-size:14px;line-height:20px;color:${COLORS.asphalt400};">Subtotal, before tax and fees</td>
<td align="right" style="padding:14px 0 0 12px;border-top:2px solid ${COLORS.asphalt900};font-family:${DISPLAY};font-size:28px;line-height:28px;color:${COLORS.asphalt900};white-space:nowrap;">${dollars(subtotal)}</td></tr>
</table>`;
    }
    case "offer":
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
<tr><td bgcolor="${COLORS.asphalt900}" style="background:${COLORS.asphalt900};border-radius:10px;padding:28px 24px;" align="center">
<div style="font-family:${DISPLAY};font-size:14px;letter-spacing:3px;text-transform:uppercase;color:${COLORS.caution};">Your deal</div>
<div style="font-family:${DISPLAY};font-size:72px;line-height:72px;color:#ffffff;margin:6px 0 4px;">${block.offer.percentOff}<span style="color:${COLORS.race500};">%</span> OFF</div>
<div style="font-family:${BODY};font-size:15px;line-height:22px;color:${COLORS.asphalt300};margin:0 0 22px;">Good through ${escapeHtml(formatDay(block.offer.expiresAt))}</div>
${button(`Claim my ${block.offer.percentOff}% off`, block.url)}
<div style="font-family:${BODY};font-size:14px;line-height:21px;color:${COLORS.asphalt300};margin:20px 0 0;">Or enter <span style="font-family:'Courier New',Courier,monospace;font-size:16px;font-weight:bold;letter-spacing:2px;color:#ffffff;background:${COLORS.asphalt700};padding:3px 8px;border-radius:4px;">${escapeHtml(block.offer.code)}</span> at checkout.<br>One use, on the account this was sent to.</div>
</td></tr></table>`;
    case "special":
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
<tr><td style="border-left:6px solid ${COLORS.caution};background:${COLORS.page};padding:18px 20px;">
<div style="font-family:${DISPLAY};font-size:14px;letter-spacing:2.5px;text-transform:uppercase;color:${COLORS.race600};">Thursdays only</div>
<div style="font-family:${DISPLAY};font-size:30px;line-height:32px;color:${COLORS.asphalt900};margin:4px 0;">2.5 hours unlimited &middot; $49.99</div>
<div style="font-family:${BODY};font-size:15px;line-height:22px;color:${COLORS.asphalt700};">Per person, plus tax. Adult or kid karts. Wristband time starts when it's issued.</div>
</td></tr></table>`;
    case "hours":
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 8px;">
<tr><td colspan="2" style="padding:0 0 8px;font-family:${DISPLAY};font-size:16px;letter-spacing:2px;text-transform:uppercase;color:${COLORS.race600};">Track hours</td></tr>
${BUSINESS.hours
  .map(
    ([days, time]) =>
      `<tr><td style="padding:6px 0;border-top:1px solid ${COLORS.line};font-family:${BODY};font-size:15px;line-height:22px;font-weight:700;color:${COLORS.asphalt900};">${escapeHtml(days)}</td><td align="right" style="padding:6px 0;border-top:1px solid ${COLORS.line};font-family:${BODY};font-size:15px;line-height:22px;color:${COLORS.asphalt700};">${escapeHtml(time)}</td></tr>`,
  )
  .join("")}
<tr><td colspan="2" style="padding:6px 0 0;border-top:1px solid ${COLORS.line};font-family:${BODY};font-size:14px;line-height:21px;color:${COLORS.asphalt400};">Closed Monday to Wednesday. Holiday hours vary.</td></tr>
</table>`;
  }
}

/* ---------- Text ---------- */

function blockText(block: Block): string {
  switch (block.type) {
    case "p":
      return block.text;
    case "button":
      return `${block.label}: ${block.url}`;
    case "cart": {
      if (!block.items.length) return "";
      const lines = block.items.map((line) => {
        const product = PRODUCTS[line.id];
        return `- ${product.name}, ${line.quantity} × ${dollars(product.price)} = ${dollars(product.price * line.quantity)}`;
      });
      const subtotal = block.items.reduce(
        (sum, line) => sum + PRODUCTS[line.id].price * line.quantity,
        0,
      );
      return `YOUR CART\n${lines.join("\n")}\nSubtotal, before tax and fees: ${dollars(subtotal)}`;
    }
    case "offer":
      return `${block.offer.percentOff}% OFF, good through ${formatDay(block.offer.expiresAt)}\nClaim it: ${block.url}\nOr enter ${block.offer.code} at checkout. One use, on the account this was sent to.`;
    case "special":
      return "THURSDAYS ONLY: 2.5 hours unlimited racing, $49.99 per person plus tax.";
    case "hours":
      return `TRACK HOURS\n${BUSINESS.hours.map(([days, time]) => `${days}: ${time}`).join("\n")}\nClosed Monday to Wednesday. Holiday hours vary.`;
  }
}

export function renderEmail(input: EmailInput): Email {
  const content = contentFor(input);
  const unsubscribe = escapeHtml(input.unsubscribeUrl);
  const body = content.blocks.map(blockHtml).join("\n");
  const social = BUSINESS.social
    .map(
      ([label, url]) =>
        `<a href="${escapeHtml(url)}" target="_blank" style="color:#ffffff;text-decoration:none;font-family:${DISPLAY};font-size:16px;letter-spacing:1.5px;text-transform:uppercase;">${label}</a>`,
    )
    .join(
      `<span style="color:${COLORS.asphalt400};">&nbsp;&nbsp;/&nbsp;&nbsp;</span>`,
    );

  const html = `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(content.subject)}</title>
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;700&family=Bebas+Neue&display=swap" rel="stylesheet">
<style>
  body { margin:0; padding:0; }
  img { border:0; display:block; }
  @media (max-width:620px) {
    .px { padding-left:22px !important; padding-right:22px !important; }
    .h1 { font-size:40px !important; line-height:42px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${COLORS.asphalt950};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${COLORS.asphalt950};">${escapeHtml(content.preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${COLORS.asphalt950}" style="background:${COLORS.asphalt950};">
<tr><td align="center" style="padding:0 0 32px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">

<tr><td align="center" bgcolor="${COLORS.asphalt900}" style="background:${COLORS.asphalt900};padding:26px 24px 20px;">
<a href="${SITE_URL}" target="_blank"><img src="${ASSETS}/logo.png" width="96" height="105" alt="Speedway 146" style="width:96px;height:auto;margin:0 auto;"></a>
<div style="font-family:${DISPLAY};font-size:14px;letter-spacing:3px;text-transform:uppercase;color:${COLORS.asphalt300};margin:12px 0 0;">Go-kart racing &middot; Baytown, TX</div>
</td></tr>
<tr><td>${checkerStrip()}</td></tr>
<tr><td><a href="${SITE_URL}" target="_blank"><img src="${content.hero.src}" width="600" alt="${escapeHtml(content.hero.alt)}" style="width:100%;max-width:600px;height:auto;"></a></td></tr>

<tr><td class="px" bgcolor="${COLORS.chalk}" style="background:${COLORS.chalk};padding:36px 44px 12px;">
<div style="font-family:${DISPLAY};font-size:17px;letter-spacing:3px;text-transform:uppercase;color:${COLORS.race600};margin:0 0 6px;">${escapeHtml(content.eyebrow)}</div>
<h1 class="h1" style="margin:0 0 18px;font-family:${DISPLAY};font-weight:400;font-size:50px;line-height:50px;letter-spacing:0.5px;text-transform:uppercase;color:${COLORS.asphalt900};">${escapeHtml(content.heading)}</h1>
${body}
</td></tr>
<tr><td class="px" bgcolor="${COLORS.chalk}" style="background:${COLORS.chalk};padding:0 44px 36px;">
<p style="margin:16px 0 0;padding:18px 0 0;border-top:1px solid ${COLORS.line};font-family:${BODY};font-size:15px;line-height:23px;color:${COLORS.asphalt700};">${escapeHtml(content.signoff)}<br><strong style="color:${COLORS.asphalt900};">The Speedway 146 crew</strong></p>
</td></tr>

<tr><td height="6" bgcolor="${COLORS.race600}" style="height:6px;font-size:0;line-height:0;background:${COLORS.race600};">&nbsp;</td></tr>
<tr><td class="px" align="center" bgcolor="${COLORS.asphalt900}" style="background:${COLORS.asphalt900};padding:28px 32px;">
<div style="margin:0 0 14px;">${social}</div>
<div style="font-family:${BODY};font-size:14px;line-height:22px;color:${COLORS.asphalt300};">
<a href="${BUSINESS.directions}" target="_blank" style="color:${COLORS.asphalt300};text-decoration:none;">${escapeHtml(BUSINESS.address)}</a><br>
<a href="${BUSINESS.phoneTel}" style="color:${COLORS.asphalt300};text-decoration:none;">${escapeHtml(BUSINESS.phone)}</a> &middot; <a href="${SITE_URL}" target="_blank" style="color:${COLORS.asphalt300};text-decoration:none;">baytowngokarts.com</a>
</div>
<div style="font-family:${BODY};font-size:12px;line-height:19px;color:${COLORS.asphalt400};margin:16px 0 0;">${escapeHtml(content.reason)}<br><a href="${unsubscribe}" target="_blank" style="color:${COLORS.asphalt300};text-decoration:underline;">Unsubscribe</a></div>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  const text = [
    content.eyebrow.toUpperCase(),
    content.heading,
    "",
    ...content.blocks
      .map(blockText)
      .filter(Boolean)
      .flatMap((paragraph) => [paragraph, ""]),
    content.signoff,
    "The Speedway 146 crew",
    "",
    "--",
    `${BUSINESS.name} · ${BUSINESS.address} · ${BUSINESS.phone}`,
    SITE_URL,
    content.reason,
    `Unsubscribe: ${input.unsubscribeUrl}`,
  ].join("\n");

  return { subject: content.subject, html, text };
}
