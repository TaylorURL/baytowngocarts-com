import Button from "../ui/Button.jsx";
import Icon from "../ui/Icon.jsx";
import Pill from "../ui/Pill.jsx";
import TurfFringe from "../decor/TurfFringe.jsx";
import { NOVEMBER_PROMO } from "../../lib/content/november.js";
import useNovemberPromo from "../../hooks/useNovemberPromo.js";

/*
 * The one band on the home page that is not about the park in general.
 *
 * It stands directly under the hero, ahead of every other section and
 * outside the deferred block, because a month-long price is only worth
 * printing while there is still a month to spend it in: a visitor who has to
 * scroll to find it mostly does not find it.
 *
 * Caution yellow rather than the race red the rest of the page is built on.
 * Red is the house colour and reads as decoration here; the tape and the
 * yellow plate read as a notice, which is what this is. The month is said
 * three times - the badge, the headline rule and the list - because the one
 * thing a reader must not take away from it is that the price is permanent.
 *
 * The band removes itself once the month is out. See `useNovemberPromo`.
 */
const NovemberSpecialSection = () => {
  if (!useNovemberPromo()) return null;

  return (
    <section
      aria-labelledby="november-special-heading"
      className="relative overflow-hidden bg-asphalt-950 py-20 text-chalk lg:py-24"
    >
      <div
        className="absolute inset-0 pointer-events-none asphalt-grain opacity-40"
        aria-hidden="true"
      />
      {/* The glow sits behind the plate, off to the side the plate is on, so
          the yellow has somewhere to come from rather than floating on flat
          asphalt. */}
      <div
        className="absolute -right-24 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-caution-500) 22%, transparent) 0%, transparent 70%)",
        }}
      />

      <TurfFringe className="absolute inset-x-0 top-0" />

      {/* Tape on both edges. The band is an interruption in the page and the
          two tapes are what say so. */}
      <div className="absolute inset-x-0 top-0 z-20" aria-hidden="true">
        <div className="h-2 caution-tape" />
      </div>
      <div className="absolute inset-x-0 bottom-0" aria-hidden="true">
        <div className="h-px bg-chalk/20" />
        <div className="h-2 caution-tape" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl" data-aos="fade">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-5 lg:gap-12">
            <div className="flex flex-col gap-5 lg:col-span-3">
              <div className="flex flex-wrap items-center gap-3">
                <Pill variant="caution" size="md" className="shadow-track">
                  <Icon name="alert-circle" className="h-3.5 w-3.5" />
                  {NOVEMBER_PROMO.badge}
                </Pill>
                <span className="font-display text-xs tracking-speedway uppercase text-chalk/70">
                  {NOVEMBER_PROMO.hoursNote}
                </span>
              </div>

              <h2
                id="november-special-heading"
                className="font-display text-5xl leading-[0.9] tracking-tight lg:text-7xl"
                data-aos="fade"
                data-aos-delay="80"
              >
                <span className="block text-caution-500">
                  {NOVEMBER_PROMO.title}
                </span>
                <span className="block text-chalk">{NOVEMBER_PROMO.days}</span>
              </h2>

              <div
                className="flex items-center gap-3"
                aria-hidden="true"
                data-aos="fade"
                data-aos-delay="120"
              >
                <span className="block h-[2px] w-12 rounded-full bg-caution-500" />
                <span className="font-display text-xs tracking-speedway uppercase text-caution-400">
                  November 2026 only
                </span>
              </div>

              <p
                className="max-w-xl text-lg leading-relaxed text-chalk/85"
                data-aos="fade"
                data-aos-delay="160"
              >
                {NOVEMBER_PROMO.description}
              </p>

              <ul
                className="grid grid-cols-1 gap-x-8 border-t border-chalk/15 sm:grid-cols-2"
                data-aos="fade"
                data-aos-delay="200"
              >
                {NOVEMBER_PROMO.highlights.map((highlight, i) => (
                  <li
                    key={highlight}
                    className="flex items-center gap-3 border-b border-chalk/15 py-3 text-sm font-medium text-chalk/95"
                    style={{ transitionDelay: `${i * 40}ms` }}
                  >
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-caution-500/10 ring-1 ring-caution-500/40">
                      <Icon
                        name="check"
                        className="h-3.5 w-3.5 text-caution-400"
                        strokeWidth={2.25}
                      />
                    </span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              <div
                className="mt-5 flex flex-col gap-3 sm:flex-row"
                data-aos="fade"
                data-aos-delay="260"
              >
                <Button to="/pricing" size="lg" variant="primary">
                  See Pricing
                  <Icon name="arrow-right" className="h-4 w-4" />
                </Button>
                <Button to="/contact" size="lg" variant="outlineLight">
                  <Icon name="phone" className="h-4 w-4" />
                  Ask a Question
                </Button>
              </div>
            </div>

            {/* The plate carries the number, the unit, the two nights and the
                window they run in, and stops there. */}
            <div className="lg:col-span-2" data-aos="fade" data-aos-delay="120">
              <div className="rounded-lg border-2 border-caution-500/60 bg-asphalt-900/80 px-7 py-8 shadow-lift backdrop-blur-sm">
                <div className="font-display text-7xl leading-none tracking-wide tabular-nums text-caution-500">
                  {NOVEMBER_PROMO.price}
                </div>
                <div className="mt-3 text-sm tracking-wide text-chalk/75">
                  {NOVEMBER_PROMO.unit}
                </div>
                <dl className="mt-6 space-y-3 border-t border-chalk/15 pt-5 text-sm">
                  <div className="flex items-start gap-3">
                    <dt className="sr-only">Nights</dt>
                    <Icon
                      name="calendar"
                      className="mt-0.5 h-4 w-4 shrink-0 text-caution-400"
                    />
                    <dd className="text-chalk/90">{NOVEMBER_PROMO.days}</dd>
                  </div>
                  <div className="flex items-start gap-3">
                    <dt className="sr-only">Hours</dt>
                    <Icon
                      name="clock"
                      className="mt-0.5 h-4 w-4 shrink-0 text-caution-400"
                    />
                    <dd className="tabular-nums text-chalk/90">
                      {NOVEMBER_PROMO.time}
                    </dd>
                  </div>
                  <div className="flex items-start gap-3">
                    <dt className="sr-only">Runs</dt>
                    <Icon
                      name="alert-circle"
                      className="mt-0.5 h-4 w-4 shrink-0 text-caution-400"
                    />
                    <dd className="font-semibold text-caution-400">
                      {NOVEMBER_PROMO.badge}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NovemberSpecialSection;
