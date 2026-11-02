// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkouts } from "../_shared/checkout.ts";
import { completer } from "../_shared/complete.ts";
import { mailer } from "../_shared/mail.ts";

/*
 * The success page posts here the moment a buyer lands back from Stripe, and
 * this saves their order and sends its confirmation there and then, from what
 * Stripe says was paid rather than from anything the browser kept. What it
 * does with a request is in _shared/complete.ts.
 *
 * email-sweep does the same within thirty seconds for the buyer whose browser
 * never comes back. Both are keyed on the session, so an order is written and
 * confirmed once whichever gets there first.
 */

// @ts-ignore
const env = (name: string) => Deno.env.get(name) ?? "";

const db = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
  auth: { autoRefreshToken: false, persistSession: false },
});

serve(
  completer(
    db,
    checkouts(db, env("STRIPE_SECRET_KEY")),
    mailer(db, {
      resendKey: env("RESEND_API_KEY"),
      from: env("EMAIL_FROM") || "Speedway 146 <hello@baytowngokarts.com>",
      replyTo: env("EMAIL_REPLY_TO") || "hello@baytowngokarts.com",
      confirmationsOn: env("ORDER_CONFIRMATIONS") === "on",
    }),
  ),
);
