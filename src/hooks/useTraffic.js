import { useEffect } from "react";
import { supabaseClient } from "../lib/supabase";
import { whenSettled } from "../lib/idle.js";
import { midnightOn, partsAt } from "../lib/timezone.js";
/** How long a page view waits on geo enrichment before writing without it. */
const GEO_LOOKUP_TIMEOUT_MS = 2000;
/* A crawler's rendered visit is not the traffic this file exists to count, and
   the environments they render in cancel outgoing requests on their own
   schedule - a fetch dropped that way lands in the reporter as a supabase
   network failure for a record no reader would have wanted. Both the pollution
   of site_traffic and the noise on the ticket queue disappear at the same time
   by not writing the record in the first place. */
const CRAWLER_UA =
  /bot\b|crawler|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegrambot|discordbot|linkedinbot|petalbot|semrushbot|ahrefsbot|mj12bot|baiduspider|applebot|yandex|duckduckbot|chatgpt|perplexity|claudebot|gptbot|amazonbot|meta-externalagent|headlesschrome/i;
const isCrawler = () => {
  try {
    return CRAWLER_UA.test(navigator.userAgent || "");
  } catch {
    return false;
  }
};
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
 * `keepalive` is what lets the browser carry it to completion after the
 * document is gone, and it only does that for a request already handed over:
 * one still being assembled when the tab closes is torn down with everything
 * else. So the caller issues this before the page goes rather than racing it.
 *
 * `view` carries the one record between the two callers that can reach it, so
 * a visitor who leaves while the enrichment is still out is written once and
 * not twice.
 *
 * @param {string} pathname - route path to log
 * @param {{written: boolean}} view - the record's state, shared by both callers
 * @param {boolean} enrich - whether to wait on the geo lookup before writing
 */
export const logPageView = async (
  pathname,
  view = { written: false },
  enrich = true,
) => {
  if (
    pathname === "/traffic" ||
    pathname === "/staff" ||
    pathname.startsWith("/purchase")
  ) {
    return;
  }
  if (isCrawler()) return;
  if (view.written) return;
  /* A visitor on their way out is not kept waiting on an origin this site does
     not serve. The record is worth more without a city on it than it is
     unwritten. */
  const geoData = enrich ? await readGeoData() : null;
  if (view.written) return;
  view.written = true;
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
    // A page view lost because the reader left is not a fault anyone can act
    // on: the visit ended, and the record it would have written describes a
    // visit nobody is waiting to read about. It is swallowed here rather than
    // raised, and the request is issued before the page goes so the browser
    // has something to carry rather than something to cancel.
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
    /* The view is written once the page has arrived. The geo lookup opens a
       connection to an origin the site does not serve, and an origin's first
       request costs a DNS answer, a handshake and a certificate before a byte
       of it moves - all of it on the connection the photograph the page is
       measured on is still coming down. Nothing about the record changes for
       waiting. */
    const view = { written: false };
    const waiting = whenSettled(() => logPageView(pathname, view));
    /* A reader who leaves inside that wait is written on the way out instead,
       without the enrichment, because a request handed to the browser before
       the document goes is one `keepalive` carries to completion and a request
       still being assembled as the tab closes is one the teardown cancels. The
       shortest visits are the ones this exists to catch. */
    const leaving = () => logPageView(pathname, view, false);
    window.addEventListener("pagehide", leaving);
    return () => {
      waiting();
      window.removeEventListener("pagehide", leaving);
    };
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
