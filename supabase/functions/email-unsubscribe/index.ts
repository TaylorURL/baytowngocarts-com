// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/*
 * Two callers turn an email's token into an unsubscribe.
 *
 * A mail client's one-click button posts to the List-Unsubscribe URL with the
 * token on the query string and `List-Unsubscribe=One-Click` as a form body.
 * The site's /unsubscribe page posts the token as JSON once the reader presses
 * the button. Either way the token is the whole credential: it is a random
 * uuid, one per account or per address that signed up for the offer, and it
 * can only ever switch emails off.
 *
 * An account and a sign-up with the same address are one reader, so leaving
 * either list leaves both.
 *
 * A GET only redirects to that page. Mail scanners follow links on their own,
 * and a link that unsubscribed on GET would unsubscribe people nobody asked.
 */

const SITE_URL = "https://baytowngokarts.com";
const TOKEN_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const corsHeaders = {
  "Access-Control-Allow-Origin": SITE_URL,
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseClient = createClient(
  // @ts-ignore
  Deno.env.get("SUPABASE_URL") ?? "",
  // @ts-ignore
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

async function unsubscribeAccount(userId: string) {
  const now = new Date().toISOString();
  const { error } = await supabaseClient
    .from("email_preferences")
    .update({ unsubscribed_at: now, updated_at: now })
    .eq("user_id", userId)
    .is("unsubscribed_at", null);
  if (error) throw error;
}

/** Signed up for the offer, by the row itself or the account it is linked to. */
async function unsubscribeSignups(column: "id" | "user_id", value: string) {
  const now = new Date().toISOString();
  const { error } = await supabaseClient
    .from("email_subscribers")
    .update({ unsubscribed_at: now, updated_at: now })
    .eq(column, value)
    .is("unsubscribed_at", null);
  if (error) throw error;
}

async function tokenFrom(req: Request, url: URL): Promise<string> {
  const fromQuery = url.searchParams.get("token");
  if (fromQuery) return fromQuery;
  const type = req.headers.get("content-type") || "";
  if (!type.includes("application/json")) return "";
  const body = await req.json().catch(() => null);
  return typeof body?.token === "string" ? body.token : "";
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = new URL(req.url);

  if (req.method === "GET") {
    const token = url.searchParams.get("token") || "";
    const target = TOKEN_PATTERN.test(token)
      ? `${SITE_URL}/unsubscribe?token=${encodeURIComponent(token)}`
      : `${SITE_URL}/unsubscribe`;
    return new Response(null, { status: 303, headers: { Location: target } });
  }

  if (req.method !== "POST") return json({ error: "POST only." }, 405);

  const token = await tokenFrom(req, url);
  if (!TOKEN_PATTERN.test(token)) {
    return json({ error: "That unsubscribe link isn't complete." }, 400);
  }

  try {
    const { data, error } = await supabaseClient
      .from("email_preferences")
      .select("user_id, unsubscribed_at")
      .eq("unsubscribe_token", token)
      .maybeSingle();
    if (error) throw error;
    if (data) {
      if (!data.unsubscribed_at) await unsubscribeAccount(data.user_id);
      await unsubscribeSignups("user_id", data.user_id);
      return json({ unsubscribed: true });
    }

    const signup = await supabaseClient
      .from("email_subscribers")
      .select("id, user_id, unsubscribed_at")
      .eq("unsubscribe_token", token)
      .maybeSingle();
    if (signup.error) throw signup.error;
    if (!signup.data) {
      return json({ error: "That unsubscribe link isn't recognised." }, 404);
    }
    if (!signup.data.unsubscribed_at) {
      await unsubscribeSignups("id", signup.data.id);
    }
    if (signup.data.user_id) await unsubscribeAccount(signup.data.user_id);
    return json({ unsubscribed: true });
  } catch (cause) {
    console.error(
      "email-unsubscribe: %s",
      cause instanceof Error ? cause.message : cause,
    );
    return json({ error: "That didn't go through. Please try again." }, 500);
  }
});
