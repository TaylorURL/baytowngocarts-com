import { Link } from "react-router-dom";
import Button from "../common/Button.jsx";
import Icon from "../common/Icon.jsx";
import SectionEyebrow from "../common/SectionEyebrow.jsx";
import { GradientText } from "../reactbits";
import { THURSDAY_UNLIMITED_SPECIAL } from "../../lib/content/specials.js";

const ThursdaySpecialSection = () => (
  <section className="relative py-24 bg-gradient-to-br from-race-700 via-race-600 to-race-700 text-chalk overflow-hidden">
    <div
      className="absolute inset-0 asphalt-grain opacity-25"
      aria-hidden="true"
    />
    <div
      className="absolute inset-0 race-stripe opacity-[0.06] mix-blend-overlay"
      aria-hidden="true"
    />

    {/* Tape plus inner rule, so the two edges read as one band. */}
    <div className="absolute top-0 left-0 right-0" aria-hidden="true">
      <div className="h-2 caution-tape" />
      <div className="h-px bg-chalk/20" />
    </div>
    <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
      <div className="h-px bg-chalk/20" />
      <div className="h-2 caution-tape" />
    </div>

    <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto" data-aos="fade-up">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12 items-center">
          {/* Left column: copy, highlights, CTAs */}
          <div className="lg:col-span-3">
            <SectionEyebrow tone="dark" className="text-chalk/90">
              {THURSDAY_UNLIMITED_SPECIAL.eyebrow}
            </SectionEyebrow>

            <h2
              className="mt-4 font-display text-4xl lg:text-6xl tracking-tight leading-[0.92]"
              data-aos="fade-up"
              data-aos-delay="80"
            >
              {THURSDAY_UNLIMITED_SPECIAL.title}
            </h2>
            <div
              className="mt-4 flex items-center gap-3"
              aria-hidden="true"
              data-aos="fade-up"
              data-aos-delay="120"
            >
              <span className="block h-[2px] w-12 bg-chalk/80 rounded-full" />
              <span className="block h-[2px] w-3 bg-caution-400 rounded-full" />
              <span className="block h-[2px] w-1.5 bg-caution-400/70 rounded-full" />
            </div>

            <p
              className="mt-5 text-lg text-chalk/85 leading-relaxed max-w-xl"
              data-aos="fade-up"
              data-aos-delay="160"
            >
              {THURSDAY_UNLIMITED_SPECIAL.description}
            </p>

            <ul
              className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-x-8 border-t border-chalk/15"
              data-aos="fade-up"
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
              className="mt-9 flex flex-col sm:flex-row gap-3"
              data-aos="fade-up"
              data-aos-delay="260"
            >
              <Link to="/pricing">
                <Button size="lg" variant="light">
                  See Pricing
                  <Icon name="arrow-right" className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outlineLight">
                  Ask a Question
                </Button>
              </Link>
            </div>
          </div>

          {/* Right column: price card */}
          <div className="lg:col-span-2" data-aos="fade-left" data-aos-delay="120">
            <div className="relative">
              <div
                className="absolute -inset-1 rounded-lg bg-gradient-to-b from-chalk/20 via-transparent to-asphalt-950/40 blur-md"
                aria-hidden="true"
              />

              <div className="relative bg-asphalt-950/80 border-2 border-chalk/25 rounded-lg shadow-lift backdrop-blur-sm overflow-hidden">
                <div
                  className="flex items-center justify-between px-5 py-2 border-b border-chalk/15 bg-asphalt-900/80"
                  aria-hidden="true"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="block h-1.5 w-1.5 rounded-full bg-caution-400" />
                    <span className="block h-1.5 w-1.5 rounded-full bg-caution-400/60" />
                    <span className="block h-1.5 w-1.5 rounded-full bg-caution-400/30" />
                  </div>
                  <span className="font-display tracking-speedway text-[10px] text-chalk/50">
                    Pit Board
                  </span>
                </div>

                <div className="px-7 pt-7 pb-8 text-center">
                  <div className="inline-flex items-center gap-2 bg-caution-400 text-asphalt-950 px-3 py-1 rounded-full text-[10px] font-display tracking-speedway uppercase mb-6 shadow-track">
                    <Icon name="stopwatch" className="h-3.5 w-3.5" />
                    Featured Special
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <span
                      className="hidden sm:block h-8 w-px bg-chalk/25"
                      aria-hidden="true"
                    />
                    <GradientText
                      colors={["#ffe066", "#ff8a36", "#ffe066"]}
                      animationSpeed={6}
                      className="font-display text-7xl tracking-wide tabular-nums leading-none"
                    >
                      {THURSDAY_UNLIMITED_SPECIAL.price}
                    </GradientText>
                    <span
                      className="hidden sm:block h-8 w-px bg-chalk/25"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="mt-3 text-sm text-chalk/75 tracking-wide">
                    {THURSDAY_UNLIMITED_SPECIAL.perPerson}
                  </div>

                  <div className="mt-6 pt-5 border-t-2 border-chalk/15 flex items-center justify-center gap-3">
                    <span
                      className="block h-[3px] w-4 bg-caution-400 rounded-full"
                      aria-hidden="true"
                    />
                    <span className="text-xs font-display tracking-speedway uppercase text-caution-300">
                      Thursdays Only
                    </span>
                    <span
                      className="block h-[3px] w-4 bg-caution-400 rounded-full"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ThursdaySpecialSection;
