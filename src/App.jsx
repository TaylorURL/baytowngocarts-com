import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Routes.jsx";
import ScrollToTop from "./components/common/ScrollToTop.jsx";
import { ToastProvider } from "./components/common/Toast.jsx";

export default function App() {
  return (
    <Router>
      <ToastProvider>
        <ScrollToTop />
        <Routes />
      </ToastProvider>
    </Router>
  );
}
