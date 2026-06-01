/**
 * 404 page displayed for unmatched routes. Shows a themed error message
 * with links back to the home and pricing pages.
 */
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
export default function NotFoundPage() {
  return (
    <div className="w-full -mt-20">
      <section className="relative bg-navy-900 overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-cover bg-center opacity-20 bg-[url('/images/18.JPEG')]" />
        </div>
        {/* Diagonal crosshatch racing-flag texture */}
        <div className="absolute inset-0 z-[5] opacity-10 checker-overlay" />
        <div className="relative z-10 container mx-auto px-4 text-center" data-aos="fade-up">
          <div className="inline-block mb-6 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-display tracking-widest">
            WRONG TURN
          </div>
          <h1 className="text-8xl md:text-9xl font-black text-red-600 mb-4 leading-none [text-shadow:0_8px_30px_rgba(224,36,36,0.35)]">
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
              className="group inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-red transition duration-200 ease-out hover:-translate-y-0.5 active:scale-95"
            >
              <Home className="h-5 w-5" />
              Go Home
            </Link>
            <Link
              to="/pricing"
              className="group inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-red-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition duration-200 ease-out active:scale-95"
            >
              <ArrowLeft className="h-5 w-5 transition-transform duration-200 ease-out group-hover:-translate-x-1" />
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
