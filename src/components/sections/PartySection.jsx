import { Link } from "react-router-dom";
import Button from "../common/Button.jsx";
import Icon from "../common/Icon.jsx";
import SectionEyebrow from "../common/SectionEyebrow.jsx";
import { CONTACT_INFO } from "../../lib/content/business.js";
import { PARTY_PROMO } from "../../lib/content/party.js";

const PartySection = () => (
  <section className="relative py-24 bg-chalk overflow-hidden">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-3" data-aos="fade-up">
            <SectionEyebrow tone="light">{PARTY_PROMO.eyebrow}</SectionEyebrow>

            <h2
              className="mt-4 font-display text-4xl lg:text-6xl tracking-tight leading-[0.92] text-asphalt-900"
              data-aos="fade-up"
              data-aos-delay="80"
            >
              {PARTY_PROMO.title}
              <span className="block text-race-600">
                {PARTY_PROMO.titleAccent}
              </span>
            </h2>

            <div
              className="mt-4 flex items-center gap-3"
              aria-hidden="true"
              data-aos="fade-up"
              data-aos-delay="120"
            >
              <span className="block h-[2px] w-12 bg-race-600 rounded-full" />
              <span className="block h-[2px] w-3 bg-asphalt-300 rounded-full" />
              <span className="block h-[2px] w-1.5 bg-asphalt-200 rounded-full" />
            </div>

            <p
              className="mt-5 text-lg text-asphalt-600 leading-relaxed max-w-xl"
              data-aos="fade-up"
              data-aos-delay="160"
            >
              {PARTY_PROMO.description}
            </p>

            <ul
              className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-x-8 border-t border-asphalt-100"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              {PARTY_PROMO.facts.map((fact) => (
                <li
                  key={fact}
                  className="flex items-center gap-3 py-3 border-b border-asphalt-100 text-sm font-medium text-asphalt-700"
                >
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-race-600/10 ring-1 ring-race-600/25">
                    <Icon
                      name="check"
                      className="h-3.5 w-3.5 text-race-600"
                      strokeWidth={2.25}
                    />
                  </span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>

            <div
              className="mt-9 flex flex-col sm:flex-row gap-3"
              data-aos="fade-up"
              data-aos-delay="260"
            >
              <Link to={PARTY_PROMO.faqLink}>
                <Button size="lg" variant="primary" className="group">
                  <Icon name="search" className="h-5 w-5" />
                  {PARTY_PROMO.faqCta}
                  <Icon
                    name="arrow-right"
                    className="h-5 w-5 transition-transform duration-base ease-snap group-hover:translate-x-1"
                  />
                </Button>
              </Link>
              <a href={CONTACT_INFO.phoneTel}>
                <Button size="lg" variant="outline" className="tabular-nums">
                  <Icon name="phone" className="h-5 w-5" />
                  Call to Book a Date
                </Button>
              </a>
            </div>

            <p
              className="mt-4 text-sm text-asphalt-500"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              Dates are locked in by phone — {CONTACT_INFO.phone}.
            </p>
          </div>

          <div className="lg:col-span-2" data-aos="fade-left" data-aos-delay="120">
            <Link
              to={PARTY_PROMO.faqLink}
              className="group relative block rounded-lg overflow-hidden border border-asphalt-200 hover:border-race-500 shadow-track hover:shadow-lift hover:-translate-y-1 transition-[border-color,box-shadow,transform] duration-base ease-snap"
            >
              <div className="relative image-hover h-80 lg:h-[26rem] overflow-hidden">
                <img
                  src={PARTY_PROMO.image}
                  alt={PARTY_PROMO.imageAlt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-asphalt-950/80 via-asphalt-950/20 to-transparent" />
                <div className="absolute top-4 right-4 bg-race-600 text-chalk px-2.5 py-2 rounded-md shadow-lift ring-1 ring-inset ring-race-300/60">
                  <Icon name="cake" className="h-5 w-5" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="font-display tracking-speedway uppercase text-[11px] text-chalk/70">
                    The Party Room
                  </div>
                  <div className="mt-1 font-display text-2xl text-chalk tracking-tight leading-none">
                    60 guests · 20 wristbands
                  </div>
                  <div className="mt-3 inline-flex items-center gap-2 font-display tracking-speedway text-sm text-chalk">
                    <span className="relative">
                      Party FAQs
                      <span
                        aria-hidden="true"
                        className="absolute left-0 -bottom-0.5 h-[2px] w-6 bg-race-500 transition-all duration-base ease-snap group-hover:w-full"
                      />
                    </span>
                    <Icon
                      name="arrow-right"
                      className="h-4 w-4 transition-transform duration-base ease-snap group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </div>
              <div aria-hidden="true" className="h-1 bg-race-600" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default PartySection;
