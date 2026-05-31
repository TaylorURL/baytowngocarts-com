import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  Mail,
  MapPin,
  Package,
  Phone,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useAdmin } from "../hooks/useAdmin";
import { supabase } from "../lib/supabase";
/**
 * Renders the full details of a single purchase order, including items, totals,
 * visit information, and a printable confirmation. Accessible to the purchasing user or staff.
 */
export default function PurchaseDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isStaff, loading: staffLoading } = useAdmin();
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);
  useEffect(() => {
    if (user && orderId && !staffLoading) {
      fetchPurchaseDetails();
    }
  }, [user, orderId, staffLoading]);
  const fetchPurchaseDetails = async () => {
    try {
      let query = supabase.from("purchases").select("*").eq("id", orderId);
      if (!isStaff) {
        query = query.eq("user_id", user.id);
      }
      const { data, error } = await query.single();
      if (error) throw error;
      setPurchase(data);
    } catch (error) {
      console.error("Error fetching purchase details:", error);
      alert("Unable to load order details");
      navigate(isStaff ? "/staff" : "/dashboard");
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const formatPrice = (cents) => {
    return `$${(cents / 100).toFixed(2)}`;
  };
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full border-4 border-gray-200 border-t-red-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }
  if (!purchase) {
    return null;
  }
  return (
    <div className="w-full -mt-20">
      <section className="relative bg-navy-900 overflow-hidden pt-32 pb-20 min-h-[40vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: "url(/images/19.JPEG)" }}
          />
        </div>
        <div className="absolute inset-0 z-5 opacity-10 checker-overlay" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate(isStaff ? "/staff" : "/dashboard")}
              className="flex items-center gap-2 text-white hover:text-red-500 transition-colors mb-6 font-semibold"
            >
              <ArrowLeft className="h-5 w-5" />
              {isStaff ? "Back to Staff Panel" : "Back to Purchases"}
            </button>
            <div className="text-center">
              <div className="inline-block mb-6 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-bold tracking-wider">
                ORDER DETAILS
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-4 text-white leading-tight">
                Order{" "}
                <span className="text-red-500">#{purchase.order_number}</span>
              </h1>
              <div className="flex items-center justify-center gap-2">
                {purchase.status === "completed" ? (
                  <span className="px-4 py-2 rounded-full text-sm font-bold bg-green-600 text-white flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    COMPLETED
                  </span>
                ) : (
                  <span className="px-4 py-2 rounded-full text-sm font-bold bg-yellow-500 text-yellow-900 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    PENDING
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white [clip-path:polygon(0_100%,100%_0,100%_100%,0%_100%)]" />
      </section>
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Package className="h-6 w-6 text-red-600" />
                Order Summary
              </h2>
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Order Items
                  </h3>
                  <div className="space-y-3">
                    {purchase.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                      >
                        <div>
                          <p className="font-semibold text-gray-800">
                            {item.product_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity} ×{" "}
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        <p className="font-bold text-gray-800">
                          {formatPrice(item.subtotal)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t-2 border-gray-300 flex justify-between items-center">
                    <div>
                      <p className="text-lg font-bold text-gray-800">
                        Order Total
                      </p>
                      <p className="text-sm text-gray-600">
                        Total: {purchase.total_quantity}{" "}
                        {purchase.total_quantity > 1 ? "people" : "person"}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-4xl text-red-600 tracking-wide">
                        {formatPrice(purchase.total_amount)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Order Date</p>
                      <p className="font-semibold text-gray-800">
                        {formatDate(purchase.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <CreditCard className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Payment Method
                      </p>
                      <p className="font-semibold text-gray-800">
                        {purchase.stripe_session_id?.startsWith("debug_")
                          ? "Debug/Test Order"
                          : "Credit Card (Stripe)"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Package className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Order Number</p>
                      <p className="font-semibold text-gray-800">
                        {purchase.order_number}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Order Status</p>
                      <p className="font-semibold text-gray-800 capitalize">
                        {purchase.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <MapPin className="h-6 w-6 text-blue-600" />
                Visit Information
              </h2>
              <div className="space-y-4">
                <div className="bg-white bg-opacity-60 rounded-lg p-4">
                  <h3 className="font-bold text-gray-800 mb-2">Speedway 146</h3>
                  <p className="text-gray-700 mb-3">
                    6750 N TX-146, Baytown, TX 77523
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="h-4 w-4 text-red-600" />
                      <a
                        href="tel:(346) 932-1266"
                        className="hover:text-red-600 transition-colors font-semibold"
                      >
                        (346) 932-1266
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="h-4 w-4 text-red-600" />
                      <a
                        href="mailto:info@speedway146.com"
                        className="hover:text-red-600 transition-colors"
                      >
                        info@speedway146.com
                      </a>
                    </div>
                  </div>
                </div>
                <div className="bg-white bg-opacity-60 rounded-lg p-4">
                  <h4 className="font-bold text-gray-800 mb-2">
                    What to Bring
                  </h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Valid government-issued ID</li>
                    <li>• This order confirmation</li>
                    <li>• Closed-toe shoes required</li>
                    <li>
                      • Each race ticket is one 5-minute race on the track
                    </li>
                    <li>• Waivers signed in person at the front desk</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border-2 border-red-200 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <Download className="h-6 w-6 text-red-600" />
                Print Your Confirmation
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-between p-4 bg-white rounded-lg hover:bg-red-50 transition-colors duration-200 ease-out active:scale-[0.99] border border-red-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-red-600 p-2 rounded-lg group-hover:scale-110 group-active:scale-95 transition-transform duration-200 ease-out">
                      <Download className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-800">
                        Print Order Confirmation
                      </p>
                      <p className="text-sm text-gray-600">
                        Bring to facility for check-in
                      </p>
                    </div>
                  </div>
                  <span className="text-red-600 font-semibold">Print</span>
                </button>
              </div>
            </div>
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Need Help?
              </h2>
              <p className="text-gray-600 mb-6">
                If you have any questions about your order or need to make
                changes, please contact us:
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="tel:(346) 932-1266"
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-semibold shadow-red hover:shadow-lg transition duration-200 ease-out hover:scale-105 active:scale-95"
                >
                  <Phone className="h-5 w-5" />
                  Call Us
                </a>
                <a
                  href="/contact"
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ease-out active:scale-95"
                >
                  <Mail className="h-5 w-5" />
                  Contact Form
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
