import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/fonts.css";
import "./styles/Theme.css";
import "./index.css";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";
import { startReveals } from "./lib/reveal.js";
import { PRERENDER_PATHS } from "./routes.js";
const root = document.getElementById("root");
const tree = (
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);

/*
 * The build writes each indexed route's markup into its own document, so on
 * those the tree is already on screen and this attaches to it. Anything the
 * build did not prerender arrives as an empty root and is rendered here.
 *
 * A client-only route mis-served the wrong prerendered document (a stray
 * trailing slash slipping past a rewrite) would leave root.firstChild truthy
 * against markup that has nothing to do with what React is about to draw, so
 * the branch is gated on the URL matching a prerendered path rather than on
 * whatever the DOM happens to hold.
 *
 * An in-app browser that evaluates its own script inside the document mutates
 * the tree before this file runs. React 18's hydration compares comment
 * fenceposts around every Suspense boundary, so a rewritten href or an
 * injected node between them tears reconciliation apart into a cascade of
 * #418, #422 and #425. On those user agents the prerendered markup is
 * discarded and the tree draws itself from an empty root, which the browser
 * paints on its own timeline without a hydration compare in the way.
 */
const currentPath = location.pathname.replace(/\/+$/, "") || "/";
const isPrerendered = PRERENDER_PATHS.includes(currentPath);
const ua = navigator.userAgent || "";
const rewritesMarkup = /\bFBAN\/|\bFBAV\/|\bFB_IAB\b|Instagram|Line\//.test(ua);
if (isPrerendered && root.firstChild && !rewritesMarkup) {
  hydrateRoot(root, tree);
} else {
  if (root.firstChild) root.textContent = "";
  createRoot(root).render(tree);
}

startReveals();
