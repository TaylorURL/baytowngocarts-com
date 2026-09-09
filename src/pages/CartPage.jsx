import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { supabaseClient } from "../lib/supabase";
import { parsePriceString } from "../lib/pricing.js";
import { formatDollars } from "../lib/format.js";
import Icon from "../components/ui/Icon.jsx";
import PageHero from "../components/layout/PageHero.jsx";
import RouteMeta from "../components/shell/RouteMeta.jsx";
import { SHARE_IMAGE, SITE_URL } from "../lib/seo/schema.js";

export const metadata = {
  title: "Your Cart | Speedway 146 Go-Karts Baytown",
  description:
    "Review the racing wristbands and party packages in your cart, check the group discount and the tax, then head to checkout.",
  canonical: "/cart",
  robots: "noindex, follow",
  crumbs: [{ name: "Cart", path: "/cart" }],
  openGraph: {
    "og:title": "Your Cart | Speedway 146 Go-Karts Baytown",
    "og:description":
      "Review the racing wristbands and party packages in your cart, check the group discount and the tax, then head to checkout.",
    "og:url": SITE_URL + "/cart",
    "og:image": SHARE_IMAGE,
    "og:type": "website",
  },
};

const TRANSACTION_FEE_PERCENT = 0.04;
const PLATFORM_FEE_PERCENT = 0.01;
const COMBINED_FEE_PERCENT = TRANSACTION_FEE_PERCENT + PLATFORM_FEE_PERCENT;
const FIXED_FEE = 0.3;
const TEXAS_SALES_TAX_PERCENT = 0.0825;
const GROUP_DISCOUNT_THRESHOLD = 15;
const GROUP_DISCOUNT_PERCENT = 0.1;
const EMPTY_CART_HERO_IMAGE = "/images/18.webp";
const CART_HERO_IMAGE = "/images/16.webp";
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
/**
 * `invoke` carries the signed-in session's own token, and the function reads the
 * buyer's identity out of it, so nothing about who is buying travels in the body.
 */
