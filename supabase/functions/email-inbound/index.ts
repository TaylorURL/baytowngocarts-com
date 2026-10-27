// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

/*
 * Passes mail written to any baytowngokarts.com address on to the track's Gmail.
 *
 * The domain's MX points at Resend, which posts every message it receives here
 * as an `email.received` event. The event carries only who and what; the body
 * and the files are fetched by id, then sent on to EMAIL_FORWARD_TO with the
 * writer on Reply-To, so pressing Reply in Gmail answers the customer
 * directly.
 *
 * A send that fails answers 502, which is what makes Resend deliver the event
 * again. The forward is sent under an Idempotency-Key made from the received
 * message's id, so a repeat delivery of one that did go out sends nothing new.
 *
 * Mail from the domain's own addresses is not passed on. Anything the site
 * sends that comes back here would otherwise go round forever.
 *
 * Reads EMAIL_INBOUND_WEBHOOK_SECRET (the webhook's whsec_ signing secret),
 * RESEND_INBOUND_API_KEY (a full-access key: a sending-only one cannot read a
 * received message), EMAIL_FORWARD_TO and EMAIL_FROM.
 */

// @ts-ignore
const env = (name: string) => Deno.env.get(name) ?? "";

const SIGNING_SECRET = env("EMAIL_INBOUND_WEBHOOK_SECRET");
const RESEND_API_KEY = env("RESEND_INBOUND_API_KEY");
const FORWARD_TO = env("EMAIL_FORWARD_TO") || "speedsway146@gmail.com";
const FROM_ADDRESS = (
  env("EMAIL_FROM").match(/<([^>]+)>/)?.[1] || "hello@baytowngokarts.com"
).toLowerCase();
const DOMAIN = "baytowngokarts.com";
const RESEND = "https://api.resend.com";
// Svix refuses a delivery older than five minutes; so does this.
const TOLERANCE_SECONDS = 5 * 60;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const encoder = new TextEncoder();

