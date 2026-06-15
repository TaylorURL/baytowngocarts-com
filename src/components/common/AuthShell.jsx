import { Link } from "react-router-dom";

/**
 * Standard wrapper for the auth flows (Login, Signup, post-checkout Success).
 * Asphalt full-bleed background with a race-stripe top edge and a centered
 * card. Single source of truth so all three pages match.
 */
const AuthShell = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-asphalt-950 relative overflow-hidden">
    <div className="absolute inset-0 asphalt-grain opacity-60" aria-hidden="true" />
    <div className="absolute top-0 left-0 right-0 h-1.5 race-stripe" aria-hidden="true" />
    <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-race-600/15 blur-3xl" aria-hidden="true" />
    <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-ignite-500/10 blur-3xl" aria-hidden="true" />

    <div className="relative z-10 flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img
              src="/images/logo.png"
              alt="Speedway 146"
              loading="eager"
              className="h-16 mx-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]"
            />
            <div className="mt-3 font-display tracking-speedway text-xl text-chalk">
              SPEEDWAY <span className="text-race-500">146</span>
            </div>
          </Link>
        </div>
        {children}
      </div>
    </div>
  </div>
);

export default AuthShell;
