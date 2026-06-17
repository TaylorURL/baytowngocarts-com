import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BOUNCE_PRICING } from "../lib/content/bounce.js";
import {
  STRIPE_PRODUCTS,
  STRIPE_DOUBLE_SEATER_PRODUCTS,
  STRIPE_PARTY_PACKAGES,
} from "../lib/stripe-config.js";
import { CONTACT_INFO } from "../lib/content/business.js";
import { parsePriceString } from "../lib/pricing.js";
import { formatDollars } from "../lib/format.js";
import { useCart } from "../hooks/useCart";
import Icon from "../components/common/Icon.jsx";
import PageHero from "../components/common/PageHero.jsx";
import TabButton from "../components/pricing/TabButton.jsx";
import QuantityStepper from "../components/pricing/QuantityStepper.jsx";
import RacingProductCard from "../components/pricing/RacingProductCard.jsx";

const PARTY_FEATURES = [
  "20 racing wristbands included",
  "2 hours of organized racing",
  "Wristbands can rotate among guests",
  "Extra wristbands available day-of upon request",
  "Staff runs the heats — no parental refereeing",
  "Shared track with public riders",
  "3 hours in the private party room",
  "Room fits up to 60 guests",
  "Outdoor seating overflow at no charge",
  "Tables + chairs already set up",
  "Public-side bounce wristbands available à la carte",
];

const HEIGHT_REQUIREMENTS = [
  { label: "Kiddie karts", value: 'Minimum 40" tall' },
  { label: "Adult karts", value: 'Minimum 53" tall' },
  { label: "Double seater", value: 'Driver 53"+, passenger 33"+' },
];

const POLICY_LINES = [
  "Each race ticket = one 5-minute heat",
  "All packages must be used same day",
  "Long hair tied back (ties at front desk)",
  "Waivers signed in person before riding",
];

const getIconName = (productName) => {
  if (productName.includes("Kid")) return "helmet";
  if (productName.includes("Adult")) return "kart";
  if (productName.includes("Family")) return "users";
  if (productName.includes("2.5") || productName.includes("Hour")) return "stopwatch";
  if (
    productName.includes("Double") ||
    productName.includes("Ride Along") ||
    productName.includes("Track Titan")
  )
    return "users";
  return "flag";
};

