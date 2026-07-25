import { useEffect } from "react";
import { supabase } from "../lib/supabase";
/**
 * Staff-only routes are skipped so internal browsing never shows up in the
 * customer traffic numbers.
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
  try {
    const userAgent = navigator.userAgent;
    const referrer = document.referrer || null;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    let geoData = null;
    try {
      const geoResponse = await fetch("https://ipapi.co/json/");
      if (geoResponse.ok) {
        geoData = await geoResponse.json();
      }
    } catch (geoError) {
      console.error("Geolocation fetch failed:", geoError);
    }
    await supabase.from("site_traffic").insert({
      page_path: pathname,
      user_agent: userAgent,
      referrer: referrer,
      screen_width: screenWidth,
      screen_height: screenHeight,
      city: geoData?.city || null,
      region: geoData?.region || null,
      country: geoData?.country_name || null,
      country_code: geoData?.country_code || null,
      latitude: geoData?.latitude || null,
      longitude: geoData?.longitude || null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error logging page view:", error);
  }
};
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
    const now = new Date();
    switch (timeRange) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "quarter": {
        const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
        startDate = new Date(now.getFullYear(), quarterMonth, 1);
        break;
      }
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }
    const { data, error } = await supabase
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
