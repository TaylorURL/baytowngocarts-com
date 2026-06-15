import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import { parsePriceString } from "../lib/pricing.js";
import { formatDollars } from "../lib/format.js";
import Icon from "../components/common/Icon.jsx";
import PageHero from "../components/common/PageHero.jsx";
const TRANSACTION_FEE_PERCENT = 0.04;
const PLATFORM_FEE_PERCENT = 0.01;
const COMBINED_FEE_PERCENT = TRANSACTION_FEE_PERCENT + PLATFORM_FEE_PERCENT;
const FIXED_FEE = 0.3;
const TEXAS_SALES_TAX_PERCENT = 0.0825;
const GROUP_DISCOUNT_THRESHOLD = 15;
const GROUP_DISCOUNT_PERCENT = 0.1;
const EMPTY_CART_HERO_IMAGE = "/images/18.JPEG";
const CART_HERO_IMAGE = "/images/17.JPEG";
const PENDING_PURCHASE_KEY = "pendingPurchase";
const GROUP_DISCOUNT_DISPLAY = `${GROUP_DISCOUNT_PERCENT * 100}%`;
const SALES_TAX_DISPLAY = `${TEXAS_SALES_TAX_PERCENT * 100}%`;

function calculateFees(rawSubtotal, totalPeople) {
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
}
async function createCheckoutSession(checkoutItems, user) {
  const session = await supabase.auth.getSession();
  const accessToken = session.data.session?.access_token;
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
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
    throw new Error(data.error || "Please try again.");
  }
  if (!data?.url) {
    throw new Error("No checkout URL returned");
  }
  return data.url;
}
function CartItemRow({ item, onUpdateQuantity, onRemove }) {
  const unitPrice = parsePriceString(item.product.price);
  const lineSubtotal = unitPrice * item.quantity;
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6 hover:shadow-xl hover:border-red-300 transition-[box-shadow,border-color] duration-200 ease-out">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-1">
              {item.product.name}
            </h3>
            <p className="text-gray-600 text-sm mb-2">
              {item.product.description}
            </p>
            <p className="text-lg font-bold text-gray-800">
              <span className="font-display text-2xl tracking-wide">
                {formatDollars(unitPrice)}
              </span>{" "}
              <span className="text-sm font-normal text-gray-600">
                per person
              </span>
            </p>
          </div>
          <button
            onClick={() => onRemove(item.product.id)}
            aria-label={`Remove ${item.product.name} from cart`}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors duration-150 ease-out active:scale-95 ml-2 flex-shrink-0"
          >
            <Icon name="trash" className="h-5 w-5 text-race-600" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-2">
            <button
              onClick={() =>
                onUpdateQuantity(item.product.id, item.quantity - 1)
              }
              aria-label={`Decrease ${item.product.name} quantity`}
              className="w-10 h-10 rounded-lg bg-white hover:bg-red-100 transition-colors duration-150 ease-out active:scale-95 flex items-center justify-center"
            >
              <Icon name="minus" className="h-4 w-4 text-asphalt-800" />
            </button>
            <span className="w-10 text-center font-display text-2xl text-gray-800">
              {item.quantity}
            </span>
            <button
              onClick={() =>
                onUpdateQuantity(item.product.id, item.quantity + 1)
              }
              aria-label={`Increase ${item.product.name} quantity`}
              className="w-10 h-10 rounded-lg bg-white hover:bg-green-100 transition-colors duration-150 ease-out active:scale-95 flex items-center justify-center"
            >
              <Icon name="plus" className="h-4 w-4 text-asphalt-800" />
            </button>
          </div>
          <div className="text-right">
            <div className="font-display text-3xl text-gray-800 tracking-wide">
              {formatDollars(lineSubtotal)}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">
              subtotal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function OrderSummary({ fees, totalItems, isProcessing, onCheckout }) {
  const remainingForDiscount = GROUP_DISCOUNT_THRESHOLD - totalItems;
  return (
    <div className="mt-8 bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-8">
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Total Items:</span>
          <span className="font-semibold">{totalItems} people</span>
        </div>
        {remainingForDiscount > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800 text-center">
              Add {remainingForDiscount} more to get {GROUP_DISCOUNT_DISPLAY}{" "}
              group discount!
            </p>
          </div>
        )}
        <div className="border-t border-gray-200 pt-4" />
        <div className="flex justify-between text-lg">
          <span className="text-gray-700">Subtotal:</span>
          <span className="font-semibold text-gray-800">
            {formatDollars(fees.rawSubtotal)}
          </span>
        </div>
        {fees.qualifiesForGroupDiscount && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600 font-semibold">
              Group Discount ({GROUP_DISCOUNT_DISPLAY}):
            </span>
            <span className="font-semibold text-green-600">
              -{formatDollars(fees.groupDiscount)}
            </span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            Sales Tax ({SALES_TAX_DISPLAY}):
          </span>
          <span className="font-semibold text-gray-700">
            {formatDollars(fees.salesTax)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Transaction Fee:</span>
          <span className="font-semibold text-gray-700">
            {formatDollars(fees.serviceFee)}
          </span>
        </div>
        <div className="border-t-2 border-gray-300 pt-4" />
        <div className="flex justify-between items-baseline">
          <span className="text-2xl font-bold text-gray-800">Total:</span>
          <span className="font-display text-4xl text-gray-900 tracking-wide">
            {formatDollars(fees.total)}
          </span>
        </div>
      </div>
      <button
        onClick={onCheckout}
        disabled={isProcessing}
        className={`w-full ${isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-500 shadow-red hover:shadow-lg hover:-translate-y-0.5 active:scale-95"} text-white px-8 py-4 rounded-xl font-bold text-lg transition duration-200 ease-out flex items-center justify-center gap-2`}
      >
        {isProcessing ? (
          <span className="h-6 w-6 rounded-full border-[3px] border-white/40 border-t-white animate-spin" />
        ) : (
          <CreditCard className="h-6 w-6" />
        )}
        {isProcessing ? "Processing..." : "Proceed to Checkout"}
      </button>
      <p className="text-sm text-gray-500 text-center mt-4">
        Secure payment powered by Stripe
      </p>
    </div>
  );
}
export default function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, updateQuantity, removeItem, getTotal, getTotalItems } =
    useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const handleCheckout = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (items.length === 0) return;
    setIsProcessing(true);
    try {
      const checkoutItems = items.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        description: item.product.description,
        price: item.product.price,
        quantity: item.quantity,
      }));
      const fees = calculateFees(getTotal(), getTotalItems());
      localStorage.setItem(
        PENDING_PURCHASE_KEY,
        JSON.stringify({
          items: checkoutItems,
          subtotal: fees.subtotal,
          serviceFee: fees.serviceFee,
          total: fees.total,
          totalQuantity: getTotalItems(),
        }),
      );
      const checkoutUrl = await createCheckoutSession(checkoutItems, user);
      window.location.href = checkoutUrl;
    } catch (error) {
      alert(
        `Unable to process checkout: ${error.message || "Please try again."}`,
      );
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
              style={{ backgroundImage: `url(${EMPTY_CART_HERO_IMAGE})` }}
            />
          </div>
          <div className="absolute inset-0 z-[5] opacity-10 checker-overlay" />
          <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-red-600/10 ring-1 ring-red-500/30 mx-auto mb-6">
              <ShoppingCart className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-300 text-xl mb-8">
              Add some racing packages to get started!
            </p>
            <button
              onClick={() => navigate("/pricing")}
              className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-red hover:shadow-lg transition duration-200 ease-out hover:scale-105 active:scale-95"
            >
              Browse Packages
            </button>
          </div>
        </section>
      </div>
    );
  }
  const totalItems = getTotalItems();
  const fees = calculateFees(getTotal(), totalItems);
  return (
    <div className="w-full -mt-20">
      <PageHero
        badge="SHOPPING CART"
        title="Your"
        titleAccent="Cart"
        description="Review your items and proceed to checkout"
        backgroundImage={CART_HERO_IMAGE}
        minHeightClass="min-h-[40vh]"
        dividerColorClass="bg-white"
      />
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate("/pricing")}
              className="flex items-center gap-2 text-gray-800 hover:text-gray-600 transition-colors mb-8 font-semibold"
            >
              <ArrowLeft className="h-5 w-5" />
              Continue Shopping
            </button>
            <div className="space-y-6">
              {items.map((item) => (
                <CartItemRow
                  key={item.product.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
            <OrderSummary
              fees={fees}
              totalItems={totalItems}
              isProcessing={isProcessing}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
