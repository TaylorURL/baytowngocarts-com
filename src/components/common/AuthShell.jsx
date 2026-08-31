import { Link } from "react-router-dom";
import { logoSrcSet } from "../../lib/images.js";
import SplitRail from "@taylorurl/split-rail";

// The chrome Login, Signup and post-checkout Success share, so the three stay
// visually identical. The pages carry only what differs between them.
const AuthShell = ({ children }) => (
  <div className="min-h-dvh flex flex-col bg-asphalt-950 relative overflow-hidden">
    <div
      className="absolute inset-0 pointer-events-none asphalt-grain opacity-60"
      aria-hidden="true"
    />
    <div
      className="absolute top-0 left-0 right-0 h-1.5 race-stripe"
      aria-hidden="true"
    />
    <div
      className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-race-600/15 blur-3xl"
      aria-hidden="true"
    />
    <div
      className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-ignite-500/10 blur-3xl"
      aria-hidden="true"
    />

    <div className="relative z-10 flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img
              src="/images/logo.webp"
              srcSet={logoSrcSet("/images/logo.webp", 512)}
              sizes="64px"
              alt="Speedway 146"
              loading="eager"
              fetchpriority="high"
              width="512"
              height="560"
              className="h-16 w-auto mx-auto bg-transparent"
            />
            <div className="mt-3 font-display tracking-speedway text-xl text-chalk">
              SPEEDWAY <span className="text-race-500">146</span>
            </div>
          </Link>
        </div>
        {children}
      </div>
    </div>

    <footer className="relative z-10 text-chalk">
      <SplitRail version={__BUILD_VERSION__} />
    </footer>
  </div>
);

export default AuthShell;
