import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  CheckCircle,
  ChevronRight,
  Package,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";

export default function PurchasesPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const { data: purchaseData, error: purchaseError } = await supabase
        .from("purchases")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (purchaseError) throw purchaseError;
      setPurchases(purchaseData || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (amount) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  if (loading || isLoading) {
    return (
      <div className="w-full -mt-20">
        <section className="relative bg-navy-900 overflow-hidden pt-32 pb-20 min-h-screen flex items-center">
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: "url(/images/20.JPEG)" }}
            />
          </div>

          <div
            className="absolute inset-0 z-5 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(45deg, var(--color-black) 25%, transparent 25%), linear-gradient(-45deg, var(--color-black) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--color-black) 75%), linear-gradient(-45deg, transparent 75%, var(--color-black) 75%)",
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
            }}
          />

          <div className="relative z-10 container mx-auto px-4 text-center">
            <div
              className="animate-spin rounded-full h-16 w-16 border-4 mx-auto mb-4"
              style={{
                borderColor: "var(--color-red-200)",
                borderTopColor: "var(--color-red-600)",
              }}
            ></div>
            <p className="text-white text-lg">Loading your dashboard...</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full -mt-20">
      <section className="relative bg-navy-900 overflow-hidden pt-32 pb-20 min-h-[50vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: "url(/images/21.JPEG)" }}
          />
        </div>

        <div
          className="absolute inset-0 z-5 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(45deg, var(--color-black) 25%, transparent 25%), linear-gradient(-45deg, var(--color-black) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--color-black) 75%), linear-gradient(-45deg, transparent 75%, var(--color-black) 75%)",
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
          }}
        />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <div className="inline-block mb-6 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-bold tracking-wider">
              YOUR ACCOUNT
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              My <span className="text-red-500">Dashboard</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              View your racing bookings, tickets, and order history
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-navy-800 bg-opacity-80 backdrop-blur-sm px-6 py-3 rounded-full border border-red-600 border-opacity-50">
                <ShoppingBag className="h-5 w-5 text-red-500" />
                <span className="text-white font-semibold">
                  {purchases.length} Orders
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-16 bg-white"
          style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%, 0% 100%)" }}
        />
      </section>

      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {purchases.length === 0 ? (
              <div className="max-w-2xl mx-auto" data-aos="fade-up">
                <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-12 text-center">
                  <div className="bg-gray-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Package className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-navy-900 mb-4">
                    No Orders Yet
                  </h3>
                  <p className="text-gray-600 mb-8 text-lg">
                    You haven't made any purchases yet. Browse our racing
                    packages and book your first adventure today!
                  </p>
                  <button
                    onClick={() => navigate("/pricing")}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
                  >
                    Browse Racing Packages
                  </button>

                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h4 className="text-lg font-bold text-navy-900 mb-3">
                      What You'll See Here
                    </h4>
                    <ul className="text-gray-600 text-sm space-y-2 text-left max-w-md mx-auto">
                      <li>✓ All your racing package purchases</li>
                      <li>✓ Order numbers for easy check-in</li>
                      <li>✓ Purchase dates and amounts</li>
                      <li>✓ Order status and details</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-center mb-12" data-aos="fade-up">
                  <h2 className="text-3xl lg:text-4xl font-bold text-navy-900 mb-4">
                    Your Order History
                  </h2>
                  <p className="text-xl text-gray-600">
                    Track all your exciting racing adventures and bookings
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {purchases.map((order, index) => (
                    <div
                      key={order.id}
                      data-aos="fade-up"
                      data-aos-delay={index * 50}
                      onClick={() => navigate(`/purchase/${order.id}`)}
                      className="group bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:border-red-300 cursor-pointer"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="bg-red-100 p-3 rounded-xl flex-shrink-0">
                              <ShoppingBag className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <h3 className="text-2xl font-bold text-navy-900">
                                  Order #{order.order_number}
                                </h3>
                              </div>
                              <div className="mb-3 space-y-1">
                                {order.items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="text-gray-700 text-sm"
                                  >
                                    • {item.product_name} × {item.quantity}
                                  </div>
                                ))}
                                <div className="text-gray-600 text-sm font-semibold mt-2">
                                  Total: {order.total_quantity} items
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Calendar className="h-4 w-4" />
                                  <span className="text-sm">
                                    {formatDate(order.created_at)}
                                  </span>
                                </div>
                                <div
                                  className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                                  style={{
                                    backgroundColor:
                                      order.status === "completed"
                                        ? "rgba(22, 163, 74, 0.15)"
                                        : "rgba(251, 191, 36, 0.15)",
                                    color:
                                      order.status === "completed"
                                        ? "var(--color-green-700)"
                                        : "var(--color-yellow-400)",
                                  }}
                                >
                                  {order.status === "completed" && (
                                    <CheckCircle className="h-3 w-3" />
                                  )}
                                  {order.status === "completed"
                                    ? "COMPLETED"
                                    : "PENDING"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between lg:justify-end gap-4">
                          <div className="text-right">
                            <div className="text-3xl font-black text-red-600">
                              {formatPrice(order.total_amount)}
                            </div>
                          </div>
                          <div className="bg-red-100 p-2 rounded-lg group-hover:bg-red-600 transition-colors">
                            <ChevronRight className="h-6 w-6 text-red-600 group-hover:text-white transition-colors" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6"
                  data-aos="fade-up"
                >
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-600 p-3 rounded-xl flex-shrink-0">
                        <Package className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-navy-900 mb-2">
                          How Orders Work
                        </h3>
                        <ul className="text-gray-700 text-sm space-y-2">
                          <li>• Click on any order to view full details</li>
                          <li>• Each order has a unique order number</li>
                          <li>
                            • Bring your order confirmation when you visit
                          </li>
                          <li>
                            • Orders are valid for the package you purchased
                          </li>
                          <li>• Check your email for detailed instructions</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200">
                    <div className="flex items-start gap-4">
                      <div className="bg-green-600 p-3 rounded-xl flex-shrink-0">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-navy-900 mb-2">
                          Ready to Race?
                        </h3>
                        <ul className="text-gray-700 text-sm space-y-2">
                          <li>• Visit us during operating hours</li>
                          <li>• Bring valid ID and signed waiver</li>
                          <li>• Show your order number at check-in</li>
                          <li>• Call us: (346) 932-1266</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
