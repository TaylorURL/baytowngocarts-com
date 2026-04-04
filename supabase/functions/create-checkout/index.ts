// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import Stripe from "https://esm.sh/stripe@13.10.0?target=deno";

// @ts-ignore
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const ALLOWED_ORIGIN = "https://baytowngocarts.com";

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
// @ts-ignore
const CONNECTED_ACCOUNT_ID = Deno.env.get("STRIPE_CONNECTED_ACCOUNT_ID") || "";

/** Server-side canonical product price map — source of truth for checkout pricing (in dollars). */
const PRODUCT_PRICES: Record<string, number> = {
  prod_SuF7rI45RLsQlo: 13.99, // Adult Race
  prod_SuF7XrzxLfJWw6: 13.99, // Kid Race
  prod_SuF8q9mSRcmCcU: 34.99, // 3-Race Combo
  prod_family_deal: 59.99, // Family Deal
  prod_SuF9rhy87orqYS: 44.99, // 2.5 Hour Racing
  prod_double_ride_along: 19.99, // Ride Along Rush
  prod_double_drift: 37.99, // Double Drift
  prod_track_titan: 39.99, // Track Titan
  prod_party_all_access: 699.0, // All-Access Family Race Party
  prod_party_bounce_upgrade: 150.0, // Bounce House + Game Tables
  prod_party_race_together: 150.0, // Race Together Upgrade
  prod_party_private_track: 700.0, // Private Track (2 Hours)
};

/** Convert a dollar price to cents with proper rounding (avoids floating-point errors). */
function toCents(dollars: number): number {
  return Math.round(dollars * 100);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { items, successUrl, cancelUrl, customerEmail, userId } =
      await req.json();

    // --- Input validation ---
    if (
      !successUrl ||
      !cancelUrl ||
      !successUrl.startsWith(ALLOWED_ORIGIN) ||
      !cancelUrl.startsWith(ALLOWED_ORIGIN)
    ) {
      return new Response(JSON.stringify({ error: "Invalid redirect URL." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const uuidPattern = /^[0-9a-f-]{36}$/i;

    if (!customerEmail || !emailPattern.test(customerEmail)) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing customerEmail." }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    if (!userId || !uuidPattern.test(userId)) {
      return new Response(
        JSON.stringify({
          error: "Invalid or missing userId. Expected a UUID.",
        }),
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

    // --- Server-side price validation ---
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
    // --- End input validation ---

    let rawSubtotal = 0;
    let totalQuantity = 0;

    for (const item of items) {
      const itemPrice = PRODUCT_PRICES[item.id];
      rawSubtotal += itemPrice * item.quantity;
      totalQuantity += item.quantity;
    }

    const qualifiesForGroupDiscount = totalQuantity >= GROUP_DISCOUNT_THRESHOLD;
    const discountMultiplier = qualifiesForGroupDiscount
      ? 1 - GROUP_DISCOUNT_PERCENT
      : 1;
    const groupDiscount = qualifiesForGroupDiscount
      ? rawSubtotal * GROUP_DISCOUNT_PERCENT
      : 0;
    const subtotal = rawSubtotal - groupDiscount;

    const lineItems = [];

    for (const item of items) {
      const itemPriceCents = toCents(PRODUCT_PRICES[item.id]);
      const discountedCents = Math.round(itemPriceCents * discountMultiplier);

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: qualifiesForGroupDiscount
              ? `${item.name} (10% off)`
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

    const sessionConfig: any = {
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl + "?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata: {
        user_id: userId,
        platform_fee: platformFee.toFixed(2),
        transaction_fee: transactionFee.toFixed(2),
        sales_tax: salesTax.toFixed(2),
        subtotal: subtotal.toFixed(2),
        group_discount: groupDiscount.toFixed(2),
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

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url,
        subtotal: subtotal.toFixed(2),
        platformFee: platformFee.toFixed(2),
        transactionFee: transactionFee.toFixed(2),
        total: total.toFixed(2),
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
