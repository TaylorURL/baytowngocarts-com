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
 */
const currentPath = location.pathname.replace(/\/+$/, "") || "/";
const isPrerendered = PRERENDER_PATHS.includes(currentPath);
if (isPrerendered && root.firstChild) {
  hydrateRoot(root, tree);
} else {
  if (root.firstChild) root.textContent = "";
  createRoot(root).render(tree);
}

startReveals();
