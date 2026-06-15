/**
 * 404 page displayed for unmatched routes. Themed as a "wrong turn" message
 * with links back home and to pricing.
 */
import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import Pill from "../components/common/Pill.jsx";

const NotFoundPage = () => (
  <div className="w-full -mt-20">
    <section className="relative bg-asphalt-950 overflow-hidden min-h-screen flex items-center">
      <div className="absolute inset-0 asphalt-grain opacity-70" aria-hidden="true" />
      <div className="absolute inset-0 opacity-15 bg-cover bg-center bg-[url('/images/18.JPEG')]" aria-hidden="true" />
      <div className="absolute inset-0 z-[2] opacity-[0.06] checker-overlay" aria-hidden="true" />
      <div className="absolute top-0 left-0 right-0 h-1.5 race-stripe" aria-hidden="true" />
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-race-600/20 blur-3xl" aria-hidden="true" />

      <div className="relative z-10 container mx-auto px-4 text-center" data-aos="fade-up">
        <Pill variant="race">Wrong Turn</Pill>
        <h1 className="mt-6 font-display text-[8rem] md:text-[12rem] leading-none text-race-500 tracking-tight [text-shadow:0_8px_30px_rgba(225,29,42,0.45)]">
          404
        </h1>
        <h2 className="mt-2 text-3xl md:text-4xl font-bold text-chalk">
          That page isn't on our track.
        </h2>
        <p className="mt-4 text-lg text-gray-400 max-w-md mx-auto">
          You took a wrong turn somewhere. No worries — pit lane is right
          this way.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="group inline-flex items-center justify-center gap-2 bg-race-600 hover:bg-race-500 text-chalk px-8 py-4 rounded-md font-bold text-lg shadow-race transition-[background-color,transform] duration-base ease-snap hover:-translate-y-0.5 active:scale-95"
          >
            <Home className="h-5 w-5" />
            Back to home
          </Link>
          <Link
            to="/pricing"
            className="group inline-flex items-center justify-center gap-2 border-2 border-chalk/30 hover:border-race-500 text-chalk px-8 py-4 rounded-md font-bold text-lg transition-[border-color,transform] duration-base ease-snap active:scale-95"
          >
            <ArrowLeft className="h-5 w-5 transition-transform duration-base ease-snap group-hover:-translate-x-1" />
            See pricing instead
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default NotFoundPage;
