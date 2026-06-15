import { Link } from "react-router-dom";
import Button from "../common/Button.jsx";
import Icon from "../common/Icon.jsx";
import { CONTACT_INFO } from "../../lib/content/business.js";

const ActionSection = () => (
  <section className="relative bg-asphalt-900 text-chalk overflow-hidden">
    <div className="absolute inset-0 asphalt-grain opacity-60" aria-hidden="true" />
    <div className="absolute top-0 left-0 right-0 h-2 caution-tape" aria-hidden="true" />
    <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
        <h2 className="font-display text-5xl lg:text-7xl tracking-tight leading-[0.95]">
          Come race.
          <span className="block text-race-500">We're open today.</span>
        </h2>
        <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Walk-ins welcome every day of the week. Booking a party? Call us and
          we'll take it from there.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/pricing">
            <Button size="xl" variant="primary" className="group">
              See Pricing
              <Icon name="arrow-right" className="h-6 w-6 transition-transform duration-base ease-snap group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link to="/events">
            <Button size="xl" variant="outlineLight">
              <Icon name="calendar" className="h-5 w-5" />
              Plan an Event
            </Button>
          </Link>
        </div>
        <div className="mt-12 pt-8 border-t border-asphalt-700 flex flex-col sm:flex-row items-center justify-center gap-4">
          <span className="text-sm text-gray-400 uppercase tracking-widest font-display">
            Or skip the form
          </span>
          <a
            href={CONTACT_INFO.phoneTel}
            className="inline-flex items-center gap-3 bg-asphalt-800 hover:bg-asphalt-700 text-chalk px-6 py-3 rounded-md font-bold shadow-track transition-[background-color,transform] duration-base ease-snap hover:-translate-y-0.5 active:scale-95"
          >
            <Phone className="h-4 w-4 text-race-500" />
            <span className="tabular-nums tracking-wide">
              {CONTACT_INFO.phone}
            </span>
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default ActionSection;
