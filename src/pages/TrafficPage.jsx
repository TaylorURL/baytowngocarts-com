import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Clock,
  Globe,
  MapPin,
  Monitor,
  MousePointer,
  TrendingUp,
  Users,
} from "lucide-react";
import { useAdmin } from "../hooks/useAdmin";
import { getTrafficStats } from "../hooks/useTraffic";
const COLOR_CLASSES = {
  red: { bg: "bg-red-100", text: "text-red-600" },
  blue: { bg: "bg-blue-100", text: "text-blue-600" },
  green: { bg: "bg-green-100", text: "text-green-600" },
  purple: { bg: "bg-purple-100", text: "text-purple-600" },
};
const STAT_CARDS = [
  { key: "totalViews", label: "Total Views", icon: Users, color: "red" },
  { key: "desktop", label: "Desktop", icon: Monitor, color: "blue" },
  { key: "mobile", label: "Mobile", icon: Activity, color: "green" },
  {
    key: "uniquePages",
    label: "Unique Pages",
    icon: BarChart3,
    color: "purple",
  },
];
const TIME_RANGES = ["today", "week", "month", "quarter", "year"];
/** Classifies a user agent string as "Mobile", "Tablet", or "Desktop". */
const getDeviceType = (userAgent) => {
  const ua = (userAgent || "").toLowerCase();
  if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone"))
    return "Mobile";
  if (ua.includes("ipad") || ua.includes("tablet")) return "Tablet";
  return "Desktop";
};
const DEVICE_BADGE_COLORS = {
  Mobile: "bg-green-100 text-green-700",
  Tablet: "bg-purple-100 text-purple-700",
  Desktop: "bg-blue-100 text-blue-700",
};
/** Extracts referrer hostname from a URL, falling back to "Direct". */
const parseSource = (referrer) => {
  if (!referrer) return "Direct";
  try {
    return new URL(referrer).hostname;
  } catch {
    return referrer;
  }
};
/** Counts occurrences of a key extractor across traffic entries, returns sorted top N. */
const countByKey = (traffic, keyFn, limit = 10) => {
  const counts = {};
  traffic.forEach((view) => {
    const key = keyFn(view);
    if (key) counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
};
/** Reusable numbered list with progress bars. */
const RankedList = ({
  icon: Icon,
  title,
  entries,
  total,
  barColor,
  emptyText,
}) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
      <Icon className="h-5 w-5 text-red-600" />
      {title}
    </h3>
    {entries.length > 0 ? (
      <div className="space-y-3">
        {entries.map(([label, count], idx) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-400 w-6">
                {idx + 1}
              </span>
              <span className="text-gray-700 font-medium truncate max-w-[200px]">
                {label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div
                  className={`${barColor} h-2 rounded-full`}
                  style={{ width: `${(count / total) * 100}%` }}
                />
              </div>
              <span className="text-sm font-bold text-gray-800 w-12 text-right">
                {count}
              </span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 text-center py-4">{emptyText}</p>
    )}
  </div>
);
/** Stat card with icon, label, and value. */
const StatCard = ({ icon: Icon, label, value, color }) => {
  const colors = COLOR_CLASSES[color] || COLOR_CLASSES.red;
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
      <div className="flex items-center gap-4">
        <div className={`${colors.bg} p-3 rounded-xl`}>
          <Icon className={`h-6 w-6 ${colors.text}`} />
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="font-display text-4xl tracking-wide text-gray-900 leading-none">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};
/**
 * Renders a staff-only analytics dashboard showing page views, device breakdown,
 * traffic sources, hourly activity, and visitor locations.
 */
export default function TrafficPage() {
  const navigate = useNavigate();
  const { isStaff, loading: staffLoading } = useAdmin();
  const [traffic, setTraffic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("today");
  useEffect(() => {
    if (!staffLoading && !isStaff) navigate("/");
  }, [isStaff, staffLoading, navigate]);
  useEffect(() => {
    const fetchTraffic = async () => {
      setLoading(true);
      setTraffic(await getTrafficStats(timeRange));
      setLoading(false);
    };
    fetchTraffic();
  }, [timeRange]);
  const pageViews = useMemo(
    () => countByKey(traffic, (v) => v.page_path || "Unknown"),
    [traffic],
  );
  const devices = useMemo(() => {
    const counts = { mobile: 0, desktop: 0, tablet: 0 };
    traffic.forEach((v) => {
      counts[getDeviceType(v.user_agent).toLowerCase()]++;
    });
    return counts;
  }, [traffic]);
  const referrers = useMemo(
    () => countByKey(traffic, (v) => parseSource(v.referrer), 5),
    [traffic],
  );
  const hourlyData = useMemo(() => {
    const hours = Array(24).fill(0);
    traffic.forEach((v) => {
      hours[new Date(v.timestamp).getHours()]++;
    });
    return hours;
  }, [traffic]);
  const locationData = useMemo(
    () => ({
      cities: countByKey(traffic, (v) =>
        v.city && v.region ? `${v.city}, ${v.region}` : null,
      ),
      countries: countByKey(traffic, (v) => v.country || null),
    }),
    [traffic],
  );
  const maxHourly = Math.max(...hourlyData, 1);
  const statValues = {
    totalViews: traffic.length,
    desktop: devices.desktop,
    mobile: devices.mobile,
    uniquePages: pageViews.length,
  };
  if (staffLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-red-900 to-navy-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }
  if (!isStaff) return null;
  return (
    <div className="w-full -mt-20">
      <section className="relative bg-navy-900 overflow-hidden pt-32 pb-12">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-navy-900" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors duration-200 ease-out"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-block mb-4 px-3 py-1 bg-red-600 text-white rounded-full text-sm font-display tracking-widest">
                ANALYTICS
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                Site Traffic
              </h1>
              <p className="text-gray-300">
                Monitor visitor activity and page performance
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {TIME_RANGES.map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors duration-200 ease-out active:scale-95 ${
                    timeRange === range
                      ? "bg-red-600 text-white shadow-red"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="py-8 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto" />
              <p className="mt-4 text-gray-600">Loading traffic data...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {STAT_CARDS.map((card) => (
                  <StatCard
                    key={card.key}
                    {...card}
                    value={statValues[card.key]}
                  />
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <RankedList
                  icon={MousePointer}
                  title="Top Pages"
                  entries={pageViews}
                  total={traffic.length}
                  barColor="bg-red-600"
                  emptyText="No page views recorded"
                />
                <RankedList
                  icon={Globe}
                  title="Traffic Sources"
                  entries={referrers}
                  total={traffic.length}
                  barColor="bg-blue-600"
                  emptyText="No referrer data"
                />
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-red-600" />
                  Traffic by Hour
                </h3>
                <div className="flex items-end gap-1 h-40">
                  {hourlyData.map((count, hour) => (
                    <div
                      key={hour}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div
                        className="w-full bg-red-600 rounded-t transition-[height,background-color] duration-300 ease-out hover:bg-red-500"
                        style={{
                          height: `${(count / maxHourly) * 100}%`,
                          minHeight: count > 0 ? "4px" : "0",
                        }}
                        title={`${hour}:00 - ${count} views`}
                      />
                      {hour % 3 === 0 && (
                        <span className="text-xs text-gray-500 mt-1">
                          {hour}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <RankedList
                  icon={MapPin}
                  title="Top Cities"
                  entries={locationData.cities}
                  total={traffic.length}
                  barColor="bg-green-600"
                  emptyText="No location data available"
                />
                <RankedList
                  icon={Globe}
                  title="Top Countries"
                  entries={locationData.countries}
                  total={traffic.length}
                  barColor="bg-purple-600"
                  emptyText="No location data available"
                />
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-red-600" />
                  Recent Activity
                </h3>
                <div className="overflow-y-auto max-h-[400px]">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-white">
                      <tr className="border-b-2 border-gray-200">
                        {["Time", "Page", "Device", "Source"].map((h) => (
                          <th
                            key={h}
                            className="text-left py-3 px-4 text-sm font-bold text-gray-600"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {traffic.slice(0, 20).map((view, idx) => {
                        const device = getDeviceType(view.user_agent);
                        return (
                          <tr
                            key={idx}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 ease-out"
                          >
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {new Date(view.timestamp).toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-sm font-medium text-gray-800">
                              {view.page_path}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`text-xs px-2 py-1 rounded-full font-bold ${DEVICE_BADGE_COLORS[device]}`}
                              >
                                {device}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600 truncate max-w-[150px]">
                              {parseSource(view.referrer)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {traffic.length === 0 && (
                    <p className="text-gray-500 text-center py-8">
                      No traffic recorded for this period
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
