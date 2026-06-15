import Icon from "../common/Icon.jsx";
import SectionEyebrow from "../common/SectionEyebrow.jsx";
import { TESTIMONIALS } from "../../lib/content/testimonials.js";

const TestimonialSection = () => (
  <section className="py-24 bg-chalk">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-16" data-aos="fade-up">
        <SectionEyebrow tone="light" className="justify-center">
          What Regulars Say
        </SectionEyebrow>
        <h2 className="mt-5 text-4xl lg:text-5xl font-bold text-asphalt-900">
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
            className="relative bg-white rounded-lg p-8 border border-asphalt-200 hover:border-asphalt-300 shadow-track hover:shadow-lift hover:-translate-y-1 transition-[border-color,box-shadow,transform] duration-base ease-snap"
            data-aos="fade-up"
            data-aos-delay={index * 80}
          >
            <Quote
              className="absolute top-5 right-5 h-8 w-8 text-race-100"
              aria-hidden="true"
            />
            <div
              className="flex items-center gap-1 mb-4"
              aria-label={`${rating} out of 5 stars`}
            >
              {Array.from({ length: rating }).map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 text-caution-500 fill-caution-500"
                />
              ))}
            </div>
            <blockquote className="text-asphalt-700 leading-relaxed">
              "{text}"
            </blockquote>
            <figcaption className="mt-6 pt-5 border-t border-asphalt-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-asphalt-900">{name}</span>
                  <CheckCircle
                    className="h-3.5 w-3.5 text-race-600"
                    aria-label="Verified visit"
                  />
                </div>
                <div className="text-xs text-asphalt-500 mt-0.5">
                  {location}
                </div>
              </div>
              <span className="font-display tracking-speedway text-[10px] text-asphalt-400 uppercase">
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
