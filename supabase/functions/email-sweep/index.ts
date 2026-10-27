// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  CHECKOUT_KINDS,
  KINDS,
  OFFER_KINDS,
  centralHour,
  newPromoCode,
  renderEmail,
  type CartLine,
  type Kind,
  type Offer,
} from "./emails.ts";

/*
 * Every fifteen minutes pg_cron posts here, and this sends whatever cart
 * reminders, cart offers and come-back emails are due.
 *
 * First it settles the checkouts Stripe has finished with: an open attempt past
 * its expiry is looked up on Stripe and closed as paid, expired or gone. That
 * is what makes the reminder independent of whether the webhook was ever
 * subscribed to checkout.session.expired.
 *
 * Then, kind by kind, it asks email_candidates() who is due, writes a row to
 * email_log before each send, and stamps it once Resend has the message. The
 * unique (kind, ref) on that table is what stops a second sweep sending the
 * same email again. A failed send is retaken by a later sweep, three times at
 * most.
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
const FROM = env("EMAIL_FROM") || "Speedway 146 <races@baytowngokarts.com>";
const REPLY_TO = env("EMAIL_REPLY_TO") || "speedsway146@gmail.com";

const db = createClient(SUPABASE_URL, env("SUPABASE_SERVICE_ROLE_KEY"), {
  auth: { autoRefreshToken: false, persistSession: false },
});

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

const MAX_ATTEMPTS = 3;
const SETTLE_GRACE_MS = 2 * 60 * 1000;

type Candidate = {
  user_id: string;
  email: string;
  ref: string;
  attempt_id: string | null;
  items: CartLine[] | null;
  unsubscribe_token: string;
};

type Claim = { id: string; attempts: number };

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

/** Closes the open checkouts Stripe is finished with. */
async function settleOpenAttempts() {
  const settled = { completed: 0, expired: 0, void: 0, open: 0, errors: 0 };
  const cutoff = new Date(Date.now() - SETTLE_GRACE_MS).toISOString();
  const { data, error } = await db
    .from("checkout_attempts")
    .select("id, stripe_session_id")
    .eq("status", "open")
    .lt("expires_at", cutoff)
    .limit(50);
  if (error) throw error;

  for (const attempt of data ?? []) {
    const response = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(attempt.stripe_session_id)}`,
      { headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` } },
    );
    let status: "completed" | "expired" | "void" | null = null;
    if (response.status === 404) {
      status = "void";
    } else if (response.ok) {
      const session = await response.json();
      if (session.status === "complete") status = "completed";
      else if (session.status === "expired") status = "expired";
    } else {
      settled.errors += 1;
      console.error(
        "email-sweep: Stripe answered %d for %s",
        response.status,
        attempt.stripe_session_id,
      );
      continue;
    }
    if (!status) {
      settled.open += 1;
      continue;
    }
    const { error: updateError } = await db
      .from("checkout_attempts")
      .update({ status, closed_at: new Date().toISOString() })
      .eq("id", attempt.id)
      .eq("status", "open");
    if (updateError) throw updateError;
    settled[status] += 1;
  }
  return settled;
}

/**
 * Writes the log row this send will be stamped on, or retakes one an earlier
 * sweep failed. Null when somebody else already holds it.
 */
async function claim(kind: Kind, candidate: Candidate): Promise<Claim | null> {
  const inserted = await db
    .from("email_log")
    .insert({
      user_id: candidate.user_id,
      email: candidate.email,
      kind,
      ref: candidate.ref,
    })
    .select("id, attempts")
    .single();
  if (!inserted.error) return inserted.data;
  if (inserted.error.code !== "23505") throw inserted.error;

  const held = await db
    .from("email_log")
    .select("id, attempts, status")
    .eq("kind", kind)
    .eq("ref", candidate.ref)
    .single();
  if (held.error) throw held.error;
  if (held.data.status !== "failed" || held.data.attempts >= MAX_ATTEMPTS) {
    return null;
  }
  const retaken = await db
    .from("email_log")
    .update({
      status: "claimed",
      attempts: held.data.attempts + 1,
      email: candidate.email,
      error: null,
    })
    .eq("id", held.data.id)
    .eq("status", "failed")
    .eq("attempts", held.data.attempts)
    .select("id, attempts")
    .maybeSingle();
  if (retaken.error) throw retaken.error;
  return retaken.data ?? null;
}

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

