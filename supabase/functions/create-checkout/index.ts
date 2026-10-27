// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import Stripe from "https://esm.sh/stripe@13.10.0?target=deno";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// @ts-ignore
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

// The service role reads promo codes and records the attempt. Neither table is
// writable from the browser, so a buyer cannot mint a code or mark one unused.
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

const ALLOWED_ORIGIN = "https://baytowngokarts.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const PLATFORM_FEE_PERCENT = 0.01;
const TRANSACTION_FEE_PERCENT = 0.04;
const TEXAS_SALES_TAX_PERCENT = 0.0825;
const GROUP_DISCOUNT_THRESHOLD = 15;
const GROUP_DISCOUNT_PERCENT = 0.1;
// How long Stripe holds a checkout open. Stripe's floor is 30 minutes and its
// default a day; an hour is what lets the cart reminder go out the same
// afternoon the buyer walked away, rather than the next one.
const SESSION_LIFETIME_SECONDS = 60 * 60;
const PROMO_CODE_PATTERN = /^[A-Z0-9-]{6,32}$/;
// @ts-ignore
const CONNECTED_ACCOUNT_ID = Deno.env.get("STRIPE_CONNECTED_ACCOUNT_ID") || "";

/** Server-side canonical product price map, the source of truth for checkout pricing (in dollars). */
const PRODUCT_PRICES: Record<string, number> = {
  // Single-kart ticket tiers
  prod_single_kart_1: 13.99,
  prod_single_kart_4: 51.99,
  prod_single_kart_8: 87.99,
  prod_single_kart_15: 149.99,
  prod_single_kart_25: 224.99,
  prod_single_kart_35: 297.99,
  prod_single_kart_50: 399.99,
  // Party packages and upgrades
  prod_party_all_access: 699.0,
  prod_party_bounce_upgrade: 150.0,
  prod_party_race_together: 150.0,
  prod_party_private_track: 700.0,
};

/** Convert a dollar price to cents with proper rounding (avoids floating-point errors). */
function toCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/**
 * True when `value` is an absolute URL whose origin is exactly ALLOWED_ORIGIN.
 * Compares the parsed origin rather than a string prefix, so a lookalike host
 * such as https://baytowngokarts.com.example.com is rejected.
 */
function isAllowedRedirect(value: unknown): boolean {
  if (typeof value !== "string") return false;
  try {
    return new URL(value).origin === ALLOWED_ORIGIN;
  } catch {
    return false;
  }
}

/**
 * The signed-in user's id and email, taken from the bearer token the gateway
 * has already verified. Reading them here rather than from the body is what
 * stops a caller attaching a purchase to somebody else's account.
 */
function callerFromToken(req: Request): { id: string; email: string } | null {
  const header = req.headers.get("authorization") || "";
  const token = header.replace(/^Bearer\s+/i, "");
  const payload = token.split(".")[1];
  if (!payload) return null;
  try {
    // A JWT payload is base64url with the padding stripped, which atob rejects.
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(
      atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")),
    );
    if (!json.sub) return null;
    return { id: String(json.sub), email: String(json.email || "") };
  } catch {
    return null;
  }
}

type PromoCode = { id: string; code: string; percent_off: number };

/**
 * The caller's own unspent, unexpired code, or why it cannot be used. A code
 * belongs to the account it was emailed to, so one forwarded to a friend is
 * refused here rather than discovered on the statement.
 */
