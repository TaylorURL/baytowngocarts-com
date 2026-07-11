import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/common/Header.jsx";
import Footer from "../components/common/Footer.jsx";
import ClickSpark from "../components/reactbits/ClickSpark.jsx";
import { useTrafficLogger } from "../hooks/useTraffic";
/**
 * Root layout wrapping all pages with the site header, footer, and traffic logging.
 */
const MainLayout = () => {
  const location = useLocation();
  useTrafficLogger(location.pathname);
  return (
    <ClickSpark
      overlay
      sparkColor="#e11d2a"
      sparkCount={10}
      sparkSize={11}
      sparkRadius={20}
      duration={500}
    >
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ClickSpark>
  );
};
export default MainLayout;
