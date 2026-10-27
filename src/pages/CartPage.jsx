import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useCart, useCartHydrated } from "../hooks/useCart";
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

/*
 * Mirrors create-checkout: a promo code and the group discount do not stack,
 * the larger of the two comes off before tax and fees.
 */
function calculateFees(rawSubtotal, totalPeople, promoPercent = 0) {
  const qualifiesForGroupDiscount = totalPeople >= GROUP_DISCOUNT_THRESHOLD;
  const groupPercent = qualifiesForGroupDiscount ? GROUP_DISCOUNT_PERCENT : 0;
  const usePromo = promoPercent > groupPercent;
  const discountPercent = Math.max(groupPercent, promoPercent);
  const discount = rawSubtotal * discountPercent;
  const subtotal = rawSubtotal - discount;
  const salesTax = subtotal * TEXAS_SALES_TAX_PERCENT;
  const serviceFee = subtotal * COMBINED_FEE_PERCENT + FIXED_FEE;
  const total = subtotal + salesTax + serviceFee;
  return {
    rawSubtotal,
    discount,
    discountPercent,
    usePromo,
    qualifiesForGroupDiscount,
    subtotal,
    salesTax,
    serviceFee,
    total,
  };
}

/** `add=prod_single_kart_15:2,prod_party_bounce_upgrade:1`, as the emails write it. */
const parseCartParam = (value) =>
  String(value || "")
    .split(",")
    .map((entry) => {
      const [id, quantity] = entry.split(":");
      return { id, quantity: Number(quantity) };
    });

/**
 * Whether the signed-in buyer's code is good, read through their own row. This
 * only shows the discount before checkout; create-checkout checks it again.
 */
async function lookUpPromo(code) {
  const { data, error } = await (
    await supabaseClient()
  )
    .from("promo_codes")
    .select("percent_off, expires_at, redeemed_at")
    .eq("code", code)
    .maybeSingle();
  if (error) return { status: "error", message: "Couldn't check that code." };
  if (!data) {
    return {
      status: "invalid",
      message: "That code isn't valid on this account.",
    };
  }
  if (data.redeemed_at) {
    return { status: "invalid", message: "That code has already been used." };
  }
  if (new Date(data.expires_at).getTime() <= Date.now()) {
    return { status: "invalid", message: "That code has expired." };
  }
  return { status: "valid", percentOff: data.percent_off };
}
/**
 * `invoke` carries the signed-in session's own token, and the function reads the
 * buyer's identity out of it, so nothing about who is buying travels in the body.
 */
