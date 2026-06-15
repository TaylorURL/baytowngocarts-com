/**
 * User dashboard / purchases page. Fetches and displays the authenticated
 * user's order history with status badges and navigation to order details.
 */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  ChevronRight,
  Package,
  ShoppingBag,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import { formatCompactDateTime, formatCents } from "../lib/format.js";
import { CONTACT_INFO } from "../lib/content/business.js";
import PageHero from "../components/common/PageHero.jsx";
import StatusBadge from "../components/common/StatusBadge.jsx";

const LoadingState = () => (
  <div className="w-full -mt-20">
    <section className="relative bg-navy-900 overflow-hidden pt-32 pb-20 min-h-screen flex items-center">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url(/images/20.JPEG)" }}
        />
      </div>
      <div className="absolute inset-0 z-[5] opacity-10 checker-overlay" />
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="h-16 w-16 rounded-full border-4 border-red-200/40 border-t-red-500 animate-spin mx-auto mb-4" />
        <p className="text-white text-lg">Loading your dashboard...</p>
      </div>
    </section>
  </div>
);

const EmptyOrdersState = ({ onBrowse }) => (
  <div className="max-w-2xl mx-auto" data-aos="fade-up">
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-12 text-center">
      <div className="bg-red-600/10 ring-1 ring-red-500/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Package className="h-10 w-10 text-red-500" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">No Orders Yet</h3>
      <p className="text-gray-600 mb-8 text-lg">
        You haven't made any purchases yet. Browse our racing packages and book
        your first adventure today!
      </p>
      <button
        onClick={onBrowse}
        className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-red hover:shadow-lg transition duration-200 ease-out hover:scale-105 active:scale-95"
      >
        Browse Racing Packages
      </button>
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h4 className="text-lg font-bold text-gray-800 mb-3">
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
);

const OrderCard = ({ order, index, onSelect }) => (
  <div
    data-aos="fade-up"
    data-aos-delay={index * 50}
    onClick={onSelect}
    className="group bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6 hover:shadow-2xl hover:border-red-300 hover:-translate-y-0.5 transition-[box-shadow,border-color,transform] duration-200 ease-out active:scale-[0.99] cursor-pointer"
  >
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <div className="flex-1">
        <div className="flex items-start gap-4 mb-4">
          <div className="bg-red-100 p-3 rounded-xl flex-shrink-0">
            <ShoppingBag className="h-6 w-6 text-red-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="text-2xl font-bold text-gray-800">
                Order #{order.order_number}
              </h3>
            </div>
            <div className="mb-3 space-y-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="text-gray-700 text-sm">
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
                  {formatCompactDateTime(order.created_at)}
                </span>
              </div>
              <StatusBadge status={order.status} size="lg" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between lg:justify-end gap-4">
        <div className="text-right">
          <div className="font-display text-4xl text-red-600 tracking-wide">
            {formatCents(order.total_amount)}
          </div>
        </div>
        <div className="bg-red-100 p-2 rounded-lg group-hover:bg-red-600 transition-colors duration-200 ease-out">
          <ChevronRight className="h-6 w-6 text-red-600 group-hover:text-white group-hover:translate-x-0.5 transition-[color,transform] duration-200 ease-out" />
        </div>
      </div>
    </div>
  </div>
);

const HelpInfoCards = () => (
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
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            How Orders Work
          </h3>
          <ul className="text-gray-700 text-sm space-y-2">
            <li>• Click on any order to view full details</li>
            <li>• Each order has a unique order number</li>
            <li>• Bring your order confirmation when you visit</li>
            <li>• Orders are valid for the package you purchased</li>
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
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Ready to Race?
          </h3>
          <ul className="text-gray-700 text-sm space-y-2">
            <li>• Visit us during operating hours</li>
            <li>• Bring valid ID (waivers signed at the front desk)</li>
            <li>• Each race ticket = one 5-minute race on the track</li>
            <li>• Show your order number at check-in</li>
            <li>• Call us: {CONTACT_INFO.phone}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default function PurchasesPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { state: { from: location } });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("purchases")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (error) throw error;
        if (!cancelled) setPurchases(data || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchUserData();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading || isLoading) return <LoadingState />;

  return (
    <div className="w-full -mt-20">
      <PageHero
        badge="YOUR ACCOUNT"
        title="My"
        titleAccent="Dashboard"
        description="View your racing bookings, tickets, and order history"
        backgroundImage="/images/21.JPEG"
        minHeightClass="min-h-[50vh]"
        dividerColorClass="bg-white"
      >
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2 bg-navy-800 bg-opacity-80 backdrop-blur-sm px-6 py-3 rounded-full border border-red-600 border-opacity-50">
            <ShoppingBag className="h-5 w-5 text-red-500" />
            <span className="text-white font-semibold">
              <span className="font-display text-2xl text-red-500 mr-1 align-baseline">
                {purchases.length}
              </span>
              Orders
            </span>
          </div>
        </div>
      </PageHero>
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {purchases.length === 0 ? (
              <EmptyOrdersState onBrowse={() => navigate("/pricing")} />
            ) : (
              <div>
                <div className="text-center mb-12" data-aos="fade-up">
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                    Your Order History
                  </h2>
                  <p className="text-xl text-gray-600">
                    Track all your exciting racing adventures and bookings
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {purchases.map((order, index) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      index={index}
                      onSelect={() => navigate(`/purchase/${order.id}`)}
                    />
                  ))}
                </div>
                <HelpInfoCards />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
