// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  SIGNUP_KIND,
  newPromoCode,
  renderEmail,
  type Offer,
} from "../_shared/emails.ts";
import { mailer } from "../_shared/mail.ts";

/*
 * The site's sign-up offer. A visitor gives the form an email address and is
 * mailed a one-time code for 10% off. Mailing the code rather than showing it
 * is what proves the address is theirs.
 *
 * One inbox gets one code, ever. The send is claimed in email_log under the
 * inbox's key before anything is minted, so a second sign-up, a double press
 * or a second spelling of the same Gmail address finds the claim and sends
 * nothing. A send that failed is retaken by the next attempt, three times at
 * most, the same as the sweep's.
 *
 * Each network gets a handful of sign-ups an hour, and the site a ceiling
 * across all of them, so the form cannot be turned into a way to mail
 * strangers or to mint codes by the hundred.
 *
 * The address is recorded as a marketing contact in email_subscribers, linked
 * to the account that has the same address if there is one. The code is a
 * promo_codes row like every other: bound to that account, or, with no
 * account yet, to the address, for the first account with that address to
 * claim from its cart.
 *
 * `dryRun` checks the address and renders the email, and touches nothing: no
 * row is read or written and nothing is sent.
 */

// @ts-ignore
const env = (name: string) => Deno.env.get(name) ?? "";

const SUPABASE_URL = env("SUPABASE_URL");
const SERVICE_ROLE_KEY = env("SUPABASE_SERVICE_ROLE_KEY");
const RESEND_API_KEY = env("RESEND_API_KEY");

const db = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { claim, deliver } = mailer(db, {
  resendKey: RESEND_API_KEY,
  from: env("EMAIL_FROM") || "Speedway 146 <hello@baytowngokarts.com>",
  replyTo: env("EMAIL_REPLY_TO") || "hello@baytowngokarts.com",
  confirmationsOn: false,
});

const OFFER_PERCENT = 10;
const OFFER_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;

const LIMITS = { networkHour: 5, networkDay: 20, siteHour: 120 };

const ALLOWED_ORIGINS = new Set([
  "https://baytowngokarts.com",
  "https://www.baytowngokarts.com",
  "http://localhost:5173",
  "http://localhost:4173",
]);

const PAGE = /^\/[a-z0-9/-]{0,80}$/;

function corsFor(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin)
      ? origin
      : "https://baytowngokarts.com",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

const LOCAL_PART =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/;
const DOMAIN_LABEL = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
const TOP_LEVEL = /^(?:[a-z]{2,63}|xn--[a-z0-9-]{1,59})$/;

/** The address as it will be stored and mailed, or null if it isn't one. */
export function normalizeAddress(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const address = value.trim().toLowerCase();
  if (!address || address.length > 254) return null;
  const at = address.lastIndexOf("@");
  if (at < 1) return null;
  const local = address.slice(0, at);
  const labels = address.slice(at + 1).split(".");
  if (local.length > 64 || !LOCAL_PART.test(local)) return null;
  if (labels.length < 2 || !labels.every((label) => DOMAIN_LABEL.test(label)))
    return null;
  if (!TOP_LEVEL.test(labels[labels.length - 1])) return null;
  return address;
}

/**
 * The inbox an address delivers to. A +tag lands in the same inbox nearly
 * everywhere, and Gmail ignores dots, so each of those is the same reader
 * asking twice.
 */
export function mailboxKey(address: string): string {
  const at = address.lastIndexOf("@");
  let local = address.slice(0, at).split("+")[0];
  let domain = address.slice(at + 1);
  if (domain === "googlemail.com") domain = "gmail.com";
  if (domain === "gmail.com") local = local.replace(/\./g, "");
  return `${local}@${domain}`;
}

type DnsAnswer = { type: number; data: string };

