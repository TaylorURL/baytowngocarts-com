import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../hooks/useAdmin";
import { supabase } from "../lib/supabase";
import { formatShortDateTime, formatCents } from "../lib/format.js";
import Icon from "../components/common/Icon.jsx";
import PageHero from "../components/common/PageHero.jsx";
import StatusBadge from "../components/common/StatusBadge.jsx";

const STAT_CARDS = [
  {
    key: "totalOrders",
    label: "Orders",
    icon: "shopping-bag",
    iconBg: "bg-race-50",
    iconColor: "text-race-600",
    trailingIcon: "trending-up",
    trailingColor: "text-green-600",
    format: (v) => v,
  },
  {
    key: "totalRevenue",
    label: "Revenue",
    icon: "dollar-sign",
    iconBg: "bg-green-50",
    iconColor: "text-green-700",
    trailingIcon: "trending-up",
    trailingColor: "text-green-600",
    format: (v) => `$${v.toFixed(2)}`,
  },
  {
    key: "todayOrders",
    label: "Today",
    icon: "calendar",
    iconBg: "bg-asphalt-100",
    iconColor: "text-asphalt-700",
    trailingIcon: "clock",
    trailingColor: "text-asphalt-500",
    format: (v) => v,
  },
  {
    key: "todayRevenue",
    label: "Today's Revenue",
    icon: "dollar-sign",
    iconBg: "bg-caution-100",
    iconColor: "text-caution-700",
    trailingIcon: "clock",
    trailingColor: "text-asphalt-500",
    format: (v) => `$${v.toFixed(2)}`,
  },
];
const DATE_FILTERS = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "quarter", label: "This Quarter" },
  { key: "year", label: "This Year" },
  { key: "all", label: "All Time" },
];
const DEFAULT_STATS = {
  totalOrders: 0,
  totalRevenue: 0,
  todayOrders: 0,
  todayRevenue: 0,
};
function getDateFilterStart(filterKey) {
  if (filterKey === "all") return null;
  const now = new Date();
  switch (filterKey) {
    case "today":
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case "week": {
      const d = new Date(now);
      d.setDate(now.getDate() - 7);
      return d;
    }
    case "month":
      return new Date(now.getFullYear(), now.getMonth(), 1);
    case "quarter":
      return new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
    case "year":
      return new Date(now.getFullYear(), 0, 1);
    default:
      return null;
  }
}
/**
 * Renders the staff-only admin panel with order stats, search, filtering, and order details.
 * Redirects non-staff users to the home page.
 */
