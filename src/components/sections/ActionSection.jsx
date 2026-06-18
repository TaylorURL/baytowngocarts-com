import { Link } from "react-router-dom";
import Button from "../common/Button.jsx";
import Pill from "../common/Pill.jsx";
import Icon from "../common/Icon.jsx";
import { CONTACT_INFO } from "../../lib/content/business.js";

const ActionSection = () => (
  <section className="relative bg-asphalt-900 text-chalk overflow-hidden">
    {/* Track texture */}
    <div className="absolute inset-0 asphalt-grain opacity-60" aria-hidden="true" />
    {/* Subtle radial vignette — pulls focus to the centered CTA stack */}
    <div
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(ellipse at 50% 45%, rgba(225,29,42,0.10) 0%, rgba(225,29,42,0.04) 30%, transparent 65%)",
      }}
    />
    {/* Caution-tape top edge */}
    <div className="absolute top-0 left-0 right-0 h-2 caution-tape" aria-hidden="true" />
    {/* Finish-line race-stripe — closing weight, sits above the footer */}
    <div className="absolute bottom-0 left-0 right-0 h-1 race-stripe opacity-90" aria-hidden="true" />

    <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
        {/* Final Lap eyebrow */}
        <div className="flex justify-center" data-aos="fade-up" data-aos-delay="50">
          <Pill variant="race" size="sm" className="shadow-race">
            <span className="block h-1.5 w-1.5 rounded-full bg-chalk animate-pulse-race" />
            Final Lap
          </Pill>
        </div>

        {/* Thin race-stripe accent ribbon above the headline */}
        <div className="mt-6 flex justify-center" aria-hidden="true">
          <span className="block h-[3px] w-24 race-stripe rounded-full" />
        </div>

        <h2 className="mt-5 font-display text-5xl lg:text-7xl tracking-tight leading-[0.9]">
          Come race.
          <span className="block text-race-500">Thursday – Sunday.</span>
        </h2>

        <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Walk-ins Thursday through Sunday, weekends until 10:30 PM. Booking a
          party for up to 60? Call and we'll lock in your date.
        </p>

        <div
          className="mt-10 flex flex-col sm:flex-row gap-3 justify-center"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <Link to="/pricing" className="w-full sm:w-auto">
            <Button size="xl" variant="primary" fullWidth className="group sm:w-auto">
              See Pricing
              <Icon
                name="arrow-right"
                className="h-6 w-6 transition-transform duration-base ease-snap group-hover:translate-x-1"
              />
            </Button>
          </Link>
          <Link to="/events" className="w-full sm:w-auto">
            <Button size="xl" variant="outlineLight" fullWidth className="sm:w-auto">
              <Icon name="calendar" className="h-5 w-5" />
              Plan an Event
            </Button>
          </Link>
        </div>

        {/* Pit-radio direct line */}
        <div
          className="mt-12 pt-8 border-t border-asphalt-700 flex flex-col sm:flex-row items-center justify-center gap-4"
          data-aos="fade-up"
          data-aos-delay="150"
        >
          <span className="text-sm text-gray-400 uppercase tracking-widest font-display">
            Or skip the form
          </span>
          <a
            href={CONTACT_INFO.phoneTel}
            className="group relative inline-flex items-center gap-3 overflow-hidden bg-asphalt-800 hover:bg-asphalt-700 text-chalk pl-6 pr-6 py-3 rounded-md font-bold shadow-track ring-1 ring-asphalt-700 hover:ring-asphalt-600 transition-[background-color,transform,box-shadow] duration-base ease-snap hover:-translate-y-0.5 hover:shadow-lift active:scale-95"
          >
            {/* Left race-red vertical rule — chrome-edged pit-radio plate */}
            <span
              className="absolute left-0 top-0 bottom-0 w-1 bg-race-600"
              aria-hidden="true"
            />
            {/* Live indicator dot */}
            <span
              className="ml-1 inline-flex h-2 w-2 rounded-full bg-race-500 animate-pulse-race"
              aria-hidden="true"
            />
            <Icon name="phone" className="h-4 w-4 text-race-500" />
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
