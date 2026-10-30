import Button from "../ui/Button.jsx";
import Pill from "../ui/Pill.jsx";
import Icon from "../ui/Icon.jsx";
import ParticleField from "../reactbits/ParticleField.jsx";
import Magnet from "../reactbits/Magnet.jsx";
import { CONTACT_INFO } from "../../lib/content/business.js";

const ActionSection = () => (
  <section className="relative bg-asphalt-900 text-chalk overflow-hidden">
    <div
      className="absolute inset-0 pointer-events-none asphalt-grain opacity-60"
      aria-hidden="true"
    />
    {/* Vignette pulls the eye to the centred CTA stack. */}
    <div
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(ellipse at 50% 45%, color-mix(in srgb, var(--accent-primary) 10%, transparent) 0%, color-mix(in srgb, var(--accent-primary) 4%, transparent) 30%, transparent 65%)",
      }}
    />
    <ParticleField
      layer="absolute inset-0 pointer-events-none opacity-50"
      particleCount={130}
      particleSpread={12}
      speed={0.06}
      particleBaseSize={70}
      alphaParticles
      disableRotation
    />
    <div
      className="absolute top-0 left-0 right-0 h-2 caution-tape"
      aria-hidden="true"
    />
    <div
      className="absolute bottom-0 left-0 right-0 h-1 race-stripe opacity-90"
      aria-hidden="true"
    />

    <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-4xl mx-auto text-center" data-aos="fade">
        <div
          className="flex justify-center"
          data-aos="fade"
          data-aos-delay="50"
        >
          <Pill variant="race" size="sm" className="shadow-race">
            Final Lap
          </Pill>
        </div>

        <div className="mt-6 flex justify-center" aria-hidden="true">
          <span className="block h-[3px] w-24 race-stripe rounded-full" />
        </div>

        <h2 className="mt-5 font-display text-5xl lg:text-7xl tracking-tight leading-[0.9]">
          Come race.
          <span className="block text-race-500">Friday to Sunday.</span>
        </h2>

        <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Walk-ins Friday through Sunday, weekends until 10:30 PM. Booking a
          party for up to 60? Call and we'll lock in your date.
        </p>

        <div
          className="mt-10 flex flex-col sm:flex-row gap-3 justify-center"
          data-aos="fade"
          data-aos-delay="100"
        >
          <Magnet
            padding={80}
            magnetStrength={4}
            wrapperClassName="w-full sm:w-auto"
            innerClassName="w-full sm:w-auto"
          >
            <Button
              to="/pricing"
              size="xl"
              variant="primary"
              fullWidth
              className="group sm:w-auto"
            >
              See Pricing
              <Icon
                name="arrow-right"
                className="h-6 w-6 transition-transform duration-base ease-snap group-hover:translate-x-1"
              />
            </Button>
          </Magnet>
          <Button
            to="/events"
            size="xl"
            variant="outlineLight"
            fullWidth
            className="sm:w-auto"
          >
            <Icon name="calendar" className="h-5 w-5" />
            Plan an Event
          </Button>
        </div>

        <div
          className="mt-12 pt-8 border-t border-asphalt-700 flex flex-col items-center gap-2"
          data-aos="fade"
          data-aos-delay="150"
        >
          <span className="text-sm text-gray-400 uppercase tracking-widest font-display">
            Parties are booked by phone
          </span>
          <a
            href={CONTACT_INFO.phoneTel}
            className="inline-flex min-h-11 items-center gap-3 font-display text-4xl tracking-wide tabular-nums text-chalk hover:text-race-400 transition-colors duration-base ease-snap"
          >
            <Icon name="phone" className="h-7 w-7 text-race-500" />
            {CONTACT_INFO.phone}
          </a>
          <span className="text-sm text-gray-500">
            Friday to Sunday · weekends until 10:30 PM
          </span>
        </div>
      </div>
    </div>
  </section>
);

export default ActionSection;