export default function StaffPanelPage() {
  const navigate = useNavigate();
  const { isStaff, loading: staffLoading } = useAdmin();
  const [activeTab, setActiveTab] = useState("overview");
  const [dateFilter, setDateFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [recentOrders, setRecentOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  useEffect(() => {
    if (!staffLoading && !isStaff) {
      navigate("/");
    }
  }, [isStaff, staffLoading, navigate]);
  useEffect(() => {
    if (isStaff) {
      fetchStats();
      fetchRecentOrders();
    }
  }, [isStaff]);
  const fetchStats = async () => {
    try {
      const { count: totalOrders } = await supabase
        .from("purchases")
        .select("*", { count: "exact", head: true });
      const { data: revenueData } = await supabase
        .from("purchases")
        .select("total_amount, created_at");
      if (!revenueData) {
        setStats({ ...DEFAULT_STATS, totalOrders: totalOrders || 0 });
        return;
      }
      const totalRevenue =
        revenueData.reduce((sum, order) => sum + order.total_amount, 0) / 100;
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayOrders = revenueData.filter(
        (order) => new Date(order.created_at) >= todayStart,
      );
      setStats({
        totalOrders: totalOrders || 0,
        totalRevenue,
        todayOrders: todayOrders.length,
        todayRevenue:
          todayOrders.reduce((sum, order) => sum + order.total_amount, 0) / 100,
      });
    } catch {
      setStats(DEFAULT_STATS);
    }
  };
  const fetchRecentOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("purchases")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setAllOrders(data || []);
      setRecentOrders((data || []).slice(0, 10));
    } catch {
      setAllOrders([]);
      setRecentOrders([]);
    } finally {
      setLoading(false);
    }
  };
  const getDateFilteredOrders = (orders) => {
    const startDate = getDateFilterStart(dateFilter);
    if (!startDate) return orders;
    return orders.filter((order) => new Date(order.created_at) >= startDate);
  };
  const filteredOrders = searchQuery.trim()
    ? allOrders.filter((order) =>
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : recentOrders;
  const displayOrders = getDateFilteredOrders(
    activeTab === "all" ? allOrders : filteredOrders,
  );
  const toggleOrder = (orderId) =>
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  if (staffLoading || loading) {
    return (
      <div className="min-h-screen bg-asphalt-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-asphalt-700 border-t-race-500 mx-auto mb-4" />
          <p className="text-chalk text-lg font-display tracking-speedway uppercase text-sm">
            Loading Staff Panel
          </p>
        </div>
      </div>
    );
  }
  if (!isStaff) return null;
  return (
    <div className="w-full -mt-20">
      <PageHero
        badge="Operations"
        title="Staff"
        titleAccent="Panel"
        description="Live order ledger. Search by order number, filter by date window, expand for line items."
        backgroundImage="/images/22.JPEG"
        dividerColorClass="bg-asphalt-50"
      />
      <section className="py-12 bg-asphalt-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
              {STAT_CARDS.map(
                ({
                  key,
                  label,
                  icon,
                  iconBg,
                  iconColor,
                  trailingIcon,
                  trailingColor,
                  format,
                }) => (
                  <div
                    key={key}
                    className="bg-white rounded-lg border border-asphalt-200 shadow-track p-4 sm:p-6"
                  >
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className={`p-2 sm:p-3 ${iconBg} rounded-md`}>
                        <Icon
                          name={icon}
                          className={`h-5 w-5 sm:h-6 sm:w-6 ${iconColor}`}
                        />
                      </div>
                      <Icon
                        name={trailingIcon}
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${trailingColor}`}
                      />
                    </div>
                    <h3 className="text-asphalt-500 text-[10px] sm:text-xs font-display tracking-speedway uppercase mb-1">
                      {label}
                    </h3>
                    <p className="font-display text-3xl sm:text-4xl tracking-wide text-asphalt-900 leading-none tabular-nums">
                      {format(stats[key])}
                    </p>
                  </div>
                ),
              )}
            </div>
            <div className="bg-white rounded-lg border border-asphalt-200 shadow-track p-4 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h2 className="font-display tracking-speedway uppercase text-lg text-asphalt-900">
                  Orders
                </h2>
                <div className="flex flex-col md:flex-row gap-3 flex-1 md:max-w-2xl">
                  <div className="relative flex-1">
                    <Icon
                      name="search"
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-asphalt-400"
                    />
                    <input
                      type="text"
                      aria-label="Search orders by order number"
                      placeholder="Search by order number…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border-2 border-asphalt-200 rounded-md transition-colors duration-base ease-snap focus:border-race-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    {["overview", "all"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-md font-display tracking-speedway uppercase text-xs whitespace-nowrap transition-colors duration-base ease-snap active:scale-95 ${
                          activeTab === tab
                            ? "bg-race-600 text-chalk shadow-race"
                            : "bg-asphalt-100 text-asphalt-600 hover:bg-asphalt-200"
                        }`}
                      >
                        {tab === "overview" ? "Recent" : "All"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {DATE_FILTERS.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setDateFilter(key)}
                    className={`px-3 py-1.5 rounded-md text-xs font-display tracking-speedway uppercase transition-colors duration-base ease-snap active:scale-95 ${
                      dateFilter === key
                        ? "bg-asphalt-800 text-chalk"
                        : "bg-asphalt-100 text-asphalt-600 hover:bg-asphalt-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {searchQuery && (
                <div className="mb-4 text-sm text-asphalt-600">
                  Found {displayOrders.length} order(s) matching "{searchQuery}"
                </div>
              )}
              {displayOrders.length === 0 ? (
                <div className="text-center py-8 text-asphalt-500">
                  {searchQuery
                    ? `No orders found matching "${searchQuery}"`
                    : "No orders yet"}
                </div>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          {[
                            "Order #",
                            "Customer",
                            "Items",
                            "Qty",
                            "Amount",
                            "Date",
                            "Status",
                            "Action",
                          ].map((header) => (
                            <th
                              key={header}
                              className="text-left py-4 px-4 text-sm font-semibold text-gray-600"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {displayOrders.map((order) => (
                          <tr
                            key={order.id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => toggleOrder(order.id)}
                          >
                            <td className="py-4 px-4">
                              <span className="font-mono text-sm font-semibold text-gray-800">
                                {order.order_number}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-sm text-gray-700">
                                {order.customer_email || "N/A"}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-sm text-gray-700">
                                {order.items?.length || 0} item(s)
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-sm font-semibold text-gray-800">
                                {order.total_quantity} people
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-sm font-bold text-green-600">
                                {formatCents(order.total_amount)}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-xs text-gray-500">
                                {formatShortDateTime(order.created_at)}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <StatusBadge status={order.status} />
                            </td>
                            <td className="py-4 px-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/purchase/${order.id}`);
                                }}
                                className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center gap-1 transition-colors duration-200 ease-out"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Mobile cards */}
                  <div className="lg:hidden space-y-3">
                    {displayOrders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() => toggleOrder(order.id)}
                          className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-sm font-bold text-gray-800">
                              {order.order_number}
                            </span>
                            <StatusBadge status={order.status} />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-bold text-green-600">
                                {formatCents(order.total_amount)}
                              </span>
                              <span className="text-sm text-gray-500">
                                {order.total_quantity} people
                              </span>
                            </div>
                            <ChevronDown
                              className={`h-5 w-5 text-gray-400 transition-transform duration-200 ease-out ${
                                expandedOrder === order.id ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatShortDateTime(order.created_at)}
                          </p>
                        </button>
                        {expandedOrder === order.id && (
                          <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span>{order.customer_email || "N/A"}</span>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                Items
                              </h4>
                              <div className="space-y-2">
                                {order.items?.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between items-center bg-white rounded-lg p-3 border border-gray-100"
                                  >
                                    <div>
                                      <p className="font-medium text-gray-800 text-sm">
                                        {item.product_name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {item.quantity} x{" "}
                                        {formatCents(item.price)}
                                      </p>
                                    </div>
                                    <span className="font-bold text-gray-800 text-sm">
                                      {formatCents(item.subtotal)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="flex justify-between items-center bg-white rounded-lg p-3 border-2 border-gray-200">
                              <div>
                                <p className="font-bold text-gray-800">Total</p>
                                <p className="text-xs text-gray-500">
                                  {order.total_quantity}{" "}
                                  {order.total_quantity > 1
                                    ? "people"
                                    : "person"}
                                </p>
                              </div>
                              <span className="text-xl font-black text-red-600">
                                {formatCents(order.total_amount)}
                              </span>
                            </div>
                            <button
                              onClick={() => navigate(`/purchase/${order.id}`)}
                              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 ease-out active:scale-95 flex items-center justify-center gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              Full Order Details
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
