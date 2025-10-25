import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Jessica M.',
      rating: 5,
      text: 'We brought our 8 year old here for the first time last weekend and he hasn\'t stopped talking about it! The staff helped him feel comfortable on the track and the bounce houses kept his little sister entertained. Will definitely be back.',
      location: 'Baytown, TX',
    },
    {
      name: 'Carlos R.',
      rating: 5,
      text: 'Been coming here with my buddies for years now. The karts are fast and well-maintained. Gets pretty competitive out there lol. Great way to blow off steam after work on Fridays.',
      location: 'Houston, TX',
    },
    {
      name: 'Amanda K.',
      rating: 4,
      text: 'My daughter had her 10th birthday party here and it was honestly so much easier than I expected. They handled everything and the kids had an absolute blast. Only wish the party room was a bit bigger but we made it work!',
      location: 'La Porte, TX',
    },
    {
      name: 'David L.',
      rating: 5,
      text: 'Took my wife here for date night since we both love racing. She beat me twice and won\'t let me forget it haha. Track is fun with good variety, staff is cool, and the atmosphere is awesome. Highly recommend!',
      location: 'Pasadena, TX',
    },
    {
      name: 'Michelle T.',
      rating: 5,
      text: 'Clean facility, friendly staff, and my kids are obsessed with the bounce houses. We come almost every other weekend now. It\'s become our go-to spot when the kids need to burn off energy. Great prices too.',
      location: 'Deer Park, TX',
    },
    {
      name: 'Brandon S.',
      rating: 4,
      text: 'Pretty solid place for go-karts. Been to a few different tracks around Houston and this one\'s up there. Track layout is nice and the karts have decent speed. Can get crowded on weekends but that\'s expected.',
      location: 'Webster, TX',
    },
  ];

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
          {testimonials.map((testimonial, index) => (
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

export default Testimonials;