const PricingPage = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantities, setQuantities] = useState({});
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [activeTab, setActiveTab] = useState("individual");

  const getQuantity = (productId) => quantities[productId] || 0;

  const updateQuantity = (productId, delta) =>
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + delta),
    }));

  const setQuantityDirect = (productId, value) =>
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, parseInt(value) || 0),
    }));

  const totalItems = Object.values(quantities).reduce(
    (sum, qty) => sum + qty,
    0,
  );

  const allProducts = [
    ...STRIPE_PRODUCTS,
    ...STRIPE_DOUBLE_SEATER_PRODUCTS,
    ...STRIPE_PARTY_PACKAGES,
  ];

  const totalPrice = allProducts.reduce(
    (sum, product) =>
      sum + getQuantity(product.id) * parsePriceString(product.price),
    0,
  );

  const addSelectedToCart = () => {
    allProducts.forEach((product) => {
      const qty = getQuantity(product.id);
      if (qty > 0) addItem(product, qty);
    });
  };

  const handleAddAllToCart = () => {
    addSelectedToCart();
    setQuantities({});
    setShowCartNotification(true);
    setTimeout(() => setShowCartNotification(false), 3000);
  };

  const handleGoToCart = () => {
    addSelectedToCart();
    navigate("/cart");
  };

  return (
    <div className="w-full -mt-20">
      <PageHero
        badge="Pricing"
        title="Pick your"
        titleAccent="package."
        description="Every price is before 8.25% Texas sales tax. Cash pays 4% less than card. Groups of 15+ get 10% off racing automatically."
        backgroundImage="/images/17.JPEG"
        dividerColorClass="bg-asphalt-50"
      >
        <div
          role="tablist"
          aria-label="Pricing categories"
          className="mt-10 inline-flex bg-asphalt-800/60 rounded-md p-1.5 border border-chalk/10"
        >
          <TabButton
            iconName="flag"
            label="Party Packages"
            isActive={activeTab === "parties"}
            onClick={() => setActiveTab("parties")}
          />
          <TabButton
            iconName="kart"
            label="Individual Racing"
            isActive={activeTab === "individual"}
            onClick={() => setActiveTab("individual")}
          />
          <TabButton
            iconName="bouncy-castle"
            label="Bounce House"
            isActive={activeTab === "bounce"}
            onClick={() => setActiveTab("bounce")}
          />
        </div>
      </PageHero>

      {showCartNotification && (
        <div className="fixed top-24 right-4 z-50 bg-green-600 text-chalk px-6 py-4 rounded-md shadow-lift flex items-center gap-3">
          <Icon name="check" className="h-5 w-5" />
          <span className="font-bold">Added to cart</span>
        </div>
      )}

      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-chalk border-t-4 border-race-600 shadow-lift p-4 transition-transform duration-base ${totalItems > 0 ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-race-600 p-3 rounded-md">
              <Icon name="shopping-cart" className="h-6 w-6 text-chalk" />
            </div>
            <div>
              <p className="text-xs font-display tracking-speedway uppercase text-asphalt-500">
                Your Selection
              </p>
              <p className="text-xl font-bold text-asphalt-900 tabular-nums">
                {totalItems} {totalItems === 1 ? "item" : "items"} ·{" "}
                <span className="font-display tracking-wide text-race-600">
                  {formatDollars(totalPrice)}
                </span>
              </p>
            </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={handleAddAllToCart}
              className="flex-1 sm:flex-none bg-asphalt-800 hover:bg-asphalt-700 text-chalk px-5 py-3 rounded-md font-display tracking-speedway uppercase text-sm transition duration-base ease-snap active:scale-95 flex items-center justify-center gap-2"
            >
              <Icon name="plus" className="h-4 w-4" />
              Add to Cart
            </button>
            <button
              onClick={handleGoToCart}
              className="flex-1 sm:flex-none bg-race-600 hover:bg-race-500 text-chalk px-6 py-3 rounded-md font-display tracking-speedway uppercase text-sm transition duration-base ease-snap active:scale-95 flex items-center justify-center gap-2 shadow-race"
            >
              <Icon name="shopping-cart" className="h-4 w-4" />
              Checkout
            </button>
          </div>
        </div>
      </div>

      {activeTab === "parties" && (
        <section className="py-16 bg-asphalt-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-asphalt-900 mb-2">
                  Party Packages
                </h2>
                <p className="text-asphalt-600">
                  Private room, racing wristbands, staff-run heats. Call to lock
                  in a date.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 items-start">
                {STRIPE_PARTY_PACKAGES.filter((p) => !p.isUpgrade).map(
                  (product) => {
                    const qty = getQuantity(product.id);
                    const isSelected = qty > 0;
                    return (
                      <div
                        key={product.id}
                        className={`bg-white rounded-lg shadow-lift overflow-hidden border-2 transition duration-base ease-snap ${isSelected ? "border-race-500 ring-2 ring-race-200" : "border-race-500"}`}
                      >
                        <div className="bg-race-700 p-4 text-center">
                          <div className="flex items-center justify-center gap-2 text-chalk">
                            <Icon name="trophy" className="h-5 w-5 text-caution-400" />
                            <span className="font-display tracking-speedway uppercase text-sm">
                              Most Popular
                            </span>
                            <Icon name="trophy" className="h-5 w-5 text-caution-400" />
                          </div>
                        </div>
                        <div className="p-6 md:p-8">
                          <h2 className="text-2xl md:text-3xl font-bold text-asphalt-900 mb-2">
                            {product.name}
                          </h2>
                          <p className="text-asphalt-600 mb-4">
                            {product.description}
                          </p>
                          <div className="flex items-baseline gap-2 mb-6">
                            <span className="font-display text-5xl text-race-600 tracking-wide tabular-nums">
                              {product.price}
                            </span>
                            <span className="text-asphalt-500">+ tax</span>
                          </div>
                          <div className="space-y-3 mb-6">
                            {PARTY_FEATURES.map((feature, idx) => (
                              <div key={idx} className="flex items-start gap-3">
                                <Icon
                                  name="check"
                                  className="h-5 w-5 text-race-600 flex-shrink-0 mt-0.5"
                                />
                                <span
                                  className={`${idx < 2 || idx === 5 ? "font-semibold text-asphalt-900" : "text-asphalt-700"}`}
                                >
                                  {feature}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-center gap-3 mb-4">
                            <QuantityStepper
                              size="lg"
                              quantity={qty}
                              productName={product.name}
                              onDecrement={() => updateQuantity(product.id, -1)}
                              onIncrement={() => updateQuantity(product.id, 1)}
                              onChange={(e) =>
                                setQuantityDirect(product.id, e.target.value)
                              }
                            />
                          </div>
                          {isSelected && (
                            <div className="bg-race-50 rounded-md py-3 text-center mb-4">
                              <span className="font-display text-race-600 text-2xl tracking-wide tabular-nums">
                                {formatDollars(
                                  parsePriceString(product.price) * qty,
                                )}
                              </span>
                            </div>
                          )}
                          <p className="text-center text-sm text-asphalt-500">
                            Or call to book:{" "}
                            <a
                              href={CONTACT_INFO.phoneTel}
                              className="text-race-600 font-bold tabular-nums hover:text-race-700"
                            >
                              {CONTACT_INFO.phone}
                            </a>
                          </p>
                        </div>
                      </div>
                    );
                  },
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-display tracking-speedway uppercase text-asphalt-700 mb-4 flex items-center gap-2">
                      <Icon name="bolt" className="h-4 w-4 text-ignite-500" />
                      Party Upgrades
                    </h3>
                    <div className="space-y-3">
                      {STRIPE_PARTY_PACKAGES.filter((p) => p.isUpgrade).map(
                        (product) => {
                          const qty = getQuantity(product.id);
                          const isSelected = qty > 0;
                          const upgradeIcon = product.name.includes("Bounce")
                            ? "bouncy-castle"
                            : product.name.includes("Race Together")
                              ? "users"
                              : "trophy";
                          const isPopular = product.name.includes("Bounce");
                          return (
                            <div
                              key={product.id}
                              className={`bg-white rounded-md p-4 shadow-track border-2 transition duration-base ease-snap relative ${isPopular ? "border-ignite-400" : isSelected ? "border-race-400" : "border-asphalt-100"} ${isSelected ? "ring-2 ring-race-200" : ""}`}
                            >
                              {isPopular && (
                                <div className="absolute -top-2 right-4 bg-ignite-500 text-asphalt-950 text-[10px] font-display tracking-speedway uppercase px-2 py-0.5 rounded-full">
                                  Popular
                                </div>
                              )}
                              <div className="flex items-center gap-4">
                                <div
                                  className={`p-3 rounded-md ${isPopular ? "bg-ignite-100" : "bg-asphalt-100"}`}
                                >
                                  <Icon
                                    name={upgradeIcon}
                                    className={`h-6 w-6 ${isPopular ? "text-ignite-600" : "text-asphalt-600"}`}
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-asphalt-900">
                                    {product.name}
                                  </h4>
                                  <p className="text-sm text-asphalt-500">
                                    {product.description}
                                  </p>
                                </div>
                                <div className="font-display text-xl text-asphalt-900 tracking-wide tabular-nums">
                                  {product.price}
                                </div>
                              </div>
                              <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-asphalt-100">
                                <QuantityStepper
                                  quantity={qty}
                                  productName={product.name}
                                  onDecrement={() =>
                                    updateQuantity(product.id, -1)
                                  }
                                  onIncrement={() =>
                                    updateQuantity(product.id, 1)
                                  }
                                  onChange={(e) =>
                                    setQuantityDirect(
                                      product.id,
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                              {isSelected && (
                                <div className="mt-2 bg-race-50 rounded-md py-1 text-center">
                                  <span className="font-display text-race-600 text-lg tracking-wide tabular-nums">
                                    {formatDollars(
                                      parsePriceString(product.price) * qty,
                                    )}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        },
                      )}
                    </div>
                    <p className="text-sm text-asphalt-500 mt-3 flex items-center gap-2">
                      <Icon name="plus" className="h-4 w-4" />
                      Extra racing wristbands $13.99 each — added at the
                      front desk.
                    </p>
                  </div>

                  <div className="bg-asphalt-900 rounded-lg p-6 text-chalk text-center shadow-track">
                    <h4 className="font-display tracking-speedway uppercase text-sm mb-2">
                      Need to customize?
                    </h4>
                    <p className="text-gray-300 text-sm mb-4">
                      Call us. We work with allergies, time slots, and group
                      sizes 45+.
                    </p>
                    <a
                      href={CONTACT_INFO.phoneTel}
                      className="inline-flex items-center gap-2 bg-chalk text-asphalt-900 px-6 py-3 rounded-md font-bold hover:bg-white transition duration-base ease-snap active:scale-95 tabular-nums"
                    >
                      <Icon name="phone" className="h-5 w-5" />
                      {CONTACT_INFO.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === "individual" && (
        <section className="py-16 bg-asphalt-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-asphalt-900 mb-2">
                  Go-Kart Racing
                </h2>
                <p className="text-asphalt-600">
                  Single heats, combos, family bundles, 2.5-hour unlimited
                  wristbands.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-12">
                {STRIPE_PRODUCTS.map((product) => (
                  <RacingProductCard
                    key={product.id}
                    product={product}
                    quantity={getQuantity(product.id)}
                    iconName={getIconName(product.name)}
                    iconWrapperClass={
                      product.isPopular ? "bg-race-100" : "bg-asphalt-100"
                    }
                    iconClass={
                      product.isPopular ? "text-race-600" : "text-asphalt-600"
                    }
                    features={product.features.slice(0, 2)}
                    onUpdateQuantity={updateQuantity}
                    onSetQuantity={setQuantityDirect}
                  />
                ))}
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-asphalt-900 mb-2">
                  Double-Seater
                </h3>
                <p className="text-asphalt-600 text-sm">
                  One driver, one passenger. Driver 53"+, passenger 33"+.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
                {STRIPE_DOUBLE_SEATER_PRODUCTS.map((product) => (
                  <RacingProductCard
                    key={product.id}
                    product={product}
                    quantity={getQuantity(product.id)}
                    iconName={getIconName(product.name)}
                    iconWrapperClass="bg-asphalt-800"
                    iconClass="text-chalk"
                    perUnitLabel="per kart"
                    onUpdateQuantity={updateQuantity}
                    onSetQuantity={setQuantityDirect}
                  />
                ))}
              </div>
              <div className="bg-asphalt-900 rounded-lg p-6 text-chalk max-w-4xl mx-auto shadow-track">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-display tracking-speedway uppercase text-sm mb-3 flex items-center gap-2">
                      <Icon name="helmet" className="h-5 w-5 text-race-400" />
                      Height Requirements
                    </h4>
                    <ul className="space-y-2 text-sm">
                      {HEIGHT_REQUIREMENTS.map(({ label, value }) => (
                        <li
                          key={label}
                          className="flex items-center gap-2 tabular-nums"
                        >
                          <Icon name="check" className="h-4 w-4 text-race-400" />
                          <span>
                            <span className="text-race-400 font-semibold">
                              {label}:
                            </span>{" "}
                            {value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-display tracking-speedway uppercase text-sm mb-3 flex items-center gap-2">
                      <Icon name="stopwatch" className="h-5 w-5 text-race-400" />
                      Policies
                    </h4>
                    <ul className="space-y-2 text-sm">
                      {POLICY_LINES.map((line) => (
                        <li key={line} className="flex items-center gap-2">
                          <Icon name="check" className="h-4 w-4 text-race-400" />
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === "bounce" && (
        <section className="py-16 bg-asphalt-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-asphalt-900 mb-2">
                  Bounce House Pass
                </h2>
                <p className="text-asphalt-600">
                  Indoor, climate-controlled, supervised. Pair with a race
                  wristband for the full Saturday.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {BOUNCE_PRICING.map((plan, idx) => (
                  <div
                    key={idx}
                    className={`bg-white rounded-md p-6 shadow-track border-2 transition duration-base ease-snap relative ${plan.isPopular ? "border-race-500" : "border-asphalt-100 hover:border-asphalt-200 hover:shadow-lift"}`}
                  >
                    {plan.isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-race-600 text-chalk text-[10px] font-display tracking-speedway uppercase px-3 py-1 rounded-full">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <div className="text-center mb-4">
                      <div className="inline-flex bg-asphalt-100 p-3 rounded-md mb-3">
                        <Icon
                          name="bouncy-castle"
                          className="h-6 w-6 text-asphalt-600"
                        />
                      </div>
                      <h3 className="text-xl font-bold text-asphalt-900">
                        {plan.title}
                      </h3>
                      {plan.description && (
                        <p className="text-sm text-asphalt-500">
                          {plan.description}
                        </p>
                      )}
                    </div>
                    <div className="text-center mb-4">
                      <span className="font-display text-4xl text-asphalt-900 tracking-wide tabular-nums">
                        {plan.price}
                      </span>
                      <span className="text-asphalt-500 text-sm ml-1">
                        per person
                      </span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {plan.items.map((feature, featureIdx) => (
                        <li
                          key={featureIdx}
                          className="flex items-start text-sm"
                        >
                          <Icon
                            name="check"
                            className="h-4 w-4 text-race-600 mr-2 mt-0.5 flex-shrink-0"
                          />
                          <span className="text-asphalt-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => navigate("/contact")}
                      className={`w-full py-3 rounded-md font-display tracking-speedway uppercase text-sm transition duration-base ease-snap active:scale-95 ${
                        plan.isPopular
                          ? "bg-race-600 hover:bg-race-500 text-chalk shadow-race"
                          : "bg-asphalt-800 hover:bg-asphalt-700 text-chalk"
                      }`}
                    >
                      Ask About It
                    </button>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-md p-6 shadow-track border border-asphalt-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="bg-asphalt-100 w-12 h-12 rounded-md flex items-center justify-center mx-auto mb-3">
                      <Icon name="shield" className="h-6 w-6 text-asphalt-600" />
                    </div>
                    <h4 className="font-bold text-asphalt-900 mb-1">
                      Supervised
                    </h4>
                    <p className="text-asphalt-600 text-sm">
                      Staff at every entry, every shift.
                    </p>
                  </div>
                  <div>
                    <div className="bg-asphalt-100 w-12 h-12 rounded-md flex items-center justify-center mx-auto mb-3">
                      <Icon name="bolt" className="h-6 w-6 text-asphalt-600" />
                    </div>
                    <h4 className="font-bold text-asphalt-900 mb-1">
                      Climate-Controlled
                    </h4>
                    <p className="text-asphalt-600 text-sm">
                      Indoor — runs through Baytown summer heat.
                    </p>
                  </div>
                  <div>
                    <div className="bg-asphalt-100 w-12 h-12 rounded-md flex items-center justify-center mx-auto mb-3">
                      <Icon name="users" className="h-6 w-6 text-asphalt-600" />
                    </div>
                    <h4 className="font-bold text-asphalt-900 mb-1">
                      All Ages
                    </h4>
                    <p className="text-asphalt-600 text-sm">
                      Toddlers through pre-teens have their own units.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-12 text-chalk bg-asphalt-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-3">Questions?</h2>
            <p className="text-gray-300 mb-6">
              The FAQ covers most of them — call if it doesn't.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/faq"
                className="bg-chalk text-asphalt-900 hover:bg-white px-6 py-3 rounded-md font-display tracking-speedway uppercase text-sm transition duration-base ease-snap active:scale-95 flex items-center justify-center gap-2"
              >
                <Icon name="help-circle" className="h-5 w-5" />
                View FAQ
              </Link>
              <a
                href={CONTACT_INFO.phoneTel}
                className="bg-chalk/15 hover:bg-chalk/25 text-chalk px-6 py-3 rounded-md font-display tracking-speedway uppercase text-sm transition duration-base ease-snap active:scale-95 flex items-center justify-center gap-2 tabular-nums"
              >
                <Icon name="phone" className="h-5 w-5" />
                {CONTACT_INFO.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
