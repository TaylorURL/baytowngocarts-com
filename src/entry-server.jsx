import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import Routes from "./Routes.jsx";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";
import ScrollToTop from "./components/common/ScrollToTop.jsx";
import { ToastProvider } from "./components/common/Toast.jsx";
import { ALL_ROUTES } from "./routes.js";
import { takeHead } from "./lib/content/head-sink.js";

/**
 * Renders one route to markup and head at build time.
 *
 * The tree here is the tree `main.jsx` attaches to it, component for component
 * and sibling for sibling, down to the pieces that draw nothing. `useId` reads
 * a component's position in the tree, so a boundary or a null-rendering
 * sibling standing on one side and not the other hands the same element two
 * different ids; React finds them disagreeing, gives up on the markup it was
 * attaching to and draws the whole page again from an empty root. Every
 * component `main.jsx` and `App.jsx` put above the routes belongs here, in the
 * same order.
 *
 * React.lazy resolves asynchronously, so a first pass only reaches each
 * boundary's fallback. That pass is what starts the imports; awaiting them and
 * rendering again reaches the real page, since a resolved lazy renders
 * synchronously from then on.
 *
 * @returns {Promise<{html: string, head: object|null}>}
 */
export async function render(url) {
  const element = (
    <StrictMode>
      <ErrorBoundary>
        <StaticRouter location={url}>
          <ToastProvider>
            <ScrollToTop />
            <Routes />
          </ToastProvider>
        </StaticRouter>
      </ErrorBoundary>
    </StrictMode>
  );
  renderToString(element);
  await Promise.all(ALL_ROUTES.map((route) => route.load()));
  // The first pass only reached the fallbacks, so whatever head it recorded
  // belongs to no page. Drain it before the real render writes its own.
  takeHead();
  const html = renderToString(element);
  return { html, head: takeHead() };
}

export { PRERENDER_PATHS } from "./routes.js";
