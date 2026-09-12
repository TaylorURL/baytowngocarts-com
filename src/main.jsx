import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/fonts.css";
import "./styles/Theme.css";
import "./styles/index.css";
import ErrorBoundary from "./components/shell/ErrorBoundary.jsx";
import { startFontWeights } from "./lib/fonts.js";
import { startReveals } from "./lib/reveal.js";
import { PRERENDER_PATHS } from "./routes.js";
const root = document.getElementById("root");

/*
 * The one redraw the boundary is allowed to ask for. A document rewritten
 * underneath a mounted tree - a page translation, an injected script, a host
 * that edits the markup on the wire - leaves React holding nodes the document
 * no longer parents, and the commit that meets one throws. Nothing is wrong
 * with the page, so it is drawn again from an empty root, which is the same
 * recovery React 18 takes on a hydration mismatch of its own.
 *
 * Once, and never again: the thing doing the rewriting is usually still there,
 * and a tree that redraws every time it is touched is worse than the error
 * screen it is avoiding.
 */
let spent = false;
const redraw = () => {
  if (spent) return;
  spent = true;
  try {
    mounted?.unmount();
  } catch {
    // A root torn by the same mutation cannot always take itself down. The
    // container is emptied either way and the new root owns it from there.
  }
  root.textContent = "";
  createRoot(root).render(tree);
};

const tree = (
  <StrictMode>
    <ErrorBoundary onDetached={redraw}>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
let mounted = null;

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
  mounted = hydrateRoot(root, tree);
} else {
  if (root.firstChild) root.textContent = "";
  mounted = createRoot(root);
  mounted.render(tree);
}

startFontWeights();
startReveals();
