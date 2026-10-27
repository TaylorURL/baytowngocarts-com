import { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Routes.jsx";
import ScrollToTop from "./components/shell/ScrollToTop.jsx";
import { ToastProvider } from "./components/shell/Toast.jsx";
import { useCart } from "./hooks/useCart.js";

export default function App() {
  // After the first commit, so the render that attaches to a prerendered page
  // sees the same empty cart its header was built with.
  useEffect(() => {
    useCart.persist.rehydrate();
  }, []);

  return (
    <Router>
      <ToastProvider>
        <ScrollToTop />
        <Routes />
      </ToastProvider>
    </Router>
  );
}
