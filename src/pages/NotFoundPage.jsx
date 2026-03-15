/**
 * 404 page displayed for unmatched routes. Shows a themed error message
 * with links back to the home and pricing pages.
 */
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

/** Diagonal crosshatch overlay used as a background texture. */
const CROSSHATCH_STYLE = {
  backgroundImage:
    "linear-gradient(45deg, var(--color-black) 25%, transparent 25%), linear-gradient(-45deg, var(--color-black) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--color-black) 75%), linear-gradient(-45deg, transparent 75%, var(--color-black) 75%)",
  backgroundSize: "20px 20px",
  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
};

export default function NotFoundPage() {
  return (
    <div className="w-full -mt-20">
      <section className="relative bg-navy-900 overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: "url(/images/18.JPEG)" }}
          />
        </div>

        <div
          className="absolute inset-0 z-5 opacity-10"
          style={CROSSHATCH_STYLE}
        />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-8xl md:text-9xl font-black text-red-600 mb-4">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-md mx-auto">
            Looks like you took a wrong turn on the track. Let's get you back.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
            >
              <Home className="h-5 w-5" />
              Go Home
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-red-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
