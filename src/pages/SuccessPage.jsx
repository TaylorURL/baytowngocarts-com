/**
 * Post-checkout success page. Clears the cart and shows next-step instructions.
 * Purchase records are written exclusively by the Stripe webhook — never from the browser.
 */
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, ShoppingBag } from "lucide-react";
import Button from "../components/common/Button";
import { useCart } from "../hooks/useCart";

const SuccessPage = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    localStorage.removeItem("pendingPurchase");
    clearCart();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-red-900 to-navy-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
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
                <li>• Bring a valid ID and completed waiver</li>
              </ul>
            </div>

            <div className="flex flex-col space-y-3">
              <Link to="/dashboard">
                <button className="w-full inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  View My Purchases
                  <ArrowRight className="h-5 w-5 ml-2" />
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
