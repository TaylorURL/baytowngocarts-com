import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import Routes from "./Routes.jsx";
import { ToastProvider } from "./components/common/Toast.jsx";
import { ALL_ROUTES } from "./routes.js";
import { takeHead } from "./lib/content/head-sink.js";

/**
 * Renders one route to markup and head at build time.
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
      <StaticRouter location={url}>
        <ToastProvider>
          <Routes />
        </ToastProvider>
      </StaticRouter>
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
