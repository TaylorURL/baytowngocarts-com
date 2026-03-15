import React, { useState } from "react";
import {
  Baby,
  Castle,
  Check,
  Clock,
  Crown,
  Download,
  Flag,
  HelpCircle,
  Minus,
  Phone,
  Plus,
  Shield,
  ShoppingCart,
  Sparkles,
  Star,
  Timer,
  Users,
  Zap,
} from "lucide-react";
import { BOUNCE_PRICING } from "../lib/constants.js";
import {
  STRIPE_PRODUCTS,
  STRIPE_DOUBLE_SEATER_PRODUCTS,
  STRIPE_PARTY_PACKAGES,
} from "../lib/stripe-config.js";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";

/**
 * Renders the Pricing page with tabbed views for party packages, individual racing, and bounce house options.
 * Includes a shopping cart summary bar and quantity selectors for each product.
 */
const PricingPage = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantities, setQuantities] = useState({});
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [activeTab, setActiveTab] = useState("individual");

  const getQuantity = (productId) => quantities[productId] || 0;

  const updateQuantity = (productId, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + delta),
    }));
  };

  const setQuantityDirect = (productId, value) => {
    const num = parseInt(value) || 0;
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, num),
    }));
  };

  const getTotalItems = () => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalPrice = () => {
    const allProducts = [
      ...STRIPE_PRODUCTS,
      ...STRIPE_DOUBLE_SEATER_PRODUCTS,
      ...STRIPE_PARTY_PACKAGES,
    ];
    return allProducts.reduce((sum, product) => {
      const qty = getQuantity(product.id);
      const price = parseFloat(product.price.replace("$", ""));
      return sum + qty * price;
    }, 0);
  };

  /** Adds all selected products to the cart. */
  const addSelectedToCart = () => {
    const allProducts = [
      ...STRIPE_PRODUCTS,
      ...STRIPE_DOUBLE_SEATER_PRODUCTS,
      ...STRIPE_PARTY_PACKAGES,
    ];
    allProducts.forEach((product) => {
      const qty = getQuantity(product.id);
      if (qty > 0) {
        addItem(product, qty);
      }
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

  const getIcon = (name) => {
    if (name.includes("Kid")) return Baby;
    if (name.includes("Adult")) return Zap;
    if (name.includes("Family")) return Users;
    if (name.includes("2.5") || name.includes("Hour")) return Timer;
    if (
      name.includes("Double") ||
      name.includes("Ride Along") ||
      name.includes("Track Titan")
    )
      return Users;
    return Sparkles;
  };

  const partyFeatures = [
    "Includes 20 Racing Bracelets",
    "2 hours of organized racing",
    "Bracelets can be shared or rotated",
    "Everyone gets multiple chances to race",
    "Staff manages racing for safety",
    "Shared track with public riders",
    "3 hours in a private party room",
    "Room accommodates up to 45 guests",
    "Outdoor seating at no extra cost",
    "Tables & chairs fully set up",
    "Wristbands included",
  ];

  return (
    <div className="w-full -mt-20">
      <section className="relative bg-navy-900 overflow-hidden pt-32 pb-24">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: "url(/images/17.JPEG)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-900/50 to-navy-900" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              Pricing & Packages
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Choose the perfect experience for your visit
            </p>

            <div className="inline-flex bg-gray-800/50 backdrop-blur-sm rounded-2xl p-1.5 border border-white/10">
              <button
                onClick={() => setActiveTab("parties")}
                className={`px-6 py-3 rounded-xl font-bold text-sm md:text-base transition-all ${
                  activeTab === "parties"
                    ? "bg-red-600 text-white shadow-lg"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <Flag className="h-4 w-4 inline mr-2" />
                Party Packages
              </button>
              <button
                onClick={() => setActiveTab("individual")}
                className={`px-6 py-3 rounded-xl font-bold text-sm md:text-base transition-all ${
                  activeTab === "individual"
                    ? "bg-red-600 text-white shadow-lg"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <Users className="h-4 w-4 inline mr-2" />
                Individual Racing
              </button>
              <button
                onClick={() => setActiveTab("bounce")}
                className={`px-6 py-3 rounded-xl font-bold text-sm md:text-base transition-all ${
                  activeTab === "bounce"
                    ? "bg-red-600 text-white shadow-lg"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <Baby className="h-4 w-4 inline mr-2" />
                Bounce House
              </button>
            </div>
          </div>
        </div>
      </section>

      {showCartNotification && (
        <div className="fixed top-24 right-4 z-50 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
          <Check className="h-6 w-6" />
          <span className="font-bold">Items added to cart!</span>
        </div>
      )}

      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t-4 border-red-600 shadow-2xl p-4 transition-transform duration-300 ${getTotalItems() > 0 ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-red-600 p-3 rounded-xl">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Your Selection</p>
              <p className="text-xl font-bold text-gray-800">
                {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"} - $
                {getTotalPrice().toFixed(2)}
              </p>
            </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={handleAddAllToCart}
              className="flex-1 sm:flex-none bg-gray-800 hover:bg-gray-700 text-white px-5 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add to Cart
            </button>
            <button
              onClick={handleGoToCart}
              className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              Checkout
            </button>
          </div>
        </div>
      </div>

      {activeTab === "parties" && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Party Packages
                </h2>
                <p className="text-gray-600">
                  Select your package and add-ons, then checkout
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
                        className={`bg-white rounded-3xl shadow-xl overflow-hidden border-2 ${isSelected ? "border-red-500 ring-2 ring-red-200" : "border-red-500"}`}
                      >
                        <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                            <span className="text-white font-bold">
                              MOST POPULAR
                            </span>
                            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                          </div>
                        </div>

                        <div className="p-6 md:p-8">
                          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                            {product.name}
                          </h2>
                          <p className="text-gray-600 mb-4">
                            {product.description}
                          </p>

                          <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-5xl font-bold text-red-600">
                              {product.price}
                            </span>
                            <span className="text-gray-500">+ tax</span>
                          </div>

                          <div className="space-y-3 mb-6">
                            {partyFeatures.map((feature, idx) => (
                              <div key={idx} className="flex items-start gap-3">
                                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <span
                                  className={`${idx < 2 || idx === 6 ? "font-semibold text-gray-800" : "text-gray-700"}`}
                                >
                                  {feature}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-center gap-3 mb-4">
                            <button
                              onClick={() => updateQuantity(product.id, -1)}
                              disabled={qty === 0}
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${qty === 0 ? "bg-gray-100 text-gray-400" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}
                            >
                              <Minus className="h-5 w-5" />
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={qty}
                              onChange={(e) =>
                                setQuantityDirect(product.id, e.target.value)
                              }
                              className="w-16 text-center font-bold text-gray-800 border-2 border-gray-200 rounded-lg py-2 text-lg"
                            />
                            <button
                              onClick={() => updateQuantity(product.id, 1)}
                              className="w-10 h-10 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
                            >
                              <Plus className="h-5 w-5" />
                            </button>
                          </div>

                          {isSelected && (
                            <div className="bg-red-50 rounded-xl py-3 text-center mb-4">
                              <span className="text-red-600 font-bold text-lg">
                                $
                                {(
                                  parseFloat(product.price.replace("$", "")) *
                                  qty
                                ).toFixed(2)}
                              </span>
                            </div>
                          )}

                          <p className="text-center text-sm text-gray-500">
                            Or call to book:{" "}
                            <a
                              href="tel:(346) 932-1266"
                              className="text-red-600 font-semibold"
                            >
                              (346) 932-1266
                            </a>
                          </p>
                        </div>
                      </div>
                    );
                  },
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-orange-500" />
                      Party Upgrades
                    </h3>
                    <div className="space-y-3">
                      {STRIPE_PARTY_PACKAGES.filter((p) => p.isUpgrade).map(
                        (product) => {
                          const qty = getQuantity(product.id);
                          const isSelected = qty > 0;
                          const IconComponent = product.name.includes("Bounce")
                            ? Castle
                            : product.name.includes("Race Together")
                              ? Users
                              : Crown;
                          const isPopular = product.name.includes("Bounce");

                          return (
                            <div
                              key={product.id}
                              className={`bg-white rounded-xl p-4 shadow-md border-2 ${isPopular ? "border-orange-400" : isSelected ? "border-red-400" : "border-gray-100"} ${isSelected ? "ring-2 ring-red-200" : ""} relative`}
                            >
                              {isPopular && (
                                <div className="absolute -top-2 right-4 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                  POPULAR
                                </div>
                              )}
                              <div className="flex items-center gap-4">
                                <div
                                  className={`p-3 rounded-xl ${isPopular ? "bg-orange-100" : "bg-gray-100"}`}
                                >
                                  <IconComponent
                                    className={`h-6 w-6 ${isPopular ? "text-orange-600" : "text-gray-600"}`}
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-gray-800">
                                    {product.name}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {product.description}
                                  </p>
                                </div>
                                <div className="text-xl font-bold text-gray-800">
                                  {product.price}
                                </div>
                              </div>
                              <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
                                <button
                                  onClick={() => updateQuantity(product.id, -1)}
                                  disabled={qty === 0}
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${qty === 0 ? "bg-gray-100 text-gray-400" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <input
                                  type="number"
                                  min="0"
                                  value={qty}
                                  onChange={(e) =>
                                    setQuantityDirect(
                                      product.id,
                                      e.target.value,
                                    )
                                  }
                                  className="w-12 text-center font-bold text-gray-800 border border-gray-200 rounded-lg py-1 text-sm"
                                />
                                <button
                                  onClick={() => updateQuantity(product.id, 1)}
                                  className="w-8 h-8 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              {isSelected && (
                                <div className="mt-2 bg-red-50 rounded-lg py-1 text-center">
                                  <span className="text-red-600 font-bold text-sm">
                                    $
                                    {(
                                      parseFloat(
                                        product.price.replace("$", ""),
                                      ) * qty
                                    ).toFixed(2)}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        },
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-3 flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Additional racing bracelets available - ask for details
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                    <h4 className="font-bold text-green-800 mb-3">
                      Why Families Love Our Parties
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Simple pricing",
                        "Flexible for all ages",
                        "No guest count stress",
                        "Safe & organized",
                        "Staff handles everything",
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm text-green-700"
                        >
                          <Check className="h-4 w-4" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-6 text-white text-center">
                    <h4 className="font-bold text-lg mb-2">Questions?</h4>
                    <p className="text-gray-300 text-sm mb-4">
                      Call us to customize your party
                    </p>
                    <a
                      href="tel:(346) 932-1266"
                      className="inline-flex items-center gap-2 bg-white text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all"
                    >
                      <Phone className="h-5 w-5" />
                      (346) 932-1266
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === "individual" && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Go-Kart Racing Packages
                </h2>
                <p className="text-gray-600">
                  Select quantities and add to cart
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-12">
                {STRIPE_PRODUCTS.map((product) => {
                  const Icon = getIcon(product.name);
                  const qty = getQuantity(product.id);
                  const isSelected = qty > 0;

                  return (
                    <div
                      key={product.id}
                      className={`bg-white rounded-xl p-4 shadow-md border-2 transition-all ${
                        product.isPopular
                          ? "border-red-500"
                          : isSelected
                            ? "border-red-400"
                            : "border-gray-100 hover:border-gray-200"
                      } ${isSelected ? "ring-2 ring-red-200" : ""}`}
                    >
                      {product.isPopular && (
                        <div className="text-center mb-2">
                          <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                            BEST VALUE
                          </span>
                        </div>
                      )}
                      <div className="text-center mb-3">
                        <div
                          className={`inline-flex p-2 rounded-lg mb-2 ${product.isPopular ? "bg-red-100" : "bg-gray-100"}`}
                        >
                          <Icon
                            className={`h-5 w-5 ${product.isPopular ? "text-red-600" : "text-gray-600"}`}
                          />
                        </div>
                        <h3 className="font-bold text-gray-800 text-sm leading-tight">
                          {product.name}
                        </h3>
                        <div className="text-2xl font-bold text-gray-800 mt-1">
                          {product.price}
                        </div>
                        <p className="text-xs text-gray-500">per person</p>
                      </div>

                      <ul className="space-y-1 mb-3">
                        {product.features.slice(0, 2).map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-start text-xs text-gray-600"
                          >
                            <Check
                              size={12}
                              className="text-green-600 mr-1 mt-0.5 flex-shrink-0"
                            />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <div className="flex items-center justify-center gap-2 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => updateQuantity(product.id, -1)}
                          disabled={qty === 0}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${qty === 0 ? "bg-gray-100 text-gray-400" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={qty}
                          onChange={(e) =>
                            setQuantityDirect(product.id, e.target.value)
                          }
                          className="w-12 text-center font-bold text-gray-800 border border-gray-200 rounded-lg py-1 text-sm"
                        />
                        <button
                          onClick={() => updateQuantity(product.id, 1)}
                          className="w-8 h-8 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      {isSelected && (
                        <div className="mt-2 bg-red-50 rounded-lg py-1 text-center">
                          <span className="text-red-600 font-bold text-sm">
                            $
                            {(
                              parseFloat(product.price.replace("$", "")) * qty
                            ).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Double Seater Racing
                </h3>
                <p className="text-gray-600 text-sm">
                  Driver must be 53"+ and passenger 33"+
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
                {STRIPE_DOUBLE_SEATER_PRODUCTS.map((product) => {
                  const Icon = getIcon(product.name);
                  const qty = getQuantity(product.id);
                  const isSelected = qty > 0;

                  return (
                    <div
                      key={product.id}
                      className={`bg-white rounded-xl p-4 shadow-md border-2 transition-all ${
                        product.isPopular
                          ? "border-red-500"
                          : isSelected
                            ? "border-red-400"
                            : "border-gray-100 hover:border-gray-200"
                      } ${isSelected ? "ring-2 ring-red-200" : ""}`}
                    >
                      {product.isPopular && (
                        <div className="text-center mb-2">
                          <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                            BEST VALUE
                          </span>
                        </div>
                      )}
                      <div className="text-center mb-3">
                        <div className="inline-flex p-2 rounded-lg mb-2 bg-gray-700">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="font-bold text-gray-800 text-sm leading-tight">
                          {product.name}
                        </h3>
                        <div className="text-2xl font-bold text-gray-800 mt-1">
                          {product.price}
                        </div>
                        <p className="text-xs text-gray-500">per kart</p>
                      </div>

                      <ul className="space-y-1 mb-3">
                        {product.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-start text-xs text-gray-600"
                          >
                            <Check
                              size={12}
                              className="text-green-600 mr-1 mt-0.5 flex-shrink-0"
                            />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <div className="flex items-center justify-center gap-2 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => updateQuantity(product.id, -1)}
                          disabled={qty === 0}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${qty === 0 ? "bg-gray-100 text-gray-400" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={qty}
                          onChange={(e) =>
                            setQuantityDirect(product.id, e.target.value)
                          }
                          className="w-12 text-center font-bold text-gray-800 border border-gray-200 rounded-lg py-1 text-sm"
                        />
                        <button
                          onClick={() => updateQuantity(product.id, 1)}
                          className="w-8 h-8 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      {isSelected && (
                        <div className="mt-2 bg-red-50 rounded-lg py-1 text-center">
                          <span className="text-red-600 font-bold text-sm">
                            $
                            {(
                              parseFloat(product.price.replace("$", "")) * qty
                            ).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="bg-gray-800 rounded-2xl p-6 text-white max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <Users className="h-5 w-5 text-red-400" />
                      Height Requirements
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-red-400" />
                        <span>
                          <span className="text-red-400 font-semibold">
                            Kiddie Karts:
                          </span>{" "}
                          Minimum 40" tall
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-red-400" />
                        <span>
                          <span className="text-red-400 font-semibold">
                            Adult Karts:
                          </span>{" "}
                          Minimum 53" tall
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-red-400" />
                        <span>
                          <span className="text-red-400 font-semibold">
                            Double Seater:
                          </span>{" "}
                          Driver 53"+, Passenger 33"+
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-red-400" />
                      Policies
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-red-400" />
                        All packages must be used same day
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-red-400" />
                        Long hair must be tied back
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-red-400" />
                        Signed waiver required
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === "bounce" && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Bounce House Fun
                </h2>
                <p className="text-gray-600">
                  Safe jumping fun for kids of all ages - climate controlled!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {BOUNCE_PRICING.map((plan, idx) => (
                  <div
                    key={idx}
                    className={`bg-white rounded-xl p-6 shadow-md border-2 ${plan.isPopular ? "border-red-500" : "border-gray-100"} relative`}
                  >
                    {plan.isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                          MOST POPULAR
                        </span>
                      </div>
                    )}
                    <div className="text-center mb-4">
                      <div className="inline-flex bg-gray-100 p-3 rounded-xl mb-3">
                        <Baby className="h-6 w-6 text-gray-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {plan.title}
                      </h3>
                      {plan.description && (
                        <p className="text-sm text-gray-500">
                          {plan.description}
                        </p>
                      )}
                    </div>
                    <div className="text-center mb-4">
                      <span className="text-4xl font-bold text-gray-800">
                        {plan.price}
                      </span>
                      <span className="text-gray-500 text-sm ml-1">
                        per person
                      </span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {plan.items.map((feature, featureIdx) => (
                        <li
                          key={featureIdx}
                          className="flex items-start text-sm"
                        >
                          <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => (window.location.href = "/contact")}
                      className={`w-full py-3 rounded-xl font-bold transition-all ${
                        plan.isPopular
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-gray-800 hover:bg-gray-700 text-white"
                      }`}
                    >
                      Reserve Now
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="bg-gray-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Shield className="h-6 w-6 text-gray-600" />
                    </div>
                    <h4 className="font-bold text-gray-800 mb-1">
                      Safe & Clean
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Supervised and sanitized daily
                    </p>
                  </div>
                  <div>
                    <div className="bg-gray-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Zap className="h-6 w-6 text-gray-600" />
                    </div>
                    <h4 className="font-bold text-gray-800 mb-1">
                      Climate Controlled
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Comfortable indoor environment
                    </p>
                  </div>
                  <div>
                    <div className="bg-gray-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Users className="h-6 w-6 text-gray-600" />
                    </div>
                    <h4 className="font-bold text-gray-800 mb-1">
                      All Ages Welcome
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Fun for the whole family
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-800 rounded-2xl p-6 md:p-8">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-white mb-1">
                  Download Waivers
                </h3>
                <p className="text-gray-400 text-sm">
                  Complete before your visit for faster check-in
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="/images/Speedway146_Waiver_Address_Footer_Fixed.pdf"
                  download
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="h-4 w-4" />
                  Go-Kart Waiver
                </a>
                <a
                  href="/images/Bounce House Participant Waiver and Release PDF.pdf"
                  download
                  className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="h-4 w-4" />
                  Bounce House Waiver
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-12 text-white"
        style={{
          background:
            "linear-gradient(135deg, #334155 0%, #1e293b 50%, #0f172a 100%)",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-3">Questions?</h2>
            <p className="text-gray-300 mb-6">
              Check our FAQ or give us a call
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/faq"
                className="bg-white text-red-600 hover:bg-gray-100 px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <HelpCircle className="h-5 w-5" />
                View FAQ
              </Link>
              <a
                href="tel:(346) 932-1266"
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <Phone className="h-5 w-5" />
                (346) 932-1266
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
