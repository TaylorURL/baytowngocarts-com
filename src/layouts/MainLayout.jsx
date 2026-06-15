import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/common/Header.jsx";
import Footer from "../components/common/Footer.jsx";
import { useTrafficLogger } from "../hooks/useTraffic";
/**
 * Root layout wrapping all pages with the site header, footer, and traffic logging.
 */
const MainLayout = () => {
  const location = useLocation();
  useTrafficLogger(location.pathname);
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
export default MainLayout;
