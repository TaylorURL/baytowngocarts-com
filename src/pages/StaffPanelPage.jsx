import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  DollarSign,
  Eye,
  Mail,
  Search,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useAdmin } from "../hooks/useAdmin";
import { supabase } from "../lib/supabase";

const STAT_CARDS = [
  {
    key: "totalOrders",
    label: "Total Orders",
    icon: ShoppingBag,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    trailingIcon: TrendingUp,
    trailingColor: "text-green-500",
    format: (v) => v,
  },
  {
    key: "totalRevenue",
    label: "Total Revenue",
    icon: DollarSign,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    trailingIcon: TrendingUp,
    trailingColor: "text-green-500",
    format: (v) => `$${v.toFixed(2)}`,
  },
  {
    key: "todayOrders",
    label: "Today's Orders",
    icon: Calendar,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    trailingIcon: Clock,
    trailingColor: "text-blue-500",
    format: (v) => v,
  },
  {
    key: "todayRevenue",
    label: "Today's Revenue",
    icon: DollarSign,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    trailingIcon: Clock,
    trailingColor: "text-blue-500",
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

const STATUS_CONFIG = {
  completed: { className: "bg-green-100 text-green-700", icon: CheckCircle },
  pending: { className: "bg-yellow-100 text-yellow-700", icon: Clock },
};

const DEFAULT_STATUS = {
  className: "bg-red-100 text-red-700",
  icon: AlertCircle,
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? DEFAULT_STATUS;
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${config.className}`}
    >
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

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

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatCurrency = (cents) => `$${(cents / 100).toFixed(2)}`;

/**
 * Renders the staff-only admin panel with order stats, search, filtering, and order details.
 * Redirects non-staff users to the home page.
 */
export default function StaffPanelPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
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
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-red-900 to-navy-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Staff Panel...</p>
        </div>
      </div>
    );
  }

  if (!isStaff) return null;

  return (
    <div className="w-full -mt-20">
      <section className="relative bg-navy-900 overflow-hidden pt-32 pb-20 min-h-[70vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-cover bg-center opacity-30 bg-[url('/images/22.JPEG')]" />
        </div>

        <div className="absolute inset-0 z-5 opacity-10 [background-image:linear-gradient(45deg,var(--color-black)_25%,transparent_25%),linear-gradient(-45deg,var(--color-black)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,var(--color-black)_75%),linear-gradient(-45deg,transparent_75%,var(--color-black)_75%)] [background-size:20px_20px] [background-position:0_0,0_10px,10px_-10px,-10px_0px]" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <div className="inline-block mb-6 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-bold tracking-wider">
              ADMIN
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              Staff <span className="text-red-500">Panel</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Track Operations & Order Management
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white [clip-path:polygon(0_100%,100%_0,100%_100%,0%_100%)]" />
      </section>

      <section className="py-12 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
              {STAT_CARDS.map(
                ({
                  key,
                  label,
                  icon: Icon,
                  iconBg,
                  iconColor,
                  trailingIcon: TrailingIcon,
                  trailingColor,
                  format,
                }) => (
                  <div
                    key={key}
                    className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-4 sm:p-6"
                  >
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className={`p-2 sm:p-3 ${iconBg} rounded-lg`}>
                        <Icon
                          className={`h-5 w-5 sm:h-6 sm:w-6 ${iconColor}`}
                        />
                      </div>
                      <TrailingIcon
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${trailingColor}`}
                      />
                    </div>
                    <h3 className="text-gray-600 text-xs sm:text-sm font-medium mb-1">
                      {label}
                    </h3>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                      {format(stats[key])}
                    </p>
                  </div>
                ),
              )}
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-4 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Orders
                </h2>
                <div className="flex flex-col md:flex-row gap-3 flex-1 md:max-w-2xl">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by order number..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                  <div className="flex gap-2">
                    {["overview", "all"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                          activeTab === tab
                            ? "bg-red-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      dateFilter === key
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {searchQuery && (
                <div className="mb-4 text-sm text-gray-600">
                  Found {displayOrders.length} order(s) matching "{searchQuery}"
                </div>
              )}

              {displayOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
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
                                {formatCurrency(order.total_amount)}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-xs text-gray-500">
                                {formatDate(order.created_at)}
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
                                className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center gap-1"
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
                                {formatCurrency(order.total_amount)}
                              </span>
                              <span className="text-sm text-gray-500">
                                {order.total_quantity} people
                              </span>
                            </div>
                            <ChevronDown
                              className={`h-5 w-5 text-gray-400 transition-transform ${
                                expandedOrder === order.id ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(order.created_at)}
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
                                        {formatCurrency(item.price)}
                                      </p>
                                    </div>
                                    <span className="font-bold text-gray-800 text-sm">
                                      {formatCurrency(item.subtotal)}
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
                                {formatCurrency(order.total_amount)}
                              </span>
                            </div>

                            <button
                              onClick={() => navigate(`/purchase/${order.id}`)}
                              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
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
