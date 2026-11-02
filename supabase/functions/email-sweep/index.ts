// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkouts } from "../_shared/checkout.ts";
import {
  CHECKOUT_KINDS,
  KINDS,
  OFFER_KINDS,
  ORDER_KIND,
  centralHour,
  newPromoCode,
  renderEmail,
  type CartLine,
  type EmailKind,
  type Kind,
  type Offer,
} from "../_shared/emails.ts";
import { mailer, type OrderDue } from "../_shared/mail.ts";

/*
 * pg_cron posts here on two clocks. Every thirty seconds it asks for the order
 * kind alone: open checkouts are looked up on Stripe, a paid one gets the
 * order the success page never wrote, and new orders are confirmed. Every
 * fifteen minutes it asks for everything, which adds whatever cart reminders,
 * cart offers and come-back emails are due.
 *
 * Settling comes first. Each open attempt is looked up on Stripe: a paid one
 * is completed through the same code checkout-complete runs when the buyer
 * lands back, and an expired or missing one is closed as that. Stripe's own
 * notice never reaches this project - its webhook listens to connected
 * accounts, and these checkouts belong to the platform - so asking is the
 * only way a buyer who paid and never came back gets an order at all.
 *
 * Then, kind by kind, it asks the database who is due and sends through the
 * shared mailer, which writes email_log before each send so no email goes out
 * twice. Order confirmations come from order_confirmations_due() and go out
 * at any hour; the rest come from email_candidates() inside their hours.
 *
 * The caller proves itself with x-sweep-secret, which pg_cron reads out of the
 * database vault.
 */

// @ts-ignore
const env = (name: string) => Deno.env.get(name) ?? "";

const SUPABASE_URL = env("SUPABASE_URL");
const STRIPE_SECRET_KEY = env("STRIPE_SECRET_KEY");
const RESEND_API_KEY = env("RESEND_API_KEY");
const SWEEP_SECRET = env("EMAIL_SWEEP_SECRET");
// A test that names its own inbox, or a call that names one order, confirms
// whether or not this is on.
const CONFIRMATIONS_ON = env("ORDER_CONFIRMATIONS") === "on";

