import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import { formatCompactDateTime, formatCents } from "../lib/format.js";
import { CONTACT_INFO } from "../lib/content/business.js";
import Icon from "../components/common/Icon.jsx";
import PageHero from "../components/common/PageHero.jsx";
import StatusBadge from "../components/common/StatusBadge.jsx";

const LoadingState = () => (
  <div className="w-full -mt-20">
    <section className="relative bg-asphalt-900 overflow-hidden pt-32 pb-20 min-h-screen flex items-center">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url(/images/20.JPEG)" }}
        />
      </div>
      <div className="absolute inset-0 z-[5] opacity-10 checker-overlay" />
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="h-16 w-16 rounded-full border-4 border-race-200/40 border-t-race-500 animate-spin mx-auto mb-4" />
        <p className="text-chalk text-lg">Loading your orders…</p>
      </div>
    </section>
  </div>
);

const EmptyOrdersState = ({ onBrowse }) => (
  <div className="max-w-2xl mx-auto" data-aos="fade-up">
    <div className="bg-white rounded-lg border border-asphalt-200 shadow-track p-12 text-center">
      <div className="bg-race-600/10 ring-1 ring-race-500/20 w-20 h-20 rounded-md flex items-center justify-center mx-auto mb-6">
        <Icon name="package" className="h-10 w-10 text-race-500" />
      </div>
      <h3 className="text-2xl font-bold text-asphalt-900 mb-3">
        No orders yet.
      </h3>
      <p className="text-asphalt-600 mb-8">
        Once you book — race tickets, party packages, or unlimited wristbands —
        they show up here for easy check-in at the front desk.
      </p>
      <button
        onClick={onBrowse}
        className="bg-race-600 hover:bg-race-500 text-chalk px-8 py-4 rounded-md font-display tracking-speedway uppercase text-sm shadow-race transition duration-base ease-snap active:scale-95"
      >
        See Pricing
      </button>
    </div>
  </div>
);

const OrderCard = ({ order, index, onSelect }) => (
  <div
    data-aos="fade-up"
    data-aos-delay={index * 50}
    onClick={onSelect}
    className="group bg-white rounded-lg border border-asphalt-200 shadow-track p-6 hover:shadow-lift hover:border-race-300 hover:-translate-y-0.5 transition-[box-shadow,border-color,transform] duration-base ease-snap active:scale-[0.99] cursor-pointer"
  >
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <div className="flex-1">
        <div className="flex items-start gap-4 mb-4">
          <div className="bg-race-50 p-3 rounded-md flex-shrink-0">
            <Icon name="shopping-bag" className="h-6 w-6 text-race-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="text-xl font-bold text-asphalt-900 tabular-nums">
                Order #{order.order_number}
              </h3>
            </div>
            <div className="mb-3 space-y-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="text-asphalt-700 text-sm">
                  · {item.product_name} × {item.quantity}
                </div>
              ))}
              <div className="text-asphalt-600 text-sm font-semibold mt-2 tabular-nums">
                {order.total_quantity} items
              </div>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2 text-asphalt-600">
                <Icon name="calendar" className="h-4 w-4" />
                <span className="text-sm tabular-nums">
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
          <div className="font-display text-4xl text-race-600 tracking-wide tabular-nums">
            {formatCents(order.total_amount)}
          </div>
        </div>
        <div className="bg-race-50 p-2 rounded-md group-hover:bg-race-600 transition-colors duration-base ease-snap">
          <Icon
            name="chevron-right"
            className="h-6 w-6 text-race-600 group-hover:text-chalk group-hover:translate-x-0.5 transition-[color,transform] duration-base ease-snap"
          />
        </div>
      </div>
    </div>
  </div>
);

const HelpInfoCards = () => (
  <div
    className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5"
    data-aos="fade-up"
  >
    <div className="bg-asphalt-50 rounded-lg p-6 border border-asphalt-200">
      <div className="flex items-start gap-4">
        <div className="bg-race-600 p-3 rounded-md flex-shrink-0">
          <Icon name="package" className="h-5 w-5 text-chalk" />
        </div>
        <div>
          <h3 className="font-display tracking-speedway uppercase text-sm text-asphalt-900 mb-2">
            How orders work
          </h3>
          <ul className="text-asphalt-700 text-sm space-y-1.5">
            <li>· Click an order to see the full breakdown.</li>
            <li>· Order number is what staff scans at check-in.</li>
            <li>· Bring valid ID — waivers are signed in person.</li>
            <li>· Race tickets roll over 7 days if you ask before leaving.</li>
          </ul>
        </div>
      </div>
    </div>
    <div className="bg-asphalt-50 rounded-lg p-6 border border-asphalt-200">
      <div className="flex items-start gap-4">
        <div className="bg-race-600 p-3 rounded-md flex-shrink-0">
          <Icon name="flag" className="h-5 w-5 text-chalk" />
        </div>
        <div>
          <h3 className="font-display tracking-speedway uppercase text-sm text-asphalt-900 mb-2">
            Ready to race
          </h3>
          <ul className="text-asphalt-700 text-sm space-y-1.5">
            <li>· Walk-ins welcome any open hour.</li>
            <li>· 5-minute heats — kids and adults raced separately.</li>
            <li>· Hair tied back, closed-toe shoes recommended.</li>
            <li className="tabular-nums">· Call: {CONTACT_INFO.phone}</li>
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
        badge="Your Account"
        title="My"
        titleAccent="Purchases"
        description="Race tickets, party packages, and bookings — anything you've paid for shows up here."
        backgroundImage="/images/21.JPEG"
        minHeightClass="min-h-[50vh]"
        dividerColorClass="bg-asphalt-50"
      >
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-3 bg-asphalt-800/80 px-5 py-2.5 rounded-md border border-race-600/50">
            <Icon name="shopping-bag" className="h-5 w-5 text-race-400" />
            <span className="text-chalk font-display tracking-speedway uppercase text-xs">
              <span className="text-race-400 mr-1 tabular-nums">
                {purchases.length}
              </span>
              {purchases.length === 1 ? "Order" : "Orders"}
            </span>
          </div>
        </div>
      </PageHero>
      <section className="py-20 bg-asphalt-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {purchases.length === 0 ? (
              <EmptyOrdersState onBrowse={() => navigate("/pricing")} />
            ) : (
              <div>
                <div className="text-center mb-10" data-aos="fade-up">
                  <h2 className="text-3xl font-bold text-asphalt-900 mb-2">
                    Order History
                  </h2>
                  <p className="text-asphalt-600">
                    Newest first. Click any order for the full breakdown.
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
