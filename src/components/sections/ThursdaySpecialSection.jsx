import Button from "../common/Button.jsx";
import Icon from "../common/Icon.jsx";
import SectionEyebrow from "../common/SectionEyebrow.jsx";
import TurfFringe from "../common/TurfFringe.jsx";
import { THURSDAY_UNLIMITED_SPECIAL } from "../../lib/content/specials.js";

const ThursdaySpecialSection = () => (
  <section className="relative py-24 bg-gradient-to-br from-race-700 via-race-600 to-race-700 text-chalk overflow-hidden">
    <div
      className="absolute inset-0 pointer-events-none asphalt-grain opacity-25"
      aria-hidden="true"
    />
    <div
      className="absolute inset-0 race-stripe opacity-[0.06] mix-blend-overlay"
      aria-hidden="true"
    />

    {/* Only the closing edge is tape now. The track crossing the top of the
        section is the boundary the one above it used to be, and this is the
        far side of that: the divider's verge ends in shadow, this picks the
        shadow up at the value it ended on, and the blades stand in front of
        the red so the two meet on grass rather than on a ruled line. */}
    <TurfFringe className="absolute inset-x-0 top-0" />

    <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
      <div className="h-px bg-chalk/20" />
      <div className="h-2 caution-tape" />
    </div>

    <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto" data-aos="fade">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-3 flex flex-col gap-5">
            <SectionEyebrow tone="dark" className="text-chalk/90">
              {THURSDAY_UNLIMITED_SPECIAL.eyebrow}
            </SectionEyebrow>

            <h2
              className="font-display text-4xl lg:text-6xl tracking-tight leading-[0.92]"
              data-aos="fade"
              data-aos-delay="80"
            >
              {THURSDAY_UNLIMITED_SPECIAL.title}
            </h2>
            <div
              className="flex items-center gap-3"
              aria-hidden="true"
              data-aos="fade"
              data-aos-delay="120"
            >
              <span className="block h-[2px] w-12 bg-chalk/80 rounded-full" />
              <span className="block h-[2px] w-3 bg-caution-400 rounded-full" />
            </div>

            <p
              className="text-lg text-chalk/85 leading-relaxed max-w-xl"
              data-aos="fade"
              data-aos-delay="160"
            >
              {THURSDAY_UNLIMITED_SPECIAL.description}
            </p>

            <ul
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 border-t border-chalk/15"
              data-aos="fade"
              data-aos-delay="200"
            >
              {THURSDAY_UNLIMITED_SPECIAL.highlights.map((highlight, i) => (
                <li
                  key={highlight}
                  className="flex items-center gap-3 py-3 border-b border-chalk/15 text-sm font-medium text-chalk/95"
                  style={{ transitionDelay: `${i * 40}ms` }}
                >
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-chalk/10 ring-1 ring-chalk/30">
                    <Icon
                      name="check"
                      className="h-3.5 w-3.5 text-caution-300"
                      strokeWidth={2.25}
                    />
                  </span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            <div
              className="mt-5 flex flex-col sm:flex-row gap-3"
              data-aos="fade"
              data-aos-delay="260"
            >
              <Button to="/pricing" size="lg" variant="light">
                See Pricing
                <Icon name="arrow-right" className="h-4 w-4" />
              </Button>
              <Button to="/contact" size="lg" variant="outlineLight">
                Ask a Question
              </Button>
            </div>
          </div>

          {/* What the section is selling costs one number, and the section
              has already said what it buys and which day it runs. The plate
              carries the number and the unit and stops there. */}
          <div className="lg:col-span-2" data-aos="fade" data-aos-delay="120">
            <div className="rounded-lg border-2 border-chalk/25 bg-asphalt-950/80 px-7 py-8 shadow-lift backdrop-blur-sm">
              <div className="font-display text-7xl leading-none tracking-wide tabular-nums text-chalk">
                {THURSDAY_UNLIMITED_SPECIAL.price}
              </div>
              <div className="mt-3 text-sm tracking-wide text-chalk/75">
                {THURSDAY_UNLIMITED_SPECIAL.perPerson}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ThursdaySpecialSection;