const db = createClient(SUPABASE_URL, env("SUPABASE_SERVICE_ROLE_KEY"), {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { claim, deliver, sendConfirmation } = mailer(db, {
  resendKey: RESEND_API_KEY,
  from: env("EMAIL_FROM") || "Speedway 146 <hello@baytowngokarts.com>",
  // Replies come back to the domain, and email-inbound passes them on to the
  // track's Gmail.
  replyTo: env("EMAIL_REPLY_TO") || "hello@baytowngokarts.com",
  confirmationsOn: CONFIRMATIONS_ON,
});

const { recover, settleOpen } = checkouts(db, STRIPE_SECRET_KEY);

const OFFER_PERCENT = 10;
const HOUR_MS = 60 * 60 * 1000;
const OFFER_LIFETIME_MS: Partial<Record<Kind, number>> = {
  checkout_offer: 72 * HOUR_MS,
  come_back_offer: 14 * 24 * HOUR_MS,
};

// Hours on the track's clock an email may go out in, end exclusive. A cart
// left at 11 PM is reminded at 8 the next morning rather than at midnight.
const SEND_WINDOW: Record<"checkout" | "lifecycle", [number, number]> = {
  checkout: [8, 21],
  lifecycle: [10, 18],
};

// Resend takes two requests a second across the whole account, which the
// studio's own mail shares, so sends are spaced and each sweep is capped.
const SEND_SPACING_MS = 600;
const PER_SWEEP: Record<"checkout" | "lifecycle", number> = {
  checkout: 40,
  lifecycle: 20,
};
const ORDER_PER_SWEEP = 40;

const SESSION_ID = /^cs_(live|test)_[A-Za-z0-9]+$/;

type Candidate = {
  user_id: string;
  email: string;
  ref: string;
  attempt_id: string | null;
  items: CartLine[] | null;
  unsubscribe_token: string;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function sameSecret(presented: string): boolean {
  if (!SWEEP_SECRET || presented.length !== SWEEP_SECRET.length) return false;
  let diff = 0;
  for (let i = 0; i < presented.length; i += 1) {
    diff |= presented.charCodeAt(i) ^ SWEEP_SECRET.charCodeAt(i);
  }
  return diff === 0;
}

const groupOf = (kind: Kind) =>
  CHECKOUT_KINDS.includes(kind) ? "checkout" : "lifecycle";

function inWindow(kind: Kind, now: Date): boolean {
  const [start, end] = SEND_WINDOW[groupOf(kind)];
  const hour = centralHour(now);
  return hour >= start && hour < end;
}

const unsubscribePage = (token: string) =>
  `https://baytowngokarts.com/unsubscribe?token=${encodeURIComponent(token)}`;
const unsubscribeOneClick = (token: string) =>
  `${SUPABASE_URL}/functions/v1/email-unsubscribe?token=${encodeURIComponent(token)}`;

async function mintOffer(
  kind: Kind,
  userId: string,
): Promise<Offer & { id: string }> {
  const expiresAt = new Date(
    Date.now() + (OFFER_LIFETIME_MS[kind] ?? 72 * HOUR_MS),
  );
  // A collision on the unique code is a one-in-a-billion draw; one more try
  // covers it.
  for (let tries = 0; tries < 2; tries += 1) {
    const code = newPromoCode();
    const { data, error } = await db
      .from("promo_codes")
      .insert({
        code,
        user_id: userId,
        percent_off: OFFER_PERCENT,
        reason: kind,
        expires_at: expiresAt.toISOString(),
      })
      .select("id")
      .single();
    if (!error)
      return { id: data.id, code, percentOff: OFFER_PERCENT, expiresAt };
    if (error.code !== "23505") throw error;
  }
  throw new Error("could not mint a unique promo code");
}

/** One email, from its claim to its stamp. */
async function sendOne(
  kind: Kind,
  candidate: Candidate,
  deliverTo: string | null,
): Promise<"sent" | "held" | "failed"> {
  // A test names the account whose rows it runs on and the inbox it lands in,
  // so the whole pipeline runs for real without mailing the account itself.
  const to = deliverTo ?? candidate.email;
  const held = await claim(kind, candidate, to);
  if (!held) return "held";

  let offer: (Offer & { id: string }) | null = null;
  try {
    if (OFFER_KINDS.includes(kind))
      offer = await mintOffer(kind, candidate.user_id);
    const email = renderEmail({
      kind,
      items: candidate.items,
      offer,
      unsubscribeUrl: unsubscribePage(candidate.unsubscribe_token),
    });
    const providerId = await deliver(
      to,
      kind,
      email,
      unsubscribeOneClick(candidate.unsubscribe_token),
      `${held.id}-${held.attempts}`,
    );
    const sentAt = new Date().toISOString();
    const stamped = await db
      .from("email_log")
      .update({
        status: "sent",
        sent_at: sentAt,
        provider_id: providerId,
        promo_code_id: offer?.id ?? null,
      })
      .eq("id", held.id);
    if (stamped.error) throw stamped.error;
    if (candidate.attempt_id) {
      const column =
        kind === "checkout_reminder" ? "reminder_sent_at" : "offer_sent_at";
      const marked = await db
        .from("checkout_attempts")
        .update({ [column]: sentAt })
        .eq("id", candidate.attempt_id);
      if (marked.error) throw marked.error;
    }
    return "sent";
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    console.error(
      "email-sweep: %s %s failed: %s",
      kind,
      candidate.ref,
      message,
    );
    // A code nobody was told about is withdrawn, so the retry mints a fresh one
    // and the 90-day limit is not spent on an email that never arrived.
    if (offer) await db.from("promo_codes").delete().eq("id", offer.id);
    await db
      .from("email_log")
      .update({ status: "failed", error: message.slice(0, 1000) })
      .eq("id", held.id);
    return "failed";
  }
}

/**
 * Confirms the orders placed in the last day that have not been yet, which
 * is every order checkout-complete could not confirm the moment it was made.
 */
async function confirmOrders(options: Options) {
  const named = options.deliverTo !== null || options.orderId !== null;
  if (!CONFIRMATIONS_ON && !named && !options.dryRun) {
    return { skipped: "order confirmations are switched off" };
  }
  const { data, error } = await db.rpc("order_confirmations_due", {
    p_limit: options.dryRun ? 500 : ORDER_PER_SWEEP,
    p_user_id: options.onlyUserId,
    p_purchase_id: options.orderId,
  });
  if (error) throw error;
  const due = (data ?? []) as OrderDue[];

  if (options.dryRun) {
    return {
      switchedOn: CONFIRMATIONS_ON,
      due: due.length,
      orders: due.map((order) => order.order_number),
    };
  }
  const tally = { sent: 0, held: 0, failed: 0 };
  for (const order of due) {
    tally[await sendConfirmation(order, options.deliverTo)] += 1;
    await pause(SEND_SPACING_MS);
  }
  return tally;
}

type Options = {
  dryRun: boolean;
  kinds: EmailKind[];
  onlyUserId: string | null;
  deliverTo: string | null;
  orderId: string | null;
  ignoreWindow: boolean;
};

const ADDRESS = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ALL_KINDS: readonly EmailKind[] = [ORDER_KIND, ...KINDS];

function readOptions(body: Record<string, unknown>): Options | string {
  const kinds = Array.isArray(body.kinds) ? body.kinds : ALL_KINDS;
  if (
    !kinds.every((kind) =>
      (ALL_KINDS as readonly string[]).includes(String(kind)),
    )
  ) {
    return `kinds must be drawn from ${ALL_KINDS.join(", ")}`;
  }
  const onlyUserId =
    typeof body.onlyUserId === "string" ? body.onlyUserId : null;
  const deliverTo =
    typeof body.deliverTo === "string" ? body.deliverTo.trim() : null;
  if (deliverTo && (!onlyUserId || !ADDRESS.test(deliverTo))) {
    return "deliverTo needs a valid address and an onlyUserId";
  }
  const orderId = typeof body.orderId === "string" ? body.orderId : null;
  if (orderId && !UUID.test(orderId)) return "orderId must be a purchase id";
  return {
    dryRun: body.dryRun === true,
    kinds: kinds as EmailKind[],
    onlyUserId,
    deliverTo,
    // Confirms that one order at any age, and nothing else this run.
    orderId,
    // Only with one named account, so a test can run outside the hours and a
    // mistyped body cannot send the whole list at midnight.
    ignoreWindow: body.ignoreWindow === true && onlyUserId !== null,
  };
}

/** Renders every kind with sample content and sends it to one address. */
async function preview(to: string, kinds: EmailKind[]) {
  const sent: Record<string, string> = {};
  for (const kind of kinds) {
    const email =
      kind === ORDER_KIND
        ? renderEmail({
            kind,
            order: {
              number: "SPW146-2026-482913",
              items: [
                { product_name: "15 Tickets", price: 14999, quantity: 1 },
              ],
              total: 17016,
              placedAt: new Date(),
            },
          })
        : renderEmail({
            kind,
            items: [
              { id: "prod_single_kart_15", quantity: 2 },
              { id: "prod_party_bounce_upgrade", quantity: 1 },
            ],
            offer: OFFER_KINDS.includes(kind)
              ? {
                  code: "RACE-K7M2QX",
                  percentOff: OFFER_PERCENT,
                  expiresAt: new Date(
                    Date.now() + (OFFER_LIFETIME_MS[kind] ?? 0),
                  ),
                }
              : null,
            unsubscribeUrl:
              "https://baytowngokarts.com/unsubscribe?token=preview",
          });
    sent[kind] = await deliver(
      to,
      kind,
      { ...email, subject: `[Preview] ${email.subject}` },
      kind === ORDER_KIND
        ? null
        : `${SUPABASE_URL}/functions/v1/email-unsubscribe?token=preview`,
      crypto.randomUUID(),
    );
    await pause(SEND_SPACING_MS);
  }
  return sent;
}

serve(async (req: Request) => {
  if (req.method !== "POST") return json({ error: "POST only." }, 405);
  if (!sameSecret(req.headers.get("x-sweep-secret") ?? "")) {
    return json({ error: "That secret does not open this sweep." }, 401);
  }
  if (!RESEND_API_KEY || !STRIPE_SECRET_KEY) {
    console.error(
      "email-sweep: RESEND_API_KEY or STRIPE_SECRET_KEY is not set",
    );
    return json({ error: "The sweep is not configured." }, 503);
  }

  const body = await req.json().catch(() => ({}));
  const options = readOptions(body ?? {});
  if (typeof options === "string") return json({ error: options }, 400);

  try {
    if (typeof body?.previewTo === "string") {
      return json({ preview: await preview(body.previewTo, options.kinds) });
    }

    if (Array.isArray(body?.recoverSessions)) {
      const ids = body.recoverSessions.map(String);
      if (
        !ids.length ||
        ids.length > 20 ||
        !ids.every((id: string) => SESSION_ID.test(id))
      ) {
        return json(
          { error: "recoverSessions takes 1 to 20 Checkout session ids" },
          400,
        );
      }
      return json({
        dryRun: options.dryRun,
        recovered: await recover(ids, options.dryRun),
      });
    }

    const settled = await settleOpen(options.dryRun);
    const now = new Date();
    const report: Record<string, unknown> = {};
    const budget = { ...PER_SWEEP };

    for (const kind of options.kinds) {
      if (kind === ORDER_KIND) {
        report[kind] = await confirmOrders(options);
        continue;
      }
      // A call that names one order confirms it and sends nothing else.
      if (options.orderId) continue;
      const group = groupOf(kind);
      if (!options.ignoreWindow && !inWindow(kind, now) && !options.dryRun) {
        report[kind] = { skipped: "outside sending hours" };
        continue;
      }
      const { data, error } = await db.rpc("email_candidates", {
        p_kind: kind,
        p_limit: options.dryRun ? 500 : budget[group],
        p_user_id: options.onlyUserId,
      });
      if (error) throw error;
      const due = (data ?? []) as Candidate[];

      if (options.dryRun) {
        report[kind] = { due: due.length, users: due.map((c) => c.user_id) };
        continue;
      }

      const tally = { sent: 0, held: 0, failed: 0 };
      for (const candidate of due) {
        if (budget[group] <= 0) break;
        const outcome = await sendOne(kind, candidate, options.deliverTo);
        tally[outcome] += 1;
        if (outcome === "sent") budget[group] -= 1;
        await pause(SEND_SPACING_MS);
      }
      report[kind] = tally;
    }

    return json({ dryRun: options.dryRun, settled, report });
  } catch (cause) {
    console.error(
      "email-sweep: %s",
      cause instanceof Error ? cause.message : cause,
    );
    return json({ error: "The sweep stopped early." }, 500);
  }
});
