import { useEffect } from "react";
import { supabaseClient } from "../lib/supabase";
import { midnightOn, partsAt } from "../lib/timezone.js";
/** How long a page view waits on geo enrichment before writing without it. */
const GEO_LOOKUP_TIMEOUT_MS = 2000;
/**
 * City and country are enrichment on a record that has to be written either
 * way, so the lookup runs under a deadline rather than holding the write open
 * for as long as ipapi.co takes to answer. A page view still sitting behind a
 * slow lookup when the visitor leaves is never written at all.
 *
 * @returns {Promise<object|null>} ipapi.co payload, or null if it did not arrive in time
 */
const readGeoData = () =>
  Promise.race([
    fetch("https://ipapi.co/json/")
      .then((response) => (response.ok ? response.json() : null))
      .catch(() => null),
    new Promise((resolve) => {
      setTimeout(resolve, GEO_LOOKUP_TIMEOUT_MS, null);
    }),
  ]);
/**
 * Staff-only routes are skipped so internal browsing never shows up in the
 * customer traffic numbers.
 *
 * The write goes out as a keepalive request rather than through the Supabase
 * client the rest of this file uses. A page view is recorded at the moment a
 * visitor is most likely to navigate away, and an ordinary request is cancelled
 * when its page goes, so the shortest visits are the ones that go unrecorded.
 *
 * @param {string} pathname - route path to log
 */
export const logPageView = async (pathname) => {
  if (
    pathname === "/traffic" ||
    pathname === "/staff" ||
    pathname.startsWith("/purchase")
  ) {
    return;
  }
  const geoData = await readGeoData();
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/site_traffic`,
      {
        method: "POST",
        keepalive: true,
        headers: {
          "Content-Type": "application/json",
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          page_path: pathname,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
          screen_width: window.screen.width,
          screen_height: window.screen.height,
          city: geoData?.city || null,
          region: geoData?.region || null,
          country: geoData?.country_name || null,
          country_code: geoData?.country_code || null,
          latitude: geoData?.latitude || null,
          longitude: geoData?.longitude || null,
          timestamp: new Date().toISOString(),
        }),
      },
    );
    if (!response.ok) {
      console.error(`Page view write rejected: HTTP ${response.status}`);
    }
  } catch {
    // A request that never reached the network is lost telemetry rather than a
    // fault anyone can act on, and the reporter installed in index.html already
    // records it once. Raising it again here would only duplicate that.
  }
};
/**
 * Records one page view per route the visitor lands on.
 *
 * Keyed on the path, so a router that re-renders without navigating does not
 * log twice, and a return to a path already seen this session logs again -
 * which is what a page view means.
 *
 * @param {string} pathname - the route currently rendered
 */
export const useTrafficLogger = (pathname) => {
  useEffect(() => {
    logPageView(pathname);
  }, [pathname]);
};
/**
 * @param {string} timeRange - "today" | "week" | "month" | "quarter" | "year"
 * @returns {Promise<Array>} traffic records, staff-only pages excluded
 */
export const getTrafficStats = async (timeRange = "today") => {
  try {
    let startDate;
    // Every boundary is the track's, so a range reads the same from the office
    // and from a phone in another state.
    const { year, month, day } = partsAt(new Date());
    switch (timeRange) {
      case "week":
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = midnightOn(year, month, 1);
        break;
      case "quarter":
        startDate = midnightOn(year, Math.floor((month - 1) / 3) * 3 + 1, 1);
        break;
      case "year":
        startDate = midnightOn(year, 1, 1);
        break;
      case "today":
      default:
        startDate = midnightOn(year, month, day);
    }
    const { data, error } = await (
      await supabaseClient()
    )
      .from("site_traffic")
      .select("*")
      .gte("timestamp", startDate.toISOString())
      .neq("page_path", "/traffic")
      .neq("page_path", "/staff")
      .not("page_path", "like", "/purchase%")
      .order("timestamp", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching traffic stats:", error);
    return [];
  }
};