async function createCheckoutSession(checkoutItems) {
  const { data, error } = await (
    await supabaseClient()
  ).functions.invoke("create-checkout", {
    body: {
      items: checkoutItems,
      successUrl: `${window.location.origin}/success`,
      cancelUrl: `${window.location.origin}/cart`,
    },
  });
  if (error) {
    const refused = await error.context?.json?.().catch(() => null);
    throw new Error(refused?.error || "Please try again.");
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
    <div className="bg-chalk rounded-lg border-2 border-asphalt-100 shadow-track p-6 hover:shadow-lift hover:border-race-200 transition-[box-shadow,border-color] duration-base ease-snap">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg sm:text-2xl font-bold text-asphalt-800 mb-1">
              {item.product.name}
            </h3>
            <p className="text-asphalt-600 text-sm mb-2">
              {item.product.description}
            </p>
            <p className="text-lg font-bold text-asphalt-800">
              <span className="font-display text-2xl tracking-wide">
                {formatDollars(unitPrice)}
              </span>{" "}
              <span className="text-sm font-normal text-asphalt-600">
                per person
              </span>
            </p>
          </div>
          <button
            onClick={() => onRemove(item.product.id)}
            aria-label={`Remove ${item.product.name} from cart`}
            className="p-2 hover:bg-race-50 rounded-md transition-colors duration-base ease-snap active:scale-95 ml-2 flex-shrink-0"
          >
            <Icon name="trash" className="h-5 w-5 text-race-600" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 bg-asphalt-50 rounded-lg p-2">
            <button
              onClick={() =>
                onUpdateQuantity(item.product.id, item.quantity - 1)
              }
              aria-label={`Decrease ${item.product.name} quantity`}
              className="w-10 h-10 rounded-md bg-chalk hover:bg-race-100 transition-colors duration-base ease-snap active:scale-95 flex items-center justify-center"
            >
              <Icon name="minus" className="h-4 w-4 text-asphalt-800" />
            </button>
            <span className="w-10 text-center font-display text-2xl text-asphalt-800">
              {item.quantity}
            </span>
            <button
              onClick={() =>
                onUpdateQuantity(item.product.id, item.quantity + 1)
              }
              aria-label={`Increase ${item.product.name} quantity`}
              className="w-10 h-10 rounded-md bg-chalk hover:bg-race-100 transition-colors duration-base ease-snap active:scale-95 flex items-center justify-center"
            >
              <Icon name="plus" className="h-4 w-4 text-asphalt-800" />
            </button>
          </div>
          <div className="text-right">
            <div className="font-display text-3xl text-asphalt-800 tracking-wide">
              {formatDollars(lineSubtotal)}
            </div>
            <div className="text-xs text-asphalt-500 uppercase tracking-wider">
              subtotal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const CartHero = () => (
  <PageHero
    badge="Shopping Cart"
    heading={
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-chalk leading-[0.95] tracking-tight">
        Your <span className="text-race-500">Cart</span>
      </h1>
    }
    crumbs={metadata.crumbs}
    description="Review the wristbands and packages here, then check out."
    backgroundImage={CART_HERO_IMAGE}
  />
);

function OrderSummary({ fees, totalItems, isProcessing, onCheckout }) {
  const remainingForDiscount = GROUP_DISCOUNT_THRESHOLD - totalItems;
  return (
    <div className="mt-8 bg-chalk rounded-lg border-2 border-asphalt-100 shadow-lift p-8">
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-asphalt-600">
          <span>Total Items:</span>
          <span className="font-semibold">{totalItems} people</span>
        </div>
        {remainingForDiscount > 0 && (
          <div className="bg-race-50 border border-race-200 rounded-md p-3">
            <p className="text-xs text-race-800 text-center">
              Add {remainingForDiscount} more to get {GROUP_DISCOUNT_DISPLAY}{" "}
              group discount!
            </p>
          </div>
        )}
        <div className="border-t border-asphalt-100 pt-4" />
        <div className="flex justify-between text-lg">
          <span className="text-asphalt-700">Subtotal:</span>
          <span className="font-semibold text-asphalt-800">
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
          <span className="text-asphalt-600">
            Sales Tax ({SALES_TAX_DISPLAY}):
          </span>
          <span className="font-semibold text-asphalt-700">
            {formatDollars(fees.salesTax)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-asphalt-600">Transaction Fee:</span>
          <span className="font-semibold text-asphalt-700">
            {formatDollars(fees.serviceFee)}
          </span>
        </div>
        <div className="border-t-2 border-asphalt-200 pt-4" />
        <div className="flex justify-between items-baseline">
          <span className="text-2xl font-bold text-asphalt-800">Total:</span>
          <span className="font-display text-4xl text-asphalt-900 tracking-wide">
            {formatDollars(fees.total)}
          </span>
        </div>
      </div>
      <button
        onClick={onCheckout}
        disabled={isProcessing}
        className={`w-full ${isProcessing ? "bg-asphalt-400 cursor-not-allowed" : "bg-race-600 hover:bg-race-500 shadow-race hover:shadow-lift hover:-translate-y-0.5 active:scale-95"} text-chalk px-8 py-4 rounded-md font-bold text-lg transition duration-base ease-snap flex items-center justify-center gap-2`}
      >
        {isProcessing ? (
          <span className="h-6 w-6 rounded-full border-[3px] border-white/40 border-t-white animate-spin" />
        ) : (
          <Icon name="credit-card" className="h-6 w-6" />
        )}
        {isProcessing ? "Processing..." : "Proceed to Checkout"}
      </button>
      <p className="text-sm text-asphalt-500 text-center mt-4">
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
      const checkoutUrl = await createCheckoutSession(checkoutItems);
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
        <RouteMeta metadata={metadata} />
        <CartHero />
        <section className="relative bg-asphalt-900 overflow-hidden py-24 flex items-center">
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: `url(${EMPTY_CART_HERO_IMAGE})` }}
              aria-hidden="true"
            />
          </div>
          <div
            className="absolute inset-0 z-[5] opacity-10 checker-overlay"
            aria-hidden="true"
          />
          <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-lg bg-race-600/10 ring-1 ring-race-500/30 mx-auto mb-6">
              <Icon
                name="shopping-cart"
                className="h-12 w-12 text-race-500"
                aria-hidden="true"
              />
            </div>
            <h2 className="font-display text-4xl tracking-tight text-chalk mb-4">
              Nothing in here yet
            </h2>
            <p className="text-asphalt-300 text-xl mb-8">
              Racing wristbands and party packages are all on the pricing page.
            </p>
            <Link
              to="/pricing"
              className="inline-flex bg-race-600 hover:bg-race-500 text-chalk px-8 py-4 rounded-md font-bold text-lg shadow-race hover:shadow-lift transition duration-base ease-snap active:scale-95"
            >
              Browse Packages
            </Link>
          </div>
        </section>
      </div>
    );
  }
  const totalItems = getTotalItems();
  const fees = calculateFees(getTotal(), totalItems);
  return (
    <div className="w-full -mt-20">
      <CartHero />
      <section className="py-24 bg-asphalt-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate("/pricing")}
              className="flex items-center gap-2 text-asphalt-800 hover:text-asphalt-600 transition-colors mb-8 font-semibold"
            >
              <Icon name="arrow-left" className="h-5 w-5" />
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
