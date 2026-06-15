import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../hooks/useAdmin";
import { getTrafficStats } from "../hooks/useTraffic";
import Icon from "../components/common/Icon.jsx";

const STAT_CARDS = [
  { key: "totalViews", label: "Page Views", icon: "users", accent: "race" },
  { key: "desktop", label: "Desktop", icon: "monitor", accent: "asphalt" },
  { key: "mobile", label: "Mobile", icon: "activity", accent: "ignite" },
  { key: "uniquePages", label: "Unique Pages", icon: "bar-chart", accent: "race" },
];

const ACCENT_CLASSES = {
  race: { bg: "bg-race-50", text: "text-race-600" },
  ignite: { bg: "bg-ignite-100", text: "text-ignite-600" },
  asphalt: { bg: "bg-asphalt-100", text: "text-asphalt-700" },
};

const TIME_RANGES = ["today", "week", "month", "quarter", "year"];

const getDeviceType = (userAgent) => {
  const ua = (userAgent || "").toLowerCase();
  if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone"))
    return "Mobile";
  if (ua.includes("ipad") || ua.includes("tablet")) return "Tablet";
  return "Desktop";
};

const DEVICE_BADGE_COLORS = {
  Mobile: "bg-green-100 text-green-700",
  Tablet: "bg-ignite-100 text-ignite-700",
  Desktop: "bg-asphalt-100 text-asphalt-700",
};

const parseSource = (referrer) => {
  if (!referrer) return "Direct";
  try {
    return new URL(referrer).hostname;
  } catch {
    return referrer;
  }
};

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

