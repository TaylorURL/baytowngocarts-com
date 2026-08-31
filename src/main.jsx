import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/fonts.css";
import "./styles/Theme.css";
import "./index.css";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";
import { startReveals } from "./lib/reveal.js";
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
 */
if (root.firstChild) {
  hydrateRoot(root, tree);
} else {
  createRoot(root).render(tree);
}

startReveals();