function base64ToBytes(value: string): Uint8Array<ArrayBuffer> {
  const binary = atob(value);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function bytesToBase64(bytes: ArrayBuffer): string {
  let binary = "";
  for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function same(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1)
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Resend signs through Svix: `id.timestamp.body` under the base64 secret after
 * `whsec_`, with one or more `v1,<signature>` candidates on the header.
 */
async function signedByResend(req: Request, body: string): Promise<boolean> {
  const id = req.headers.get("svix-id");
  const stamp = req.headers.get("svix-timestamp");
  const offered = req.headers.get("svix-signature");
  if (!SIGNING_SECRET || !id || !stamp || !offered) return false;
  const age = Math.abs(Date.now() / 1000 - Number(stamp));
  if (!Number.isFinite(age) || age > TOLERANCE_SECONDS) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    base64ToBytes(SIGNING_SECRET.replace(/^whsec_/, "")),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const expected = bytesToBase64(
    await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(`${id}.${stamp}.${body}`),
    ),
  );
  return offered.split(" ").some((entry) => {
    const [version, value] = entry.split(",");
    return version === "v1" && Boolean(value) && same(value, expected);
  });
}

async function resend(path: string, init: RequestInit = {}) {
  const response = await fetch(`${RESEND}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const said = await response.text();
  if (!response.ok) {
    throw new Error(
      `resend answered ${response.status} on ${path}: ${said.slice(0, 300)}`,
    );
  }
  try {
    return JSON.parse(said);
  } catch {
    return {};
  }
}

/** The bare address out of `Name <address>` or an address alone. */
function addressOf(value: unknown): string {
  const text = String(value ?? "").trim();
  return (text.match(/<([^>]+)>/)?.[1] ?? text).trim().toLowerCase();
}

/** The display name out of `Name <address>`, or "". */
function nameOf(value: unknown): string {
  const match = String(value ?? "").match(/^\s*"?([^"<]*?)"?\s*</);
  return match ? match[1].trim() : "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function attachmentsOn(emailId: string, listed: unknown) {
  const carried = [];
  for (const entry of Array.isArray(listed) ? listed : []) {
    if (!entry?.id) continue;
    const file = await resend(
      `/emails/receiving/${encodeURIComponent(emailId)}/attachments/${encodeURIComponent(entry.id)}`,
    );
    if (!file?.download_url) continue;
    carried.push({
      filename: file.filename || entry.filename || "attachment",
      path: file.download_url,
      ...(file.content_type ? { content_type: file.content_type } : {}),
      ...(file.content_id
        ? { content_id: String(file.content_id).replace(/^<|>$/g, "") }
        : {}),
    });
  }
  return carried;
}

serve(async (req: Request) => {
  if (req.method !== "POST") return json({ error: "POST only." }, 405);

  const body = await req.text();
  if (!(await signedByResend(req, body))) {
    return json({ error: "not authorized" }, 401);
  }

  let event: { type?: string; data?: Record<string, unknown> } | null = null;
  try {
    event = JSON.parse(body);
  } catch {
    return json({ error: "body is not JSON" }, 400);
  }
  if (event?.type !== "email.received") return json({ ignored: "type" });

  const data = event.data ?? {};
  const reached = [
    ...((data.to as string[]) ?? []),
    ...((data.cc as string[]) ?? []),
    ...((data.received_for as string[]) ?? []),
  ].map(addressOf);
  // The webhook is the Resend account's, so mail for its other domains
  // arrives here too and is none of this function's business.
  const ours = reached.find((address) => address.endsWith(`@${DOMAIN}`));
  if (!ours) return json({ ignored: "not addressed to the domain" });

  const sender = addressOf(data.from);
  if (!sender || sender.endsWith(`@${DOMAIN}`)) {
    return json({ ignored: "sent from the domain itself" });
  }
  if (!RESEND_API_KEY) {
    console.error("email-inbound: RESEND_INBOUND_API_KEY is not set");
    return json({ error: "Mail is not configured here." }, 503);
  }

  try {
    const emailId = String(data.email_id ?? "");
    const full = await resend(
      `/emails/receiving/${encodeURIComponent(emailId)}?html_format=cid`,
    );
    const subject =
      String(full.subject ?? data.subject ?? "").trim() || "(no subject)";
    const text = typeof full.text === "string" ? full.text : "";
    const html = typeof full.html === "string" ? full.html : "";
    const headerFrom = full.headers?.from ?? full.headers?.From;
    const writer = nameOf(headerFrom) || nameOf(data.from) || sender;
    // Where the writer asked for answers to go somewhere else, Reply goes
    // there, the same as it would have in their own client.
    const answerTo =
      (Array.isArray(full.reply_to)
        ? full.reply_to.map(addressOf).find(Boolean)
        : "") || sender;

    const banner = `From ${writer === sender ? sender : `${writer} <${sender}>`} to ${ours}. Reply to answer them directly.`;
    const forwarded = await resend("/emails", {
      method: "POST",
      headers: { "Idempotency-Key": `inbound-${emailId}` },
      body: JSON.stringify({
        from: `${writer.replace(/[<>"]/g, "")} via Speedway 146 <${FROM_ADDRESS}>`,
        to: [FORWARD_TO],
        reply_to: answerTo,
        subject,
        text: `${banner}\n\n${text || "(This message has no plain-text part.)"}`,
        ...(html
          ? {
              html: `<div style="margin:0 0 16px;padding:10px 14px;background:#f4f5f8;border-left:4px solid #dc1f28;font:14px/20px Helvetica,Arial,sans-serif;color:#22252c;">${escapeHtml(banner)}</div>${html}`,
            }
          : {}),
        attachments: await attachmentsOn(emailId, full.attachments),
      }),
    });
    return json({ forwarded: true, id: forwarded.id ?? null });
  } catch (cause) {
    console.error(
      "email-inbound: %s",
      cause instanceof Error ? cause.message : cause,
    );
    return json({ error: "The message could not be passed on." }, 502);
  }
});
