import Icon from "../common/Icon.jsx";
import SectionEyebrow from "../common/SectionEyebrow.jsx";
import { TESTIMONIALS } from "../../lib/content/testimonials.js";

const TestimonialSection = () => (
  <section className="relative py-24 bg-chalk">
    {/* Faint chrome ribbon along the top — matches the quiet opening rhythm
        of the sibling Attractions section above it. */}
    <div
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-asphalt-300 to-transparent"
    />
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-16" data-aos="fade-up">
        {/* Chrome rule anchoring the eyebrow — pit-lane marker. */}
        <div className="flex justify-center mb-6" aria-hidden="true">
          <span className="block h-[3px] w-10 bg-asphalt-300 rounded-full" />
        </div>
        <SectionEyebrow tone="light" className="justify-center">
          What Regulars Say
        </SectionEyebrow>
        <h2 className="mt-5 text-4xl lg:text-5xl font-bold text-asphalt-900 leading-[1.05] tracking-tight">
          Hundreds of birthdays. Thousands of laps.
        </h2>
        <p className="mt-4 text-lg text-asphalt-600">
          Real reviews from Baytown, Houston, and Pasadena families who keep
          coming back.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TESTIMONIALS.map(({ name, rating, text, location }, index) => (
          <figure
            key={name}
            className="relative bg-white rounded-lg p-8 border border-asphalt-200 hover:border-asphalt-300 shadow-track hover:shadow-lift hover:-translate-y-1 transition-[border-color,box-shadow,transform] duration-base ease-snap overflow-hidden"
            data-aos="fade-up"
            data-aos-delay={index * 80}
          >
            {/* Stamp-style quote anchor — rotated, sits in the corner like
                a printed mark on a paddock pass */}
            <Icon
              name="quote"
              className="absolute -top-2 -right-2 h-16 w-16 text-race-200 -rotate-12 pointer-events-none"
            />

            {/* Rating badge — stars + explicit "/ 5" so the number is read,
                not just glanced */}
            <div
              className="relative flex items-center gap-2 mb-5"
              aria-label={`${rating} out of 5 stars`}
            >
              <div className="flex items-center gap-0.5">
                {Array.from({ length: rating }).map((_, i) => (
                  <Icon
                    key={i}
                    name="star"
                    className="h-4 w-4 text-caution-500 fill-caution-500"
                  />
                ))}
                {Array.from({ length: 5 - rating }).map((_, i) => (
                  <Icon
                    key={`empty-${i}`}
                    name="star"
                    className="h-4 w-4 text-asphalt-200"
                  />
                ))}
              </div>
              <span
                aria-hidden="true"
                className="font-display tracking-speedway text-[11px] text-asphalt-500 tabular-nums pl-1 border-l border-asphalt-200"
              >
                {rating}.0 / 5
              </span>
            </div>

            <blockquote className="relative text-base text-asphalt-800 leading-[1.6]">
              <span
                aria-hidden="true"
                className="font-display text-race-300 text-2xl leading-none mr-0.5 align-[-2px]"
              >
                &ldquo;
              </span>
              {text}
              <span
                aria-hidden="true"
                className="font-display text-race-300 text-2xl leading-none ml-0.5 align-[-2px]"
              >
                &rdquo;
              </span>
            </blockquote>

            <figcaption className="mt-6 pt-5 border-t border-asphalt-100 flex items-end justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-display tracking-tight text-base text-asphalt-900 truncate">
                    {name}
                  </span>
                  <Icon
                    name="check-circle"
                    className="h-3.5 w-3.5 text-race-600 shrink-0"
                    aria-label="Verified visit"
                  />
                </div>
                <div className="text-xs text-asphalt-500 mt-0.5 flex items-center gap-1">
                  <Icon name="map-pin" className="h-3 w-3 text-asphalt-400" />
                  <span className="truncate">{location}</span>
                </div>
              </div>
              {/* Paddock-style verified stamp — bordered pill, tabular,
                  small enough to read as a credential not a button */}
              <span className="shrink-0 inline-flex items-center gap-1 font-display tracking-speedway text-[10px] text-asphalt-600 uppercase px-2 py-1 border border-asphalt-300 rounded-sm bg-asphalt-50">
                <span
                  aria-hidden="true"
                  className="block h-1.5 w-1.5 rounded-full bg-race-600"
                />
                Verified
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialSection;