/** Hands one message to Resend and returns its id. */
async function deliver(
  to: string,
  kind: Kind,
  email: { subject: string; html: string; text: string },
  oneClick: string,
  idempotencyKey: string,
): Promise<string> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      reply_to: REPLY_TO,
      subject: email.subject,
      html: email.html,
      text: email.text,
      headers: {
        "List-Unsubscribe": `<${oneClick}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
      tags: [
        { name: "site", value: "speedway146" },
        { name: "kind", value: kind },
      ],
    }),
  });
  const answer = await response.json().catch(() => ({}));
  if (!response.ok || !answer.id) {
    throw new Error(
      `resend answered ${response.status}: ${answer.message ?? "no id"}`,
    );
  }
  return answer.id;
}

/** One email, from its claim to its stamp. */
async function sendOne(
  kind: Kind,
  candidate: Candidate,
): Promise<"sent" | "held" | "failed"> {
  const held = await claim(kind, candidate);
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
      candidate.email,
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

type Options = {
  dryRun: boolean;
  kinds: Kind[];
  onlyUserId: string | null;
  ignoreWindow: boolean;
};

function readOptions(body: Record<string, unknown>): Options | string {
  const kinds = Array.isArray(body.kinds) ? body.kinds : KINDS;
  if (
    !kinds.every((kind) => (KINDS as readonly string[]).includes(String(kind)))
  ) {
    return `kinds must be drawn from ${KINDS.join(", ")}`;
  }
  const onlyUserId =
    typeof body.onlyUserId === "string" ? body.onlyUserId : null;
  return {
    dryRun: body.dryRun === true,
    kinds: kinds as Kind[],
    onlyUserId,
    // Only with one named account, so a test can run outside the hours and a
    // mistyped body cannot send the whole list at midnight.
    ignoreWindow: body.ignoreWindow === true && onlyUserId !== null,
  };
}

/** Renders every kind with sample content and sends it to one address. */
async function preview(to: string, kinds: Kind[]) {
  const sent: Record<string, string> = {};
  for (const kind of kinds) {
    const email = renderEmail({
      kind,
      items: [
        { id: "prod_single_kart_15", quantity: 1 },
        { id: "prod_party_bounce_upgrade", quantity: 1 },
      ],
      offer: OFFER_KINDS.includes(kind)
        ? {
            code: "RACE-SAMPLE",
            percentOff: OFFER_PERCENT,
            expiresAt: new Date(Date.now() + (OFFER_LIFETIME_MS[kind] ?? 0)),
          }
        : null,
      unsubscribeUrl: "https://baytowngokarts.com/unsubscribe?token=preview",
    });
    sent[kind] = await deliver(
      to,
      kind,
      { ...email, subject: `[Preview] ${email.subject}` },
      `${SUPABASE_URL}/functions/v1/email-unsubscribe?token=preview`,
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

    const settled = options.dryRun ? null : await settleOpenAttempts();
    const now = new Date();
    const report: Record<string, unknown> = {};
    const budget = { ...PER_SWEEP };

    for (const kind of options.kinds) {
      const group = groupOf(kind);
      if (!options.ignoreWindow && !inWindow(kind, now) && !options.dryRun) {
        report[kind] = { skipped: "outside sending hours" };
        continue;
      }
      const { data, error } = await db.rpc("email_candidates", {
        p_kind: kind,
        p_limit: options.dryRun ? 500 : budget[group],
      });
      if (error) throw error;
      const due = ((data ?? []) as Candidate[]).filter(
        (candidate) =>
          !options.onlyUserId || candidate.user_id === options.onlyUserId,
      );

      if (options.dryRun) {
        report[kind] = { due: due.length, users: due.map((c) => c.user_id) };
        continue;
      }

      const tally = { sent: 0, held: 0, failed: 0 };
      for (const candidate of due) {
        if (budget[group] <= 0) break;
        const outcome = await sendOne(kind, candidate);
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