const RankedList = ({ icon, title, entries, total, barColor, emptyText }) => (
  <div className="bg-white rounded-lg p-6 shadow-track border border-asphalt-200">
    <h3 className="font-display tracking-speedway uppercase text-sm text-asphalt-900 mb-4 flex items-center gap-2">
      <Icon name={icon} className="h-4 w-4 text-race-600" />
      {title}
    </h3>
    {entries.length > 0 ? (
      <div className="space-y-3">
        {entries.map(([label, count], idx) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-sm font-bold text-asphalt-400 w-6 tabular-nums">
                {idx + 1}
              </span>
              <span className="text-asphalt-700 font-medium truncate max-w-[200px]">
                {label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 bg-asphalt-100 rounded-full h-2">
                <div
                  className={`${barColor} h-2 rounded-full`}
                  style={{ width: `${(count / total) * 100}%` }}
                />
              </div>
              <span className="text-sm font-bold text-asphalt-900 w-12 text-right tabular-nums">
                {count}
              </span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-asphalt-500 text-center py-4 text-sm">{emptyText}</p>
    )}
  </div>
);

const StatCard = ({ icon, label, value, accent }) => {
  const a = ACCENT_CLASSES[accent] || ACCENT_CLASSES.race;
  return (
    <div className="bg-white rounded-lg p-6 shadow-track border border-asphalt-200">
      <div className="flex items-center gap-4">
        <div className={`${a.bg} p-3 rounded-md`}>
          <Icon name={icon} className={`h-6 w-6 ${a.text}`} />
        </div>
        <div>
          <p className="text-[10px] font-display tracking-speedway uppercase text-asphalt-500">
            {label}
          </p>
          <p className="font-display text-4xl tracking-wide text-asphalt-900 leading-none tabular-nums">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

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
      <div className="min-h-screen bg-asphalt-900 flex items-center justify-center">
        <div className="text-chalk text-xl font-display tracking-speedway uppercase">
          Loading…
        </div>
      </div>
    );
  }

  if (!isStaff) return null;

  return (
    <div className="w-full -mt-20">
      <section className="relative bg-asphalt-900 overflow-hidden pt-32 pb-12">
        <div className="absolute inset-0 asphalt-grain opacity-60" aria-hidden="true" />
        <div className="absolute top-0 left-0 right-0 h-1.5 race-stripe" aria-hidden="true" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-300 hover:text-chalk mb-6 transition-colors duration-base ease-snap font-display tracking-speedway uppercase text-xs"
          >
            <Icon name="arrow-left" className="h-4 w-4" />
            Back
          </button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-block mb-4 px-3 py-1 bg-race-600 text-chalk rounded-full text-xs font-display tracking-speedway uppercase">
                Analytics
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-chalk mb-2">
                Site Traffic
              </h1>
              <p className="text-gray-400">
                Where visitors arrive from, how they navigate, and on what device.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {TIME_RANGES.map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-md font-display tracking-speedway uppercase text-xs transition-colors duration-base ease-snap active:scale-95 ${
                    timeRange === range
                      ? "bg-race-600 text-chalk shadow-race"
                      : "bg-asphalt-800 text-gray-300 hover:bg-asphalt-700"
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-asphalt-50 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-asphalt-200 border-t-race-600 mx-auto" />
              <p className="mt-4 text-asphalt-600">Loading traffic data…</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
                {STAT_CARDS.map((card) => (
                  <StatCard
                    key={card.key}
                    icon={card.icon}
                    label={card.label}
                    accent={card.accent}
                    value={statValues[card.key]}
                  />
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
                <RankedList
                  icon="pointer"
                  title="Top Pages"
                  entries={pageViews}
                  total={traffic.length}
                  barColor="bg-race-600"
                  emptyText="No page views recorded"
                />
                <RankedList
                  icon="globe"
                  title="Traffic Sources"
                  entries={referrers}
                  total={traffic.length}
                  barColor="bg-asphalt-700"
                  emptyText="No referrer data"
                />
              </div>
              <div className="bg-white rounded-lg p-6 shadow-track border border-asphalt-200 mb-8">
                <h3 className="font-display tracking-speedway uppercase text-sm text-asphalt-900 mb-4 flex items-center gap-2">
                  <Icon name="clock" className="h-4 w-4 text-race-600" />
                  Traffic by Hour
                </h3>
                <div className="flex items-end gap-1 h-40">
                  {hourlyData.map((count, hour) => (
                    <div
                      key={hour}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div
                        className="w-full bg-race-600 rounded-t transition-[height,background-color] duration-base ease-snap hover:bg-race-500"
                        style={{
                          height: `${(count / maxHourly) * 100}%`,
                          minHeight: count > 0 ? "4px" : "0",
                        }}
                        title={`${hour}:00 — ${count} views`}
                      />
                      {hour % 3 === 0 && (
                        <span className="text-xs text-asphalt-500 mt-1 tabular-nums">
                          {hour}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
                <RankedList
                  icon="map-pin"
                  title="Top Cities"
                  entries={locationData.cities}
                  total={traffic.length}
                  barColor="bg-green-600"
                  emptyText="No location data available"
                />
                <RankedList
                  icon="globe"
                  title="Top Countries"
                  entries={locationData.countries}
                  total={traffic.length}
                  barColor="bg-ignite-500"
                  emptyText="No location data available"
                />
              </div>
              <div className="bg-white rounded-lg p-6 shadow-track border border-asphalt-200">
                <h3 className="font-display tracking-speedway uppercase text-sm text-asphalt-900 mb-4 flex items-center gap-2">
                  <Icon name="trending-up" className="h-4 w-4 text-race-600" />
                  Recent Activity
                </h3>
                <div className="overflow-y-auto max-h-[400px]">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-white">
                      <tr className="border-b-2 border-asphalt-200">
                        {["Time", "Page", "Device", "Source"].map((h) => (
                          <th
                            key={h}
                            className="text-left py-3 px-4 text-[10px] font-display tracking-speedway uppercase text-asphalt-500"
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
                            className="border-b border-asphalt-100 hover:bg-asphalt-50 transition-colors duration-base ease-snap"
                          >
                            <td className="py-3 px-4 text-sm text-asphalt-600 tabular-nums">
                              {new Date(view.timestamp).toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-sm font-medium text-asphalt-800">
                              {view.page_path}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-display tracking-speedway uppercase ${DEVICE_BADGE_COLORS[device]}`}
                              >
                                {device}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-asphalt-600 truncate max-w-[150px]">
                              {parseSource(view.referrer)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {traffic.length === 0 && (
                    <p className="text-asphalt-500 text-center py-8">
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
