/**
 * Shopping cart page. Displays cart items with quantity controls, calculates
 * fees/taxes/discounts, and initiates Stripe checkout.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";

const TRANSACTION_FEE_PERCENT = 0.04;
const PLATFORM_FEE_PERCENT = 0.01;
const COMBINED_FEE_PERCENT = TRANSACTION_FEE_PERCENT + PLATFORM_FEE_PERCENT;
const FIXED_FEE = 0.3;
const TEXAS_SALES_TAX_PERCENT = 0.0825;
const GROUP_DISCOUNT_THRESHOLD = 15;
const GROUP_DISCOUNT_PERCENT = 0.1;

/** Diagonal crosshatch overlay used as a background texture. */
const CROSSHATCH_STYLE = {
  backgroundImage:
    "linear-gradient(45deg, var(--color-black) 25%, transparent 25%), linear-gradient(-45deg, var(--color-black) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--color-black) 75%), linear-gradient(-45deg, transparent 75%, var(--color-black) 75%)",
  backgroundSize: "20px 20px",
  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
};

export default function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, updateQuantity, removeItem, getTotal, getTotalItems } =
    useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const calculateFees = () => {
    const rawSubtotal = getTotal();
    const totalPeople = getTotalItems();
    const qualifiesForGroupDiscount = totalPeople >= GROUP_DISCOUNT_THRESHOLD;
    const groupDiscount = qualifiesForGroupDiscount
      ? rawSubtotal * GROUP_DISCOUNT_PERCENT
      : 0;
    const subtotal = rawSubtotal - groupDiscount;
    const salesTax = subtotal * TEXAS_SALES_TAX_PERCENT;
    const serviceFee = subtotal * COMBINED_FEE_PERCENT + FIXED_FEE;
    const total = subtotal + salesTax + serviceFee;

    return {
      rawSubtotal,
      groupDiscount,
      qualifiesForGroupDiscount,
      subtotal,
      salesTax,
      serviceFee,
      total,
    };
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (items.length === 0) {
      return;
    }

    setIsProcessing(true);

    try {
      const checkoutItems = items.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        description: item.product.description,
        price: item.product.price,
        quantity: item.quantity,
      }));

      const fees = calculateFees();
      localStorage.setItem(
        "pendingPurchase",
        JSON.stringify({
          items: checkoutItems,
          subtotal: fees.subtotal,
          serviceFee: fees.serviceFee,
          total: fees.total,
          totalQuantity: getTotalItems(),
        }),
      );

      const response = await fetch(
        "https://ggkqadmnvrjsewnazdxj.supabase.co/functions/v1/create-checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({
            items: checkoutItems,
            successUrl: `${window.location.origin}/success`,
            cancelUrl: `${window.location.origin}/cart`,
            customerEmail: user.email,
            userId: user.id,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Checkout error:", data);
        alert(
          `Unable to create checkout session: ${data.error || "Please try again."}`,
        );
        setIsProcessing(false);
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        console.error("No URL in response:", data);
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Unable to process checkout. Please try again.");
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="w-full -mt-20">
        <section className="relative bg-navy-900 overflow-hidden pt-32 pb-20 min-h-screen flex items-center">
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: "url(/images/18.JPEG)" }}
            />
          </div>

          <div
            className="absolute inset-0 z-5 opacity-10"
            style={CROSSHATCH_STYLE}
          />

          <div className="relative z-10 container mx-auto px-4 text-center">
            <ShoppingCart className="h-20 w-20 text-gray-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-white mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-300 text-xl mb-8">
              Add some racing packages to get started!
            </p>
            <button
              onClick={() => navigate("/pricing")}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
            >
              Browse Packages
            </button>
          </div>
        </section>
      </div>
    );
  }

  const totalItems = getTotalItems();
  const fees = calculateFees();

  return (
    <div className="w-full -mt-20">
      <section className="relative bg-navy-900 overflow-hidden pt-32 pb-20 min-h-[40vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: "url(/images/17.JPEG)" }}
          />
        </div>

        <div
          className="absolute inset-0 z-5 opacity-10"
          style={CROSSHATCH_STYLE}
        />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-bold tracking-wider">
              SHOPPING CART
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              Your <span className="text-red-500">Cart</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Review your items and proceed to checkout
            </p>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-16 bg-white"
          style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%, 0% 100%)" }}
        />
      </section>

      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate("/pricing")}
              className="flex items-center gap-2 text-navy-900 hover:text-red-600 transition-colors mb-8 font-semibold"
            >
              <ArrowLeft className="h-5 w-5" />
              Continue Shopping
            </button>

            <div className="space-y-6">
              {items.map((item) => {
                const price = parseFloat(item.product.price.replace("$", ""));
                const subtotal = price * item.quantity;

                return (
                  <div
                    key={item.product.id}
                    className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6 hover:shadow-xl transition-all"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-2xl font-bold text-navy-900 mb-1">
                            {item.product.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {item.product.description}
                          </p>
                          <p className="text-lg font-bold text-navy-900">
                            ${price.toFixed(2)}{" "}
                            <span className="text-sm font-normal text-gray-600">
                              per person
                            </span>
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors ml-2 flex-shrink-0"
                        >
                          <Trash2 className="h-5 w-5 text-red-600" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="w-10 h-10 rounded-lg bg-white hover:bg-red-100 transition-colors flex items-center justify-center"
                          >
                            <Minus className="h-4 w-4 text-navy-900" />
                          </button>
                          <span className="w-10 text-center text-xl font-bold text-navy-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="w-10 h-10 rounded-lg bg-white hover:bg-green-100 transition-colors flex items-center justify-center"
                          >
                            <Plus className="h-4 w-4 text-navy-900" />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-black text-red-600">
                            ${subtotal.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">subtotal</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-8">
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Total Items:</span>
                  <span className="font-semibold">{totalItems} people</span>
                </div>

                {totalItems < GROUP_DISCOUNT_THRESHOLD && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-800 text-center">
                      Add {GROUP_DISCOUNT_THRESHOLD - totalItems} more to get
                      10% group discount!
                    </p>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4"></div>

                <div className="flex justify-between text-lg">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-semibold text-navy-900">
                    ${fees.rawSubtotal.toFixed(2)}
                  </span>
                </div>

                {fees.qualifiesForGroupDiscount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 font-semibold">
                      Group Discount (10%):
                    </span>
                    <span className="font-semibold text-green-600">
                      -${fees.groupDiscount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sales Tax (8.25%):</span>
                  <span className="font-semibold text-gray-700">
                    ${fees.salesTax.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Transaction Fee:</span>
                  <span className="font-semibold text-gray-700">
                    ${fees.serviceFee.toFixed(2)}
                  </span>
                </div>

                <div className="border-t-2 border-gray-300 pt-4"></div>

                <div className="flex justify-between text-2xl font-bold">
                  <span className="text-navy-900">Total:</span>
                  <span className="text-red-600">${fees.total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className={`w-full ${isProcessing ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"} text-white px-8 py-4 rounded-xl font-bold text-lg transition-all ${!isProcessing && "hover:scale-105"} flex items-center justify-center gap-2`}
              >
                <CreditCard className="h-6 w-6" />
                {isProcessing ? "Processing..." : "Proceed to Checkout"}
              </button>

              <p className="text-sm text-gray-500 text-center mt-4">
                Secure payment powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
