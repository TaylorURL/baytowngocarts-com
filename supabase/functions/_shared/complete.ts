import type { checkouts } from "./checkout.ts";
import type { mailer } from "./mail.ts";
import { isPaid, isSiteSession, type StripeSession } from "./orders.ts";

/*
 * What checkout-complete does with a request, kept apart from the function
 * that serves it so the cases can run it against a stand-in database and
 * Stripe.
 *
 * The session id in the body is the whole of the credential, and it is
 * enough. All this can do is record a sale Stripe already took and confirm it
 * once, so somebody holding another buyer's id can only make happen what that
 * buyer's payment already earned. A session another site opened on the same
 * Stripe account, or one that has not paid yet, is refused.
 */

const SITE_URL = "https://baytowngokarts.com";
const SESSION_ID = /^cs_(live|test)_[A-Za-z0-9]+$/;

export const corsHeaders = {
  "Access-Control-Allow-Origin": SITE_URL,
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

// deno-lint-ignore no-explicit-any
type Db = any;

export function completer(
  db: Db,
  book: ReturnType<typeof checkouts>,
  mail: ReturnType<typeof mailer>,
) {
  return async function handle(req: Request): Promise<Response> {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }
    if (req.method !== "POST") return json({ error: "POST only." }, 405);

    const body = await req.json().catch(() => null);
    const sessionId = typeof body?.sessionId === "string" ? body.sessionId : "";
    if (!SESSION_ID.test(sessionId)) {
      return json({ error: "That isn't a checkout." }, 400);
    }

    try {
      const response = await book.fetchSession(sessionId);
      if (response.status === 404) {
        return json({ error: "That checkout doesn't exist." }, 404);
      }
      if (!response.ok) {
        console.error(
          "checkout-complete: Stripe answered %d for %s",
          response.status,
          sessionId,
        );
        return json({ error: "Stripe didn't answer. Please try again." }, 502);
      }
      const session = (await response.json()) as StripeSession;
      if (!isSiteSession(session)) {
        return json({ error: "That checkout doesn't exist." }, 404);
      }
      // A bank debit can finish the checkout before the money arrives; the
      // sweep records it once it does.
      if (!isPaid(session)) {
        return json(
          {
            error: "That payment hasn't gone through yet.",
            status: session.payment_status,
          },
          409,
        );
      }
      const userId = session.metadata?.user_id ?? "";
      if (!userId) {
        return json({ error: "That checkout has no account on it." }, 422);
      }

      await book.completeCheckout(session, userId, false);
      const { data, error } = await db
        .from("purchases")
        .select("id, order_number")
        .eq("stripe_session_id", session.id)
        .single();
      if (error) throw error;

      // The order is saved whatever happens to the email. A send that fails
      // here is retaken by the sweep.
      let confirmation: string;
      try {
        confirmation = await mail.confirmPurchase(data.id);
      } catch (cause) {
        console.error(
          "checkout-complete: could not confirm %s: %s",
          data.order_number,
          cause instanceof Error ? cause.message : cause,
        );
        confirmation = "failed";
      }
      return json({ order: data.order_number, confirmation });
    } catch (cause) {
      console.error(
        "checkout-complete: %s",
        cause instanceof Error ? cause.message : cause,
      );
      return json({ error: "The order didn't save. Please try again." }, 500);
    }
  };
}
