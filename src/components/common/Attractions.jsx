import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Attractions = () => {
  const attractions = [
    {
      title: 'Go-Kart Racing',
      description: 'Professional racing karts on our challenging outdoor track designed for maximum excitement.',
      image: '/images/9.jpg',
      features: ['Professional Karts', 'Timed Races', 'Safety Gear Included'],
    },
    {
      title: 'Bounce Houses',
      description: 'Multiple inflatable attractions perfect for kids parties and family fun.',
      image: '/images/10.jpg',
      features: ['Multiple Themes', 'All Ages Welcome', 'Safe & Clean'],
    },
    {
      title: 'Party Rooms',
      description: 'Private party spaces available for birthdays, corporate events, and celebrations.',
      image: '/images/11.jpg',
      features: ['Private Spaces', 'Catering Available', 'Event Planning'],
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-4">
            Our Attractions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover all the exciting activities and amenities we have to offer for your next adventure.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {attractions.map((attraction, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover-lift"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="image-hover">
                <img
                  src={attraction.image}
                  alt={attraction.title}
                  className="w-full h-64 object-cover"
                />
              </div>
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-navy-900 mb-4">
                  {attraction.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {attraction.description}
                </p>
                
                <ul className="space-y-2 mb-6">
                  {attraction.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link
                  to="/pricing"
                  className="inline-flex items-center text-red-600 hover:text-red-700 font-semibold transition-colors"
                >
                  Learn More
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Attractions;
