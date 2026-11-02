/*
 * The order row for a paid checkout, built from what Stripe says was bought.
 * Pure, like emails.ts: given the session and its line items it returns the
 * purchases row, so the cases can check it without Stripe or a database.
 *
 * The success page writes the same row from the buyer's browser and usually
 * gets there first. This is the copy for the buyer whose browser never came
 * back to it: Stripe's notice never reaches this project, so the sweep asks
 * Stripe about each open checkout itself and writes the order a paid one is
 * missing. Both writers are keyed on the session, so whichever comes second
 * is refused and the order is recorded once.
 */

// The two lines create-checkout adds after the products. They are part of
// what the buyer paid, and of total_amount, but not something they bought.
const CHARGE_LINES = new Set(["sales tax", "transaction fee"]);

// Every host the site's checkouts have returned to. The Stripe account also
// carries other sites' checkouts, and a session that returns anywhere else
// is not one of this site's orders.
const SITE_HOSTS = new Set([
  "baytowngokarts.com",
  "www.baytowngokarts.com",
  "baytowngocarts.com",
  "www.baytowngocarts.com",
]);

export type StripeLineItem = {
  description: string | null;
  quantity: number | null;
  amount_total: number;
  price?: { unit_amount: number | null } | null;
};

export type StripeSession = {
  id: string;
  status: string | null;
  payment_status: string;
  amount_total: number | null;
  created: number;
  success_url: string | null;
  customer_email: string | null;
  customer_details?: { email: string | null } | null;
  metadata?: Record<string, string> | null;
  payment_intent?: string | { id: string; created: number } | null;
};

export type PurchaseItem = {
  product_name: string;
  price: number;
  quantity: number;
  subtotal: number;
};

export type PurchaseRow = {
  user_id: string;
  order_number: string;
  items: PurchaseItem[];
  total_amount: number;
  total_quantity: number;
  status: "completed";
  stripe_session_id: string;
  stripe_payment_intent_id: string | null;
  customer_email: string | null;
  created_at: string;
};

/** Finished and paid. A bank debit can finish a session before it pays. */
export const isPaid = (session: StripeSession) =>
  session.status === "complete" &&
  (session.payment_status === "paid" ||
    session.payment_status === "no_payment_required");

/** Whether this site opened the session, read off where it sends the buyer. */
export function isSiteSession(session: StripeSession): boolean {
  try {
    return SITE_HOSTS.has(new URL(session.success_url ?? "").hostname);
  } catch {
    return false;
  }
}

/**
 * When the money moved. The payment intent is made as the buyer confirms, so
 * its time is the sale's; the session's own is when they reached Stripe.
 */
export function paidAt(session: StripeSession): Date {
  const intent = session.payment_intent;
  const seconds =
    intent && typeof intent === "object" ? intent.created : session.created;
  return new Date(seconds * 1000);
}

/** "SPW146-2026-482913", the shape the success page writes. */
export function orderNumber(at: Date, digits?: string): string {
  const year = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
  }).format(at);
  const draw =
    digits ??
    String(crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000).padStart(
      6,
      "0",
    );
  return `SPW146-${year}-${draw}`;
}

/** The products bought, with each one's own price rather than the line's. */
export function purchaseItems(lines: StripeLineItem[]): PurchaseItem[] {
  return lines
    .filter(
      (line) =>
        (line.quantity ?? 0) > 0 &&
        !CHARGE_LINES.has((line.description ?? "").trim().toLowerCase()),
    )
    .map((line) => {
      const quantity = line.quantity ?? 0;
      const price =
        line.price?.unit_amount ?? Math.round(line.amount_total / quantity);
      return {
        product_name: line.description ?? "",
        price,
        quantity,
        subtotal: price * quantity,
      };
    });
}

export function purchaseRow(
  session: StripeSession,
  lines: StripeLineItem[],
  userId: string,
  number: string,
): PurchaseRow {
  const items = purchaseItems(lines);
  const intent = session.payment_intent;
  return {
    user_id: userId,
    order_number: number,
    items,
    total_amount: session.amount_total ?? 0,
    total_quantity: items.reduce((sum, item) => sum + item.quantity, 0),
    status: "completed",
    stripe_session_id: session.id,
    stripe_payment_intent_id:
      typeof intent === "string" ? intent : (intent?.id ?? null),
    customer_email:
      session.customer_details?.email || session.customer_email || null,
    created_at: paidAt(session).toISOString(),
  };
}
