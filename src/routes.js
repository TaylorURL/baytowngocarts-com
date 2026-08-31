import { lazy } from "react";
import { withBuildRefresh } from "./lib/chunk-recovery.js";

/*
 * One route table, read by three things: the client router, the build-time
 * render, and the prerender step that decides which documents to write. A
 * route added here reaches all three; a route added to only one of them is the
 * bug this table exists to prevent.
 *
 * `load` is kept beside the component because a build-time render has to be
 * able to resolve a lazy route before it can render past the fallback.
 */
const page = (loader) => {
  const load = withBuildRefresh(loader);
  return { load, Component: lazy(load) };
};

/* The home page ships with the shell: it is where most arrivals land, and a
   split there costs a round trip before anything paints. */
export { default as HomePage } from "./pages/HomePage.jsx";

export const ROUTES = [
  {
    path: "about",
    prerender: "/about",
    ...page(() => import("./pages/AboutPage.jsx")),
  },
  {
    path: "pricing",
    prerender: "/pricing",
    ...page(() => import("./pages/PricingPage.jsx")),
  },
  {
    path: "events",
    prerender: "/events",
    ...page(() => import("./pages/EventsPage.jsx")),
  },
  {
    path: "contact",
    prerender: "/contact",
    ...page(() => import("./pages/ContactPage.jsx")),
  },
  {
    path: "faq",
    prerender: "/faq",
    ...page(() => import("./pages/FAQPage.jsx")),
  },
  {
    path: "privacy",
    prerender: "/privacy",
    ...page(() => import("./pages/PrivacyPage.jsx")),
  },
  {
    path: "terms",
    prerender: "/terms",
    ...page(() => import("./pages/TermsPage.jsx")),
  },
  { path: "dashboard", ...page(() => import("./pages/PurchasesPage.jsx")) },
  { path: "cart", ...page(() => import("./pages/CartPage.jsx")) },
  {
    path: "purchase/:orderId",
    ...page(() => import("./pages/PurchaseDetailsPage.jsx")),
  },
  { path: "staff", ...page(() => import("./pages/StaffPanelPage.jsx")) },
  { path: "traffic", ...page(() => import("./pages/TrafficPage.jsx")) },
  { path: "*", ...page(() => import("./pages/NotFoundPage.jsx")) },
];

/* These three render outside the site chrome, so they sit beside the layout
   rather than inside it. */
export const BARE_ROUTES = [
  { path: "/login", ...page(() => import("./pages/LoginPage.jsx")) },
  { path: "/signup", ...page(() => import("./pages/SignupPage.jsx")) },
  { path: "/success", ...page(() => import("./pages/SuccessPage.jsx")) },
];

export const ALL_ROUTES = [...ROUTES, ...BARE_ROUTES];

/** The routes the build writes a document for: everything a crawler indexes. */
export const PRERENDER_PATHS = [
  "/",
  ...ROUTES.filter((r) => r.prerender).map((r) => r.prerender),
];

/*
 * The paths the host cannot answer from a prerendered file: account, checkout
 * and staff routes, which are rendered in the browser and kept out of the
 * index. Everything not listed here and not prerendered is a real miss.
 */
export const CLIENT_ONLY_PATHS = [
  "/cart",
  "/dashboard",
  "/staff",
  "/traffic",
  "/login",
  "/signup",
  "/success",
  "/purchase/:orderId",
];