async function promoFor(
  value: unknown,
  userId: string,
): Promise<{ promo: PromoCode | null; error?: string }> {
  if (value === undefined || value === null || value === "") {
    return { promo: null };
  }
  const code = String(value).trim().toUpperCase();
  if (!PROMO_CODE_PATTERN.test(code)) {
    return { promo: null, error: "That promo code isn't valid." };
  }
  const { data, error } = await supabaseClient
    .from("promo_codes")
    .select("id, code, user_id, percent_off, expires_at, redeemed_at")
    .eq("code", code)
    .maybeSingle();
  if (error) throw error;
  if (!data || data.user_id !== userId) {
    return {
      promo: null,
      error: "That promo code isn't valid on this account.",
    };
  }
  if (data.redeemed_at) {
    return { promo: null, error: "That promo code has already been used." };
  }
  if (new Date(data.expires_at).getTime() <= Date.now()) {
    return { promo: null, error: "That promo code has expired." };
  }
  return {
    promo: { id: data.id, code: data.code, percent_off: data.percent_off },
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { items, successUrl, cancelUrl, promoCode } = await req.json();

    if (!isAllowedRedirect(successUrl) || !isAllowedRedirect(cancelUrl)) {
      return new Response(JSON.stringify({ error: "Invalid redirect URL." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const uuidPattern = /^[0-9a-f-]{36}$/i;

    const caller = callerFromToken(req);
    const userId = caller?.id || "";
    const customerEmail = caller?.email || "";

    if (!userId || !uuidPattern.test(userId)) {
      return new Response(JSON.stringify({ error: "Sign in to check out." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    if (!customerEmail || !emailPattern.test(customerEmail)) {
      return new Response(
        JSON.stringify({ error: "This account has no email address." }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ error: "items must be a non-empty array." }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    for (const item of items) {
      const quantity = item.quantity;
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
        return new Response(
          JSON.stringify({
            error: `Item quantity must be an integer between 1 and 100. Got: ${quantity}`,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          },
        );
      }
    }

    for (const item of items) {
      const clientPrice = parseFloat(
        typeof item.price === "string"
          ? item.price.replace("$", "")
          : item.price,
      );
      const canonicalPrice = PRODUCT_PRICES[item.id];

      if (canonicalPrice === undefined) {
        return new Response(
          JSON.stringify({ error: `Unknown product: ${item.id}` }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          },
        );
      }

      if (Math.abs(clientPrice - canonicalPrice) > 0.01) {
        return new Response(
          JSON.stringify({
            error: "Price mismatch detected. Please refresh and try again.",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          },
        );
      }
    }

    let rawSubtotal = 0;
    let totalQuantity = 0;

    for (const item of items) {
      const itemPrice = PRODUCT_PRICES[item.id];
      rawSubtotal += itemPrice * item.quantity;
      totalQuantity += item.quantity;
    }

    const { promo, error: promoError } = await promoFor(promoCode, userId);
    if (promoError) {
      return new Response(JSON.stringify({ error: promoError }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // The group discount and a promo code do not stack: the larger one is the
    // discount, and it comes off the races and packages before tax and fees,
    // the same as the group discount always has.
    const qualifiesForGroupDiscount = totalQuantity >= GROUP_DISCOUNT_THRESHOLD;
    const groupPercent = qualifiesForGroupDiscount ? GROUP_DISCOUNT_PERCENT : 0;
    const promoPercent = promo ? promo.percent_off / 100 : 0;
    const usePromo = promoPercent > groupPercent;
    const discountPercent = Math.max(groupPercent, promoPercent);
    const discountMultiplier = 1 - discountPercent;
    const discount = rawSubtotal * discountPercent;
    const groupDiscount = usePromo ? 0 : discount;
    const promoDiscount = usePromo ? discount : 0;
    const subtotal = rawSubtotal - discount;
    const discountLabel = `${Math.round(discountPercent * 100)}% off`;

    const lineItems = [];

    for (const item of items) {
      const itemPriceCents = toCents(PRODUCT_PRICES[item.id]);
      const discountedCents = Math.round(itemPriceCents * discountMultiplier);

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name:
              discountPercent > 0
                ? `${item.name} (${discountLabel})`
                : item.name,
            description: item.description,
          },
          unit_amount: discountedCents,
        },
        quantity: item.quantity,
      });
    }

    const salesTax = subtotal * TEXAS_SALES_TAX_PERCENT;
    const transactionFee = subtotal * TRANSACTION_FEE_PERCENT + 0.3;
    const platformFee = subtotal * PLATFORM_FEE_PERCENT;
    const totalFees = transactionFee + platformFee;

    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Sales Tax",
        },
        unit_amount: toCents(salesTax),
      },
      quantity: 1,
    });

    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Transaction Fee",
        },
        unit_amount: toCents(totalFees),
      },
      quantity: 1,
    });

    const total = subtotal + salesTax + totalFees;
    const stripeProcessingFee = total * 0.029 + 0.3;
    const applicationFeeAmount = toCents(platformFee + stripeProcessingFee);

    const expiresAt = Math.floor(Date.now() / 1000) + SESSION_LIFETIME_SECONDS;

    const sessionConfig: any = {
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl + "?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      expires_at: expiresAt,
      metadata: {
        user_id: userId,
        platform_fee: platformFee.toFixed(2),
        transaction_fee: transactionFee.toFixed(2),
        sales_tax: salesTax.toFixed(2),
        subtotal: subtotal.toFixed(2),
        group_discount: groupDiscount.toFixed(2),
        promo_discount: promoDiscount.toFixed(2),
        promo_code_id: usePromo && promo ? promo.id : "",
        total_quantity: totalQuantity.toString(),
      },
      payment_intent_data: {
        application_fee_amount: applicationFeeAmount,
        on_behalf_of: CONNECTED_ACCOUNT_ID,
        transfer_data: {
          destination: CONNECTED_ACCOUNT_ID,
        },
      },
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);

    // What the cart reminder is built from if this session expires unpaid. A
    // failure here costs one reminder, never the sale, so it is logged and the
    // buyer goes on to Stripe regardless.
    const { error: attemptError } = await supabaseClient
      .from("checkout_attempts")
      .insert({
        user_id: userId,
        email: customerEmail,
        stripe_session_id: session.id,
        items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
        promo_code_id: usePromo && promo ? promo.id : null,
        expires_at: new Date(expiresAt * 1000).toISOString(),
      });
    if (attemptError) {
      console.error("Error recording checkout attempt:", attemptError);
    }

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url,
        subtotal: subtotal.toFixed(2),
        platformFee: platformFee.toFixed(2),
        transactionFee: transactionFee.toFixed(2),
        total: total.toFixed(2),
        promoApplied: usePromo,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(
      JSON.stringify({
        error: "An internal error occurred. Please try again.",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
