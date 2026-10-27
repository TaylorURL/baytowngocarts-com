/*
 * What each email says. Pure: given a kind and what it is about, it returns the
 * subject, the HTML and the plain text, so the cases can render every email
 * without a database or a mail server.
 *
 * The business details are written out here rather than imported from
 * src/lib/content, because an edge function is bundled from this folder alone.
 * They are the same values as src/lib/content/business.js and specials.js.
 */

export const SITE_URL = "https://baytowngokarts.com";

const BUSINESS = {
  name: "Speedway 146",
  phone: "(281) 722-4468",
  address: "6750 TX-146, Baytown, TX 77523",
  hours: [
    "Thursday and Friday, 5:00 PM to 10:30 PM",
    "Saturday and Sunday, 10:30 AM to 10:30 PM",
  ],
  thursday:
    "Thursdays only: 2.5 hours of unlimited racing for $49.99 per person, plus tax.",
};

const COLORS = {
  asphalt: "#0e0f12",
  asphaltText: "#22252c",
  muted: "#5b606b",
  line: "#e7eaef",
  page: "#f4f5f8",
  chalk: "#fbfbf8",
  race: "#dc1f28",
  raceTint: "#fef4f5",
  raceLine: "#fdb4ba",
};

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

/** The names the pricing page shows, keyed by the ids the cart carries. */
const PRODUCT_NAMES: Record<string, string> = {
  prod_single_kart_1: "1 Ticket",
  prod_single_kart_4: "4 Tickets",
  prod_single_kart_8: "8 Tickets",
  prod_single_kart_15: "15 Tickets",
  prod_single_kart_25: "25 Tickets",
  prod_single_kart_35: "35 Tickets",
  prod_single_kart_50: "50 Tickets",
  prod_party_all_access: "All-Access Family Race Party",
  prod_party_bounce_upgrade: "Bounce House + Game Tables",
  prod_party_race_together: "Race Together Upgrade",
  prod_party_private_track: "Private Track (2 Hours)",
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

/** The cart page rebuilds the cart from `add`, and fills the code box from `code`. */
export function cartUrl(items: CartLine[] | null | undefined, code?: string) {
  const params = new URLSearchParams();
  const lines = (items ?? []).filter(
    (line) =>
      PRODUCT_NAMES[line.id] &&
      Number.isInteger(line.quantity) &&
      line.quantity > 0,
  );
  if (lines.length) {
    params.set(
      "add",
      lines.map((line) => `${line.id}:${line.quantity}`).join(","),
    );
  }
  if (code) params.set("code", code);
  const query = params.toString();
  return `${SITE_URL}/cart${query ? `?${query}` : ""}`;
}

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
  | { type: "items"; items: CartLine[] }
  | { type: "code"; offer: Offer }
  | { type: "note"; text: string }
  | { type: "hours" };

type Content = {
  subject: string;
  preheader: string;
  heading: string;
  blocks: Block[];
  cta: { label: string; url: string };
  closing: string;
  reason: string;
};

function itemLines(items: CartLine[]): string[] {
  return items
    .filter((line) => PRODUCT_NAMES[line.id])
    .map((line) => `${PRODUCT_NAMES[line.id]} × ${line.quantity}`);
}

function contentFor(input: EmailInput): Content {
  const items = input.items ?? [];
  const offer = input.offer ?? null;
  const closing = `Questions about racing or a party? Reply to this email or call ${BUSINESS.phone}.`;
  const accountReason =
    "You're getting this because you have an account at baytowngokarts.com.";
  const checkoutReason =
    "You're getting this because you started a checkout at baytowngokarts.com.";

  switch (input.kind) {
    case "checkout_reminder":
      return {
        subject: "You left your races in the cart",
        preheader:
          "Your Speedway 146 cart is saved. Finish checking out in a minute.",
        heading: "Your races are still waiting",
        blocks: [
          {
            type: "p",
            text: "You started checking out at Speedway 146 but didn't finish. Your cart is saved, so it's one click to pick up where you left off.",
          },
          { type: "items", items },
        ],
        cta: { label: "Finish checking out", url: cartUrl(items) },
        closing,
        reason: checkoutReason,
      };
    case "checkout_offer": {
      const percent = offer?.percentOff ?? 10;
      return {
        subject: `${percent}% off the races in your cart`,
        preheader: offer
          ? `Use code ${offer.code} by ${formatDay(offer.expiresAt)}.`
          : "",
        heading: `Take ${percent}% off your cart`,
        blocks: [
          {
            type: "p",
            text: `Still thinking it over? Here's ${percent}% off the cart you left at Speedway 146.`,
          },
          ...(offer ? [{ type: "code", offer } as Block] : []),
          { type: "items", items },
        ],
        cta: {
          label: `Use my ${percent}% off`,
          url: cartUrl(items, offer?.code),
        },
        closing,
        reason: checkoutReason,
      };
    }
    case "first_race":
      return {
        subject: "Ready for your first race at Speedway 146?",
        preheader: "Thursday nights: 2.5 hours of unlimited racing for $49.99.",
        heading: "Your first race is waiting",
        blocks: [
          {
            type: "p",
            text: "Thanks for making a Speedway 146 account. When you're ready to hit the track, buy your wristbands online and go straight to racing.",
          },
          { type: "note", text: BUSINESS.thursday },
          { type: "hours" },
        ],
        cta: { label: "See prices", url: `${SITE_URL}/pricing` },
        closing,
        reason: accountReason,
      };
    case "come_back":
      return {
        subject: "Time for another race?",
        preheader: "Speedway 146 is open Thursday to Sunday in Baytown.",
        heading: "The track misses you",
        blocks: [
          {
            type: "p",
            text: "It's been a while since your last race at Speedway 146. Bring the crew back out. The bigger ticket bundles bring each race down to as little as $8.",
          },
          { type: "note", text: BUSINESS.thursday },
          { type: "hours" },
        ],
        cta: { label: "Book your next race", url: `${SITE_URL}/pricing` },
        closing,
        reason: accountReason,
      };
    case "come_back_offer": {
      const percent = offer?.percentOff ?? 10;
      return {
        subject: `${percent}% off your next race at Speedway 146`,
        preheader: offer
          ? `Use code ${offer.code} online by ${formatDay(offer.expiresAt)}.`
          : "",
        heading: `${percent}% off to get you back on the track`,
        blocks: [
          {
            type: "p",
            text: `We'd love to see you back at Speedway 146. Here's ${percent}% off your next online order.`,
          },
          ...(offer ? [{ type: "code", offer } as Block] : []),
          { type: "hours" },
        ],
        cta: {
          label: `Use my ${percent}% off`,
          url: cartUrl(null, offer?.code),
        },
        closing,
        reason: accountReason,
      };
    }
  }
}

function blockHtml(block: Block): string {
  const p = `margin:0 0 16px;font-size:16px;line-height:24px;color:${COLORS.asphaltText};`;
  switch (block.type) {
    case "p":
      return `<p style="${p}">${escapeHtml(block.text)}</p>`;
    case "items": {
      const lines = itemLines(block.items);
      if (!lines.length) return "";
      const rows = lines
        .map(
          (line) =>
            `<tr><td style="padding:10px 0;border-top:1px solid ${COLORS.line};font-size:15px;line-height:22px;color:${COLORS.asphaltText};">${escapeHtml(line)}</td></tr>`,
        )
        .join("");
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;border-bottom:1px solid ${COLORS.line};"><tr><td style="padding:0 0 6px;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:${COLORS.muted};font-weight:bold;">Your cart</td></tr>${rows}</table>`;
    }
    case "code":
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;"><tr><td align="center" style="padding:20px;background:${COLORS.raceTint};border:2px dashed ${COLORS.raceLine};border-radius:8px;"><div style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:${COLORS.muted};font-weight:bold;">Your code</div><div style="margin:6px 0;font-family:'Courier New',Courier,monospace;font-size:28px;line-height:34px;font-weight:bold;letter-spacing:3px;color:${COLORS.asphalt};">${escapeHtml(block.offer.code)}</div><div style="font-size:14px;line-height:20px;color:${COLORS.asphaltText};">${block.offer.percentOff}% off, good through ${escapeHtml(formatDay(block.offer.expiresAt))}. One use, on your account only.</div></td></tr></table>`;
    case "note":
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;"><tr><td style="padding:14px 16px;background:${COLORS.page};border-left:4px solid ${COLORS.race};font-size:15px;line-height:22px;color:${COLORS.asphaltText};font-weight:bold;">${escapeHtml(block.text)}</td></tr></table>`;
    case "hours":
      return `<p style="margin:0 0 6px;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:${COLORS.muted};font-weight:bold;">Hours</p><p style="${p}">${BUSINESS.hours.map(escapeHtml).join("<br>")}<br>Closed Monday to Wednesday</p>`;
  }
}

function blockText(block: Block): string {
  switch (block.type) {
    case "p":
    case "note":
      return block.text;
    case "items": {
      const lines = itemLines(block.items);
      return lines.length
        ? `Your cart:\n${lines.map((line) => `- ${line}`).join("\n")}`
        : "";
    }
    case "code":
      return `Your code: ${block.offer.code}\n${block.offer.percentOff}% off, good through ${formatDay(block.offer.expiresAt)}. One use, on your account only.`;
    case "hours":
      return `Hours:\n${BUSINESS.hours.join("\n")}\nClosed Monday to Wednesday`;
  }
}

export function renderEmail(input: EmailInput): Email {
  const content = contentFor(input);
  const unsubscribe = escapeHtml(input.unsubscribeUrl);
  const body = content.blocks.map(blockHtml).join("");

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(content.subject)}</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.page};font-family:Helvetica,Arial,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(content.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.page};">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
<tr><td style="background:${COLORS.asphalt};padding:20px 28px;border-radius:10px 10px 0 0;border-bottom:4px solid ${COLORS.race};">
<a href="${SITE_URL}" style="text-decoration:none;font-size:26px;line-height:30px;font-weight:900;letter-spacing:2px;color:#ffffff;">SPEEDWAY <span style="color:${COLORS.race};">146</span></a>
</td></tr>
<tr><td style="background:${COLORS.chalk};padding:32px 28px 24px;">
<h1 style="margin:0 0 16px;font-size:28px;line-height:34px;font-weight:900;color:${COLORS.asphalt};">${escapeHtml(content.heading)}</h1>
${body}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;"><tr><td style="background:${COLORS.race};border-radius:6px;">
<a href="${escapeHtml(content.cta.url)}" style="display:inline-block;padding:14px 28px;font-size:17px;line-height:22px;font-weight:bold;color:#ffffff;text-decoration:none;">${escapeHtml(content.cta.label)}</a>
</td></tr></table>
<p style="margin:0;font-size:14px;line-height:21px;color:${COLORS.muted};">${escapeHtml(content.closing)}</p>
</td></tr>
<tr><td style="padding:20px 28px;font-size:12px;line-height:18px;color:${COLORS.muted};">
${escapeHtml(BUSINESS.name)} · ${escapeHtml(BUSINESS.address)}<br>
${escapeHtml(content.reason)} <a href="${unsubscribe}" style="color:${COLORS.muted};text-decoration:underline;">Unsubscribe</a>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  const text = [
    content.heading,
    "",
    ...content.blocks
      .map(blockText)
      .filter(Boolean)
      .flatMap((paragraph) => [paragraph, ""]),
    `${content.cta.label}: ${content.cta.url}`,
    "",
    content.closing,
    "",
    "--",
    `${BUSINESS.name} · ${BUSINESS.address}`,
    content.reason,
    `Unsubscribe: ${input.unsubscribeUrl}`,
  ].join("\n");

  return { subject: content.subject, html, text };
}
