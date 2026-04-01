// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import Stripe from "https://esm.sh/stripe@13.10.0?target=deno";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Stripe webhooks are server-to-server — no browser CORS origin header needed.
// We keep Allow-Headers so Supabase infrastructure can forward Stripe's signature header.
const corsHeaders = {
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, stripe-signature",
};
// @ts-ignore
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  console.log("Webhook received");

  const signature = req.headers.get("stripe-signature");
  // @ts-ignore
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  console.log("Webhook secret exists:", !!webhookSecret);
  console.log("Signature exists:", !!signature);

  if (!signature || !webhookSecret) {
    console.error("Missing signature or webhook secret");
    return new Response(
      JSON.stringify({ error: "Missing signature or webhook secret" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  try {
    const body = await req.text();
    console.log("Body received, length:", body.length);

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret,
    );
    console.log("Event verified:", event.type);

    if (event.type === "checkout.session.completed") {
      console.log("Processing checkout.session.completed");
      const session = event.data.object;
      console.log("User ID from metadata:", session.metadata?.user_id);
      console.log(
        "Customer email:",
        session.customer_email || session.customer_details?.email,
      );

      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
      );
      console.log("Line items fetched:", lineItems.data.length);

      const items = [];
      for (const item of lineItems.data) {
        if (!item.description?.includes("fee")) {
          items.push({
            product_name: item.description,
            price: item.amount_total,
            quantity: item.quantity,
            subtotal: item.amount_total * item.quantity,
          });
        }
      }
      console.log("Items to save:", items.length);

      const orderNumber = `SPW146-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
      console.log("Order number:", orderNumber);

      const purchaseData = {
        user_id: session.metadata?.user_id,
        order_number: orderNumber,
        items: items,
        total_amount: session.amount_total,
        total_quantity: items.reduce((sum, item) => sum + item.quantity, 0),
        status: "completed",
        stripe_session_id: session.id,
        customer_email:
          session.customer_email || session.customer_details?.email,
      };

      console.log("Saving purchase to database...");
      const { error, data } = await supabaseClient
        .from("purchases")
        .insert(purchaseData)
        .select();

      if (error) {
        console.error("Error saving purchase:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log("Purchase saved successfully", data);
    } else {
      console.log("Ignoring event type:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
