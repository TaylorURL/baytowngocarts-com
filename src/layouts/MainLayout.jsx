import { Suspense, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/common/Header.jsx";
import Footer from "../components/common/Footer.jsx";
import SplitRail from "@taylorurl/split-rail";
import ClickSpark from "../components/reactbits/ClickSpark.jsx";
import RouteFallback from "../components/common/RouteFallback.jsx";
import { useTrafficLogger } from "../hooks/useTraffic";
const MainLayout = () => {
  const location = useLocation();
  useTrafficLogger(location.pathname);
  /*
   * A route reached by clicking arrives on the same entrance the rest of the
   * page uses. The document the visitor came in on is already painted, so it
   * is left alone rather than faded up from nothing.
   *
   * The switch is committed by an effect rather than mutated in render:
   * hydration replays this render against the prerendered document, and a
   * ref set on a discarded attempt would put the entrance class on the very
   * tree hydration is trying to reproduce.
   */
  const [arrived, setArrived] = useState(false);
  useEffect(() => {
    setArrived(true);
  }, []);
  const entrance = arrived ? "animate-fade-in" : "";
  return (
    <ClickSpark sparkCount={10} sparkSize={11} sparkRadius={20} duration={500}>
      <div className="min-h-dvh flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-overlay focus:rounded-md focus:bg-race-600 focus:px-4 focus:py-3 focus:font-display focus:tracking-speedway focus:uppercase focus:text-chalk"
        >
          Skip to Content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="flex-grow">
          <Suspense fallback={<RouteFallback />}>
            <div key={location.pathname} className={entrance}>
              <Outlet />
            </div>
          </Suspense>
        </main>
        <Footer>
          <SplitRail version={__BUILD_VERSION__} />
        </Footer>
      </div>
    </ClickSpark>
  );
};
export default MainLayout;
