import React from 'react';
import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../../lib/constants.js';

const TestimonialSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from families and racing enthusiasts who've experienced the thrill.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover-lift relative"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <Quote className="h-8 w-8 text-red-600 mb-4" />
              
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-700 mb-6 italic">
                "{testimonial.text}"
              </p>
              
              <div className="border-t pt-4">
                <h4 className="font-bold text-navy-900">{testimonial.name}</h4>
                <p className="text-gray-600 text-sm">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