async function lookUp(name: string, type: string) {
  const response = await fetch(
    `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`,
    {
      headers: { accept: "application/dns-json" },
      signal: AbortSignal.timeout(2000),
    },
  );
  if (!response.ok) return null;
  return (await response.json()) as { Status: number; Answer?: DnsAnswer[] };
}

/**
 * Whether the domain can take mail at all, so a typo like gmail.con is caught
 * here instead of bouncing off Resend and counting against the domain the
 * track sends from. Mail goes to the MX hosts, or to the domain itself when
 * there are none; a domain with neither, or a null MX, takes nothing. When
 * DNS cannot be asked, the address is let through.
 */
async function takesMail(domain: string): Promise<boolean> {
  try {
    const mx = await lookUp(domain, "MX");
    if (!mx) return true;
    if (mx.Status === 3) return false;
    if (mx.Status !== 0) return true;
    const exchanges = (mx.Answer ?? []).filter((answer) => answer.type === 15);
    if (exchanges.length) {
      return !exchanges.every((answer) =>
        /^0\s+\.?$/.test(String(answer.data).trim()),
      );
    }
    for (const type of ["A", "AAAA"]) {
      const host = await lookUp(domain, type);
      if (!host) return true;
      if ((host.Answer ?? []).some((answer) => answer.type !== 5)) return true;
    }
    return false;
  } catch {
    return true;
  }
}

/** The network a request came from: the address for IPv4, the /64 for IPv6. */
function networkOf(req: Request): string {
  const ip =
    req.headers.get("cf-connecting-ip") ||
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    "unknown";
  if (!ip.includes(":")) return ip;
  const [head, tail = ""] = ip.split("::");
  const front = head ? head.split(":") : [];
  const back = tail ? tail.split(":") : [];
  const groups = ip.includes("::")
    ? [
        ...front,
        ...Array(Math.max(8 - front.length - back.length, 0)).fill("0"),
        ...back,
      ]
    : front;
  return `${groups.slice(0, 4).join(":")}::/64`;
}

/** Keyed, so the stored value cannot be walked back to an address. */
async function hashNetwork(network: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SERVICE_ROLE_KEY || "email-offer"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(network),
  );
  return Array.from(new Uint8Array(mac))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

const unsubscribePage = (token: string) =>
  `https://baytowngokarts.com/unsubscribe?token=${encodeURIComponent(token)}`;
const unsubscribeOneClick = (token: string) =>
  `${SUPABASE_URL}/functions/v1/email-unsubscribe?token=${encodeURIComponent(token)}`;

/**
 * A single-use code for the account, or for the address when there is no
 * account yet.
 */