async function createCheckoutSession(checkoutItems, promoCode) {
  const { data, error } = await (
    await supabaseClient()
  ).functions.invoke("create-checkout", {
    body: {
      items: checkoutItems,
      successUrl: `${window.location.origin}/success`,
      cancelUrl: `${window.location.origin}/cart`,
      ...(promoCode ? { promoCode } : {}),
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

function PromoCodeField({ promoCode, promo, onApply, onRemove }) {
  const [draft, setDraft] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (draft.trim()) onApply(draft);
    setDraft("");
  };
  if (promoCode) {
    const tone =
      promo.status === "valid"
        ? "text-green-700"
        : promo.status === "checking"
          ? "text-asphalt-500"
          : "text-race-700";
    return (
      <div className="flex items-start justify-between gap-3 bg-asphalt-50 border border-asphalt-200 rounded-md p-3">
        <div className="text-sm">
          <p className="font-display tracking-wide text-asphalt-800">
            Code {promoCode}
          </p>
          {promo.message && <p className={tone}>{promo.message}</p>}
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-sm font-semibold text-asphalt-600 hover:text-race-600 transition-colors duration-base ease-snap"
        >
          Remove
        </button>
      </div>
    );
  }
  return (
    <form onSubmit={submit} className="flex gap-2">
      <label htmlFor="promo-code" className="sr-only">
        Promo code
      </label>
      <input
        id="promo-code"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Promo code"
        autoComplete="off"
        className="flex-1 min-w-0 px-4 py-2.5 rounded-md bg-chalk text-asphalt-900 border-2 border-asphalt-200 uppercase placeholder:normal-case focus:outline-none focus:border-race-500"
      />
      <button
        type="submit"
        className="px-5 py-2.5 rounded-md bg-asphalt-800 hover:bg-asphalt-700 text-chalk font-semibold transition-colors duration-base ease-snap"
      >
        Apply
      </button>
    </form>
  );
}

function OrderSummary({
  fees,
  totalItems,
  isProcessing,
  onCheckout,
  promoField,
  promoCode,
}) {
  const remainingForDiscount = GROUP_DISCOUNT_THRESHOLD - totalItems;
  const discountLabel = fees.usePromo
    ? `Promo ${promoCode} (${Math.round(fees.discountPercent * 100)}%):`
    : `Group Discount (${GROUP_DISCOUNT_DISPLAY}):`;
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
        {fees.discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600 font-semibold">
              {discountLabel}
            </span>
            <span className="font-semibold text-green-600">
              -{formatDollars(fees.discount)}
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
        {promoField}
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
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const {
    items,
    promoCode,
    updateQuantity,
    removeItem,
    restoreItems,
    setPromoCode,
    getTotal,
    getTotalItems,
  } = useCart();
  const cartReady = useCartHydrated();
  const [isProcessing, setIsProcessing] = useState(false);
  const [promo, setPromo] = useState({ status: "idle" });

  // A reminder email links here with the cart it was about and, for an offer,
  // its code. Read once the saved cart is back, so the saved one cannot land
  // on top of it, then taken off the address so a refresh does not undo edits.
  useEffect(() => {
    if (!cartReady) return;
    const add = searchParams.get("add");
    const code = searchParams.get("code");
    if (!add && !code) return;
    if (add) restoreItems(parseCartParam(add));
    if (code) setPromoCode(code);
    setSearchParams({}, { replace: true });
  }, [cartReady, searchParams, restoreItems, setPromoCode, setSearchParams]);

  useEffect(() => {
    if (!promoCode || authLoading) {
      setPromo({ status: "idle" });
      return;
    }
    if (!user) {
      setPromo({
        status: "signin",
        message: "Sign in with the account it was sent to and it comes off.",
      });
      return;
    }
    let current = true;
    setPromo({ status: "checking", message: "Checking…" });
    lookUpPromo(promoCode).then((result) => {
      if (!current) return;
      setPromo(
        result.status === "valid"
          ? { ...result, message: `${result.percentOff}% off is applied.` }
          : result,
      );
    });
    return () => {
      current = false;
    };
  }, [promoCode, user, authLoading]);

  const promoPercent = promo.status === "valid" ? promo.percentOff / 100 : 0;

  const handleCheckout = async () => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/cart" } } });
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
      const fees = calculateFees(getTotal(), getTotalItems(), promoPercent);
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
      const checkoutUrl = await createCheckoutSession(
        checkoutItems,
        fees.usePromo ? promoCode : undefined,
      );
      window.location.href = checkoutUrl;
    } catch (error) {
      alert(
        `Unable to process checkout: ${error.message || "Please try again."}`,
      );
      setIsProcessing(false);
    }
  };
  if (items.length === 0) {
    if (!cartReady) {
      return (
        <div className="w-full -mt-20">
          <RouteMeta metadata={metadata} />
          <CartHero />
        </div>
      );
    }
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
            {promoCode && (
              <p className="text-chalk text-lg mb-8">
                Code{" "}
                <span className="font-display tracking-wide">{promoCode}</span>{" "}
                is saved. Pick your races and it comes off at checkout.
              </p>
            )}
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
  const fees = calculateFees(getTotal(), totalItems, promoPercent);
  return (
    <div className="w-full -mt-20">
      <RouteMeta metadata={metadata} />
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
              promoCode={promoCode}
              promoField={
                <PromoCodeField
                  promoCode={promoCode}
                  promo={
                    promo.status === "valid" && !fees.usePromo
                      ? {
                          status: "idle",
                          message:
                            "Your group discount is as big, so the code stays good for another order.",
                        }
                      : promo
                  }
                  onApply={setPromoCode}
                  onRemove={() => setPromoCode("")}
                />
              }
            />
          </div>
        </div>
      </section>
    </div>
  );
}
