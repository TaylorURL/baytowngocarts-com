import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAdmin } from "../hooks/useAdmin";
import { supabase } from "../lib/supabase";
import { formatLongDateTime, formatCents } from "../lib/format.js";
import { CONTACT_INFO } from "../lib/content/business.js";
import Icon from "../components/common/Icon.jsx";
import StatusBadge from "../components/common/StatusBadge.jsx";

const VISIT_NOTES = [
  "Government-issued ID for waiver",
  "Closed-toe shoes — track is outdoor",
  "Hair tied back (ties at front desk)",
  "This order number or screenshot",
  "Each race ticket = one 5-minute heat",
];

const MetaTile = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="bg-asphalt-100 p-2 rounded-md text-race-600 shrink-0">
      <Icon name={icon} className="h-5 w-5" />
    </div>
    <div>
      <p className="text-[10px] font-display tracking-speedway uppercase text-asphalt-500 mb-1">
        {label}
      </p>
      <p className="font-semibold text-asphalt-900">{value}</p>
    </div>
  </div>
);

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
    if (!user || !orderId || staffLoading) return;
    let cancelled = false;
    const fetchPurchaseDetails = async () => {
      try {
        let query = supabase.from("purchases").select("*").eq("id", orderId);
        if (!isStaff) query = query.eq("user_id", user.id);
        const { data, error } = await query.single();
        if (error) throw error;
        if (!cancelled) setPurchase(data);
      } catch (error) {
        console.error("Error fetching purchase details:", error);
        alert("Unable to load order details");
        navigate(isStaff ? "/staff" : "/dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchPurchaseDetails();
    return () => {
      cancelled = true;
    };
  }, [user, orderId, staffLoading, isStaff, navigate]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-asphalt-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full border-4 border-asphalt-200 border-t-race-600 animate-spin mx-auto mb-4" />
          <p className="text-asphalt-600 text-lg">Loading order…</p>
        </div>
      </div>
    );
  }

  if (!purchase) return null;

  const isStaffSession = isStaff;
  const backHref = isStaffSession ? "/staff" : "/dashboard";
  const backLabel = isStaffSession ? "Back to Staff Panel" : "Back to Purchases";

  return (
    <div className="w-full -mt-20">
      <section className="relative bg-asphalt-900 overflow-hidden pt-32 pb-20 min-h-[40vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: "url(/images/19.JPEG)" }}
          />
        </div>
        <div className="absolute inset-0 asphalt-grain opacity-70" aria-hidden="true" />
        <div className="absolute top-0 left-0 right-0 h-1.5 race-stripe" aria-hidden="true" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate(backHref)}
              className="flex items-center gap-2 text-chalk hover:text-race-500 transition-colors mb-6 font-display tracking-speedway uppercase text-xs"
            >
              <Icon name="arrow-left" className="h-4 w-4" />
              {backLabel}
            </button>
            <div className="text-center">
              <div className="inline-block mb-6 px-4 py-1.5 bg-race-600 text-chalk rounded-full text-xs font-display tracking-speedway uppercase">
                Order Details
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-4 text-chalk leading-tight tabular-nums">
                Order{" "}
                <span className="text-race-500">#{purchase.order_number}</span>
              </h1>
              <div className="flex items-center justify-center gap-2">
                <StatusBadge status={purchase.status} size="lg" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 z-[6] bg-asphalt-50 speedway-divider" />
      </section>

      <section className="py-20 bg-asphalt-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-lg border border-asphalt-200 shadow-track p-8">
              <h2 className="text-xl font-display tracking-speedway uppercase text-asphalt-900 mb-6 flex items-center gap-3">
                <Icon name="package" className="h-5 w-5 text-race-600" />
                Order Summary
              </h2>
              <div className="space-y-6">
                <div className="border-b border-asphalt-200 pb-6">
                  <h3 className="text-xs font-display tracking-speedway uppercase text-asphalt-500 mb-4">
                    Items
                  </h3>
                  <div className="space-y-3">
                    {purchase.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center py-2 border-b border-asphalt-100 last:border-0"
                      >
                        <div>
                          <p className="font-semibold text-asphalt-900">
                            {item.product_name}
                          </p>
                          <p className="text-sm text-asphalt-600 tabular-nums">
                            {item.quantity} × {formatCents(item.price)}
                          </p>
                        </div>
                        <p className="font-bold text-asphalt-900 tabular-nums">
                          {formatCents(item.subtotal)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t-2 border-asphalt-300 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-display tracking-speedway uppercase text-asphalt-500">
                        Order Total
                      </p>
                      <p className="text-sm text-asphalt-600 tabular-nums">
                        {purchase.total_quantity}{" "}
                        {purchase.total_quantity > 1 ? "people" : "person"}
                      </p>
                    </div>
                    <div className="font-display text-4xl text-race-600 tracking-wide tabular-nums">
                      {formatCents(purchase.total_amount)}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <MetaTile
                    icon="calendar"
                    label="Order Date"
                    value={formatLongDateTime(purchase.created_at)}
                  />
                  <MetaTile
                    icon="credit-card"
                    label="Payment"
                    value={
                      purchase.stripe_session_id?.startsWith("debug_")
                        ? "Debug / Test"
                        : "Stripe (Card)"
                    }
                  />
                  <MetaTile
                    icon="package"
                    label="Order Number"
                    value={purchase.order_number}
                  />
                  <MetaTile
                    icon="check-circle"
                    label="Status"
                    value={
                      <span className="capitalize">{purchase.status}</span>
                    }
                  />
                </div>
              </div>
            </div>

            <div className="bg-asphalt-900 text-chalk rounded-lg p-8 shadow-track">
              <h2 className="text-xl font-display tracking-speedway uppercase mb-6 flex items-center gap-3">
                <Icon name="map-pin" className="h-5 w-5 text-race-400" />
                Visit Info
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold mb-2">Speedway 146</h3>
                  <p className="text-chalk/80 mb-3 text-sm">
                    {CONTACT_INFO.address}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-chalk/80">
                      <Icon name="phone" className="h-4 w-4 text-race-400" />
                      <a
                        href={CONTACT_INFO.phoneTel}
                        className="hover:text-race-400 transition-colors font-semibold tabular-nums"
                      >
                        {CONTACT_INFO.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-chalk/80">
                      <Icon name="mail" className="h-4 w-4 text-race-400" />
                      <a
                        href={CONTACT_INFO.emailMailto}
                        className="hover:text-race-400 transition-colors"
                      >
                        {CONTACT_INFO.email}
                      </a>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-display tracking-speedway uppercase text-xs text-race-400 mb-2">
                    What to bring
                  </h4>
                  <ul className="space-y-1.5 text-chalk/80 text-sm">
                    {VISIT_NOTES.map((note) => (
                      <li key={note}>· {note}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-asphalt-200 shadow-track p-6">
              <button
                onClick={() => window.print()}
                className="w-full flex items-center justify-between p-4 bg-asphalt-50 hover:bg-race-50 rounded-md transition-colors duration-base ease-snap active:scale-[0.99] border border-asphalt-200 hover:border-race-300 group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-race-600 p-2.5 rounded-md text-chalk">
                    <Icon name="download" className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-asphalt-900">
                      Print Confirmation
                    </p>
                    <p className="text-sm text-asphalt-600">
                      Front desk scans this at check-in.
                    </p>
                  </div>
                </div>
                <span className="text-race-600 font-display tracking-speedway uppercase text-xs">
                  Print
                </span>
              </button>
            </div>

            <div className="bg-white rounded-lg border border-asphalt-200 shadow-track p-8">
              <h2 className="text-xl font-display tracking-speedway uppercase text-asphalt-900 mb-3">
                Need to change something?
              </h2>
              <p className="text-asphalt-600 mb-6 text-sm">
                Date changes, group size, allergies, refunds — call the track
                directly.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={CONTACT_INFO.phoneTel}
                  className="flex-1 flex items-center justify-center gap-2 bg-race-600 hover:bg-race-500 text-chalk px-6 py-3 rounded-md font-display tracking-speedway uppercase text-sm shadow-race transition duration-base ease-snap active:scale-95 tabular-nums"
                >
                  <Icon name="phone" className="h-5 w-5" />
                  Call
                </a>
                <a
                  href="/contact"
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-race-600 text-race-600 hover:bg-race-600 hover:text-chalk px-6 py-3 rounded-md font-display tracking-speedway uppercase text-sm transition-colors duration-base ease-snap active:scale-95"
                >
                  <Icon name="mail" className="h-5 w-5" />
                  Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
