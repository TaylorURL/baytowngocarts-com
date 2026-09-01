import { Suspense, useRef } from "react";
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
   * Which one this is is read off the path rather than off the mount, because
   * the layout mounts on both: an entrance owed to a click, granted the moment
   * the layout attaches, takes the whole arrival back to nothing and fades it
   * up again.
   *
   * The path the document landed on is fixed at the first render and never
   * written to, so a render hydration discards and replays lands on the same
   * answer. What is written is only ever written once the path has moved off
   * it, which the render hydration replays cannot have done, and it stays
   * written so that coming back around to where the visit started is a click
   * like any other.
   */
  const landed = useRef(location.pathname);
  const clicked = useRef(false);
  if (location.pathname !== landed.current) clicked.current = true;
  const entrance = clicked.current ? "animate-fade-in" : "";
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
          <SplitRail version={__BUILD_VERSION__} year={__BUILD_YEAR__} />
        </Footer>
      </div>
    </ClickSpark>
  );
};
export default MainLayout;