async function mintOffer(
  email: string,
  userId: string | null,
): Promise<Offer & { id: string }> {
  const expiresAt = new Date(Date.now() + OFFER_LIFETIME_MS);
  // A collision on the unique code is a one-in-a-billion draw; one more try
  // covers it.
  for (let tries = 0; tries < 2; tries += 1) {
    const code = newPromoCode();
    const { data, error } = await db
      .from("promo_codes")
      .insert({
        code,
        user_id: userId,
        email,
        percent_off: OFFER_PERCENT,
        reason: SIGNUP_KIND,
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

serve(async (req: Request) => {
  const cors = corsFor(req);
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...cors, "Content-Type": "application/json" },
    });

  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only." }, 405);

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return json(
      { error: "Enter the email address to send your code to." },
      400,
    );
  }

  // The form carries a field people never see. Whatever filled it in is not a
  // person, and is told it worked so there is nothing for it to learn.
  if (typeof body.pit_crew === "string" && body.pit_crew.trim()) {
    return json({ status: "sent" });
  }

  const email = normalizeAddress(body.email);
  if (!email) {
    return json(
      {
        error: "That email address doesn't look right. Check it and try again.",
      },
      400,
    );
  }
  if (!(await takesMail(email.slice(email.lastIndexOf("@") + 1)))) {
    return json(
      {
        error:
          "That email address can't get mail. Check the spelling and try again.",
      },
      400,
    );
  }
  const key = mailboxKey(email);

  if (body.dryRun === true) {
    const preview = renderEmail({
      kind: SIGNUP_KIND,
      offer: {
        code: "RACE-K7M2QX",
        percentOff: OFFER_PERCENT,
        expiresAt: new Date(Date.now() + OFFER_LIFETIME_MS),
      },
      unsubscribeUrl: unsubscribePage("preview"),
    });
    return json({
      dryRun: true,
      status: "would send",
      email,
      mailbox: key,
      subject: preview.subject,
    });
  }

  if (!RESEND_API_KEY || !SERVICE_ROLE_KEY) {
    console.error("email-offer: RESEND_API_KEY or the service role is not set");
    return json(
      { error: "Sign-ups are paused for a moment. Please try again later." },
      503,
    );
  }

  try {
    const allowance = await db.rpc("email_offer_allowance", {
      p_ip_hash: await hashNetwork(networkOf(req)),
    });
    if (allowance.error) throw allowance.error;
    const counts = (allowance.data ?? [])[0] ?? {};
    if (
      counts.network_hour > LIMITS.networkHour ||
      counts.network_day > LIMITS.networkDay
    ) {
      return json(
        {
          error:
            "That's a lot of sign-ups from one connection. Please try again later.",
        },
        429,
      );
    }
    if (counts.site_hour > LIMITS.siteHour) {
      return json(
        { error: "Sign-ups are busy right now. Try again in a few minutes." },
        429,
      );
    }

    const page =
      typeof body.page === "string" && PAGE.test(body.page) ? body.page : null;
    const contact = await db.rpc("email_offer_contact", {
      p_email: email,
      p_email_key: key,
      p_source_path: page,
    });
    if (contact.error) throw contact.error;
    const subscriber = (contact.data ?? [])[0];
    if (!subscriber?.token) throw new Error("no subscriber row came back");
    const userId: string | null = subscriber.account_id ?? null;

    const held = await claim(SIGNUP_KIND, { user_id: userId, ref: key }, email);
    if (!held) return json({ status: "already" });

    let offer: (Offer & { id: string }) | null = null;
    let delivered = false;
    try {
      offer = await mintOffer(email, userId);
      const message = renderEmail({
        kind: SIGNUP_KIND,
        offer,
        unsubscribeUrl: unsubscribePage(subscriber.token),
      });
      const providerId = await deliver(
        email,
        SIGNUP_KIND,
        message,
        unsubscribeOneClick(subscriber.token),
        `${held.id}-${held.attempts}`,
      );
      delivered = true;
      const stamped = await db
        .from("email_log")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
          provider_id: providerId,
          promo_code_id: offer.id,
        })
        .eq("id", held.id);
      if (stamped.error) throw stamped.error;
      return json({ status: "sent" });
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : String(cause);
      // Once the email has gone, the code in it has to keep working, so a
      // failure stamping the log is reported without taking the code back.
      if (delivered) {
        console.error(
          "email-offer: send %s went out but was not stamped: %s",
          held.id,
          message,
        );
        return json({ status: "sent" });
      }
      console.error("email-offer: send %s failed: %s", held.id, message);
      // A code nobody was told about is withdrawn, so the retry mints a fresh
      // one rather than leaving a live code no inbox holds.
      if (offer) await db.from("promo_codes").delete().eq("id", offer.id);
      await db
        .from("email_log")
        .update({ status: "failed", error: message.slice(0, 1000) })
        .eq("id", held.id);
      return json(
        {
          error:
            "We couldn't send your code just now. Please try again in a minute.",
        },
        502,
      );
    }
  } catch (cause) {
    console.error(
      "email-offer: %s",
      cause instanceof Error ? cause.message : cause,
    );
    return json({ error: "That didn't go through. Please try again." }, 500);
  }
});
