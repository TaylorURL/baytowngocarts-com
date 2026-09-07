import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon.jsx";
import AuthShell from "../components/layout/AuthShell.jsx";
import { useAuth } from "../hooks/useAuth";
import { supabaseClient } from "../lib/supabase";
import { useCart } from "../hooks/useCart";
import { priceStringToCents } from "../lib/pricing.js";
import RouteMeta from "../components/shell/RouteMeta.jsx";
import { SHARE_IMAGE, SITE_URL } from "../lib/seo/schema.js";

export const metadata = {
  title: "Order Confirmed | Speedway 146 Baytown",
  description:
    "Your Speedway 146 order is confirmed. Bring the receipt and a valid ID to the gate, and sign the waiver in person before you race.",
  canonical: "/success",
  robots: "noindex, nofollow",
  crumbs: [{ name: "Order Confirmed", path: "/success" }],
  openGraph: {
    "og:title": "Order Confirmed | Speedway 146 Baytown",
    "og:description":
      "Your Speedway 146 order is confirmed. Bring the receipt and a valid ID to the gate, and sign the waiver in person before you race.",
    "og:url": SITE_URL + "/success",
    "og:image": SHARE_IMAGE,
    "og:type": "website",
  },
};

const NEXT_STEPS = [
  "Check your email for order confirmation",
  "View your order details in My Purchases",
  "Visit us during business hours",
  "Bring a valid ID (waivers signed at the front desk)",
  "Each race ticket = one 5-minute race on the track",
];

const SuccessPage = () => {
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { clearCart } = useCart();
  const purchaseAttempted = useRef(false);

  /*
   * The Stripe webhook writes this row too. Whichever of the two gets there
   * first wins: stripe_session_id is unique, so the loser's insert comes back
   * 23505 and is left alone. Writing from the page as well is what puts the
   * order in front of a buyer who lands back here before Stripe's post has
   * been delivered.
   */
  useEffect(() => {
    const createPurchase = async () => {
      const sessionId = searchParams.get("session_id");
      if (!sessionId || !user) {
        setLoading(false);
        return;
      }
      if (purchaseAttempted.current) return;
      purchaseAttempted.current = true;

      try {
        const { data: existingPurchase } = await (
          await supabaseClient()
        )
          .from("purchases")
          .select("id")
          .eq("stripe_session_id", sessionId)
          .limit(1);

        if (existingPurchase && existingPurchase.length > 0) {
          localStorage.removeItem("pendingPurchase");
          clearCart();
          setLoading(false);
          return;
        }

        const pendingPurchaseStr = localStorage.getItem("pendingPurchase");
        if (!pendingPurchaseStr) {
          setLoading(false);
          return;
        }

        const pendingPurchase = JSON.parse(pendingPurchaseStr);
        const orderNumber = `SPW146-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

        const purchaseData = {
          user_id: user.id,
          order_number: orderNumber,
          items: pendingPurchase.items.map((item) => {
            const priceCents = priceStringToCents(item.price);
            return {
              product_name: item.name,
              price: priceCents,
              quantity: item.quantity,
              subtotal: priceCents * item.quantity,
            };
          }),
          total_amount: Math.round(pendingPurchase.total * 100),
          total_quantity: pendingPurchase.totalQuantity,
          status: "completed",
          stripe_session_id: sessionId,
          customer_email: user.email,
        };

        const { error } = await (
          await supabaseClient()
        )
          .from("purchases")
          .insert(purchaseData);
        if (error && error.code !== "23505") {
          console.error("Error creating purchase:", error);
        }

        localStorage.removeItem("pendingPurchase");
        clearCart();
      } catch (error) {
        console.error("Error in createPurchase:", error);
      }

      setLoading(false);
    };

    createPurchase();
  }, [searchParams, user]);

  if (loading) {
    return (
      <AuthShell>
        <div className="bg-chalk rounded-lg shadow-lift border border-asphalt-200 p-10 text-center">
          <div className="h-14 w-14 rounded-full border-4 border-asphalt-200 border-t-race-600 animate-spin mx-auto mb-4" />
          <p className="text-asphalt-700 text-base font-semibold">
            Processing your payment…
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <RouteMeta metadata={metadata} />
      <div className="bg-chalk rounded-lg shadow-lift border border-asphalt-200 overflow-hidden">
        <div className="caution-tape h-2" aria-hidden="true" />
        <div className="p-8 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 ring-1 ring-green-200 mx-auto mb-4">
              <Icon name="check-circle" className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="font-display text-3xl tracking-tight text-asphalt-900 mb-2">
              You're in.
            </h1>
            <p className="text-asphalt-600">
              Payment confirmed. We'll see you trackside.
            </p>
          </div>

          <div className="text-left bg-green-50 border border-green-200 rounded-md p-5 mb-6">
            <h2 className="font-display tracking-speedway text-sm text-green-800 mb-3 uppercase">
              What's Next
            </h2>
            <ul className="text-green-800/90 text-sm space-y-1.5">
              {NEXT_STEPS.map((step) => (
                <li key={step}>• {step}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              to="/dashboard"
              variant="primary"
              fullWidth
              size="lg"
              className="group"
            >
              <Icon name="shopping-bag" className="h-5 w-5" />
              View My Purchases
              <Icon
                name="arrow-right"
                className="h-5 w-5 transition-transform duration-base ease-snap group-hover:translate-x-1"
              />
            </Button>
            <Button to="/" variant="outline" fullWidth>
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    </AuthShell>
  );
};

export default SuccessPage;
