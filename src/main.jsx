import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/Theme.css";
import "./index.css";
import AOS from "aos";
import "aos/dist/aos.css";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";
import { SundayAnalyticsProvider } from "./lib/sunday-analyzer";
AOS.init({
  duration: 800,
  easing: "ease-out-cubic",
  once: true,
  offset: 100,
});
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SundayAnalyticsProvider siteKey="sa_cbe7f67d98394373c5c11cf6e7a8d0b6">
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </SundayAnalyticsProvider>
  </StrictMode>,
);
