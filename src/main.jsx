import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/Theme.css";
import "./index.css";
import AOS from "aos";
import "aos/dist/aos.css";
import ErrorReporterUtility, {
  ErrorBoundary,
} from "./lib/ErrorReporterUtility";
ErrorReporterUtility.init({
  project: "baytowngocarts.com",
  apiKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
});
AOS.init({
  duration: 800,
  easing: "ease-out-cubic",
  once: true,
  offset: 100,
});
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
