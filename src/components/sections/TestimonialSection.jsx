import { CheckCircle, Quote, Star } from "lucide-react";
import SectionHeading from "../common/SectionHeading.jsx";
import { TESTIMONIALS } from "../../lib/constants.js";

const TestimonialSection = () => (
  <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading
        badge="TESTIMONIALS"
        badgeVariant="red"
        title="What Our Customers Say"
        subtitle="Don't just take our word for it - hear from families and racing enthusiasts who've experienced the thrill"
        centered
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {TESTIMONIALS.map(({ name, rating, text, location }, index) => (
          <div
            key={name}
            className="bg-white p-8 rounded-2xl shadow-xl hover-lift relative border-2 border-gray-100"
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <div className="absolute -top-4 -right-4 bg-red-600 p-3 rounded-full shadow-lg">
              <Quote className="h-6 w-6 text-white" />
            </div>

            <div className="flex items-center gap-2 mb-4">
              {[...Array(rating)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 text-yellow-400 fill-current"
                />
              ))}
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed italic">
              "{text}"
            </p>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-navy-900">{name}</h4>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-gray-600 text-sm">{location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialSection;
