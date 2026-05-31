/**
 * Post-checkout success page. Records the completed purchase in Supabase,
 * clears the cart, and shows next-step instructions to the customer.
 */
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, CheckCircle, ShoppingBag } from "lucide-react";
import Button from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import { useCart } from "../hooks/useCart";

const SuccessPage = () => {
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { clearCart } = useCart();
  const purchaseAttempted = useRef(false);

  useEffect(() => {
    const createPurchase = async () => {
      const sessionId = searchParams.get("session_id");

      if (!sessionId || !user) {
        setLoading(false);
        return;
      }

      if (purchaseAttempted.current) {
        return;
      }
      purchaseAttempted.current = true;

      try {
        const { data: existingPurchase } = await supabase
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
          items: pendingPurchase.items.map((item) => ({
            product_name: item.name,
            price: Math.round(parseFloat(item.price.replace("$", "")) * 100),
            quantity: item.quantity,
            subtotal:
              Math.round(parseFloat(item.price.replace("$", "")) * 100) *
              item.quantity,
          })),
          total_amount: Math.round(pendingPurchase.total * 100),
          total_quantity: pendingPurchase.totalQuantity,
          status: "completed",
          stripe_session_id: sessionId,
          customer_email: user.email,
        };

        const { error } = await supabase.from("purchases").insert(purchaseData);

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
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-red-900 to-navy-900 flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full border-4 border-white/25 border-t-white animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-red-900 to-navy-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 ring-1 ring-green-200 mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600">
              Thank you for your purchase! Your order has been confirmed.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                What's Next?
              </h3>
              <ul className="text-green-700 text-sm space-y-1 text-left">
                <li>• Check your email for order confirmation</li>
                <li>• View your order details in My Purchases</li>
                <li>• Visit us during business hours</li>
                <li>• Bring a valid ID (waivers signed at the front desk)</li>
                <li>• Each race ticket = one 5-minute race on the track</li>
              </ul>
            </div>

            <div className="flex flex-col space-y-3">
              <Link to="/dashboard">
                <button className="group w-full inline-flex items-center justify-center bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-semibold shadow-red hover:shadow-lg transition duration-200 ease-out hover:scale-105 active:scale-95">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  View My Purchases
                  <ArrowRight className="h-5 w-5 ml-2 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                </button>
              </Link>

              <Link to="/">
                <Button variant="outline" fullWidth>
                  Return to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
