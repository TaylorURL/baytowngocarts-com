import React, { useEffect, useState } from "react";
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
  Shield,
  ShoppingBag,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useAdmin } from "../hooks/useAdmin";
import { supabase } from "../lib/supabase";

export default function StaffPanelPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isStaff, loading: staffLoading } = useAdmin();
  const [activeTab, setActiveTab] = useState("overview");
  const [dateFilter, setDateFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    todayRevenue: 0,
  });
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

      let totalRevenue = 0;
      let todayOrdersCount = 0;
      let todayRevenue = 0;

      if (revenueData) {
        totalRevenue =
          revenueData.reduce((sum, order) => sum + order.total_amount, 0) / 100;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayOrders = revenueData.filter(
          (order) => new Date(order.created_at) >= today,
        );

        todayOrdersCount = todayOrders.length;
        todayRevenue =
          todayOrders.reduce((sum, order) => sum + order.total_amount, 0) / 100;
      }

      setStats({
        totalOrders: totalOrders || 0,
        totalRevenue,
        todayOrders: todayOrdersCount,
        todayRevenue,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats({
        totalOrders: 0,
        totalRevenue: 0,
        todayOrders: 0,
        todayRevenue: 0,
      });
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
    } catch (error) {
      console.error("Error fetching recent orders:", error);
      setAllOrders([]);
      setRecentOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (cents) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getDateFilteredOrders = (orders) => {
    if (dateFilter === "all") return orders;

    const now = new Date();
    let startDate;

    switch (dateFilter) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "week":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "quarter":
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        return orders;
    }

    return orders.filter((order) => new Date(order.created_at) >= startDate);
  };

  const filteredOrders = searchQuery.trim()
    ? allOrders.filter((order) =>
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : recentOrders;

  const dateFilteredOrders = getDateFilteredOrders(
    activeTab === "all" ? allOrders : filteredOrders,
  );
  const displayOrders = dateFilteredOrders;

  function StatusBadge({ status }) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
          status === "completed"
            ? "bg-green-100 text-green-700"
            : status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
        }`}
      >
        {status === "completed" ? (
          <CheckCircle className="h-3 w-3" />
        ) : status === "pending" ? (
          <Clock className="h-3 w-3" />
        ) : (
          <AlertCircle className="h-3 w-3" />
        )}
        {status}
      </span>
    );
  }

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

  if (!isStaff) {
    return null;
  }

  return (
    <div className="w-full -mt-20">
      <section className="relative bg-navy-900 overflow-hidden pt-32 pb-12">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: "url(/images/22.JPEG)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-navy-900/90 via-red-900/80 to-navy-900/90" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="h-12 w-12 text-red-500" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Staff Panel
              </h1>
            </div>
            <p className="text-xl text-gray-300">
              Track Operations & Order Management
            </p>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-16 bg-white"
          style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%, 0% 100%)" }}
        />
      </section>

      <section className="py-12 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 bg-red-100 rounded-lg">
                    <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                  </div>
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                </div>
                <h3 className="text-gray-600 text-xs sm:text-sm font-medium mb-1">
                  Total Orders
                </h3>
                <p className="text-2xl sm:text-3xl font-bold text-navy-900">
                  {stats.totalOrders}
                </p>
              </div>

              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                    <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                </div>
                <h3 className="text-gray-600 text-xs sm:text-sm font-medium mb-1">
                  Total Revenue
                </h3>
                <p className="text-2xl sm:text-3xl font-bold text-navy-900">
                  ${stats.totalRevenue.toFixed(2)}
                </p>
              </div>

              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                </div>
                <h3 className="text-gray-600 text-xs sm:text-sm font-medium mb-1">
                  Today's Orders
                </h3>
                <p className="text-2xl sm:text-3xl font-bold text-navy-900">
                  {stats.todayOrders}
                </p>
              </div>

              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg">
                    <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                  </div>
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                </div>
                <h3 className="text-gray-600 text-xs sm:text-sm font-medium mb-1">
                  Today's Revenue
                </h3>
                <p className="text-2xl sm:text-3xl font-bold text-navy-900">
                  ${stats.todayRevenue.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-4 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-navy-900">
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
                    <button
                      onClick={() => setActiveTab("overview")}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                        activeTab === "overview"
                          ? "bg-red-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Recent
                    </button>
                    <button
                      onClick={() => setActiveTab("all")}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                        activeTab === "all"
                          ? "bg-red-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      All
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setDateFilter("today")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    dateFilter === "today"
                      ? "bg-navy-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setDateFilter("week")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    dateFilter === "week"
                      ? "bg-navy-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => setDateFilter("month")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    dateFilter === "month"
                      ? "bg-navy-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  This Month
                </button>
                <button
                  onClick={() => setDateFilter("quarter")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    dateFilter === "quarter"
                      ? "bg-navy-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  This Quarter
                </button>
                <button
                  onClick={() => setDateFilter("year")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    dateFilter === "year"
                      ? "bg-navy-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  This Year
                </button>
                <button
                  onClick={() => setDateFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    dateFilter === "all"
                      ? "bg-navy-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All Time
                </button>
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
                          <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">
                            Order #
                          </th>
                          <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">
                            Customer
                          </th>
                          <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">
                            Items
                          </th>
                          <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">
                            Qty
                          </th>
                          <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">
                            Amount
                          </th>
                          <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">
                            Date
                          </th>
                          <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">
                            Status
                          </th>
                          <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayOrders.map((order) => (
                          <tr
                            key={order.id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() =>
                              setExpandedOrder(
                                expandedOrder === order.id ? null : order.id,
                              )
                            }
                          >
                            <td className="py-4 px-4">
                              <span className="font-mono text-sm font-semibold text-navy-900">
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
                              <span className="text-sm font-semibold text-navy-900">
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
                          onClick={() =>
                            setExpandedOrder(
                              expandedOrder === order.id ? null : order.id,
                            )
                          }
                          className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-sm font-bold text-navy-900">
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
                                      <p className="font-medium text-navy-900 text-sm">
                                        {item.product_name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {item.quantity} x{" "}
                                        {formatCurrency(item.price)}
                                      </p>
                                    </div>
                                    <span className="font-bold text-navy-900 text-sm">
                                      {formatCurrency(item.subtotal)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex justify-between items-center bg-white rounded-lg p-3 border-2 border-gray-200">
                              <div>
                                <p className="font-bold text-navy-900">Total</p>
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
