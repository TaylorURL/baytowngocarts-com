import { Link } from "react-router-dom";
import Button from "../common/Button.jsx";
import Icon from "../common/Icon.jsx";
import SectionEyebrow from "../common/SectionEyebrow.jsx";
import { THURSDAY_UNLIMITED_SPECIAL } from "../../lib/content/specials.js";

const ThursdaySpecialSection = () => (
  <section className="relative py-20 bg-gradient-to-br from-race-700 via-race-600 to-race-700 text-chalk overflow-hidden">
    <div
      className="absolute inset-0 asphalt-grain opacity-25"
      aria-hidden="true"
    />
    <div
      className="absolute top-0 left-0 right-0 h-2 caution-tape"
      aria-hidden="true"
    />
    <div
      className="absolute bottom-0 left-0 right-0 h-2 caution-tape"
      aria-hidden="true"
    />
    <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto" data-aos="fade-up">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
          <div className="lg:col-span-3">
            <SectionEyebrow tone="dark" className="text-chalk/90">
              {THURSDAY_UNLIMITED_SPECIAL.eyebrow}
            </SectionEyebrow>
            <h2 className="mt-4 font-display text-4xl lg:text-6xl tracking-tight leading-[0.95]">
              {THURSDAY_UNLIMITED_SPECIAL.title}
            </h2>
            <p className="mt-5 text-lg text-chalk/85 leading-relaxed max-w-xl">
              {THURSDAY_UNLIMITED_SPECIAL.description}
            </p>
            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {THURSDAY_UNLIMITED_SPECIAL.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-start gap-2 text-sm text-chalk/90"
                >
                  <Icon
                    name="check"
                    className="h-4 w-4 text-caution-300 mt-0.5 shrink-0"
                  />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/pricing">
                <Button size="lg" variant="light">
                  See Pricing
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outlineLight">
                  Ask a Question
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-asphalt-950/70 border-2 border-chalk/20 rounded-lg p-8 text-center shadow-lift backdrop-blur-sm">
              <div className="inline-flex items-center gap-2 bg-caution-400 text-asphalt-950 px-3 py-1 rounded-full text-[10px] font-display tracking-speedway uppercase mb-5">
                <Icon name="stopwatch" className="h-3.5 w-3.5" />
                Featured Special
              </div>
              <div className="font-display text-7xl text-chalk tracking-wide tabular-nums leading-none">
                {THURSDAY_UNLIMITED_SPECIAL.price}
              </div>
              <div className="mt-3 text-sm text-chalk/80">
                {THURSDAY_UNLIMITED_SPECIAL.perPerson}
              </div>
              <div className="mt-5 pt-5 border-t border-chalk/20 text-xs font-display tracking-speedway uppercase text-caution-300">
                Thursdays Only
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ThursdaySpecialSection;
