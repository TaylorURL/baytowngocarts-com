import React from 'react';
import { Calendar, Trophy, Users, Gift } from 'lucide-react';

const EventsPage: React.FC = () => {
  const eventTypes = [
    {
      title: 'Birthday Parties',
      description: 'Make your birthday unforgettable with high-speed racing and our party room.',
      image: '/images/5.jpg',
      features: ['Private party room', 'Racing packages', 'Food & drinks', 'Party decorations'],
    },
    {
      title: 'Corporate Events',
      description: 'Team building activities and corporate entertainment that your team will love.',
      image: '/images/6.jpg',
      features: ['Team building races', 'Private track time', 'Catering options', 'Meeting facilities'],
    },
    {
      title: 'Racing Leagues',
      description: 'Join our competitive racing leagues and compete for championship titles.',
      image: '/images/7.jpg',
      features: ['Weekly races', 'Championship points', 'Trophies & prizes', 'Professional timing'],
    },
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-red-900 via-red-800 to-navy-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Events & Parties
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Create unforgettable memories with our exciting events and party packages
            </p>
          </div>
        </div>
      </section>

      {/* Event Types */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl font-bold text-navy-900 mb-4">
              Event Types
            </h2>
            <p className="text-xl text-gray-600">
              We host a variety of events for all occasions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {eventTypes.map((eventType, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover-lift"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="image-hover">
                  <img
                    src={eventType.image}
                    alt={eventType.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-navy-900 mb-4">
                    {eventType.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {eventType.description}
                  </p>
                  
                  <ul className="space-y-2 mb-6">
                    {eventType.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors button-hover">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Private Party Room */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <h2 className="text-4xl font-bold text-navy-900 mb-6">
                Private Party Room
              </h2>
              <p className="text-gray-600 mb-6">
                Our private party room is the perfect space for celebrations of all kinds. With comfortable seating, decorations, and space for food and drinks, it's the ideal complement to your racing experience.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                  Accommodates up to 30 guests
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                  Tables and chairs provided
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                  Decorations and setup included
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                  Food and beverage options available
                </li>
              </ul>
            </div>
            <div data-aos="fade-left" className="image-hover">
              <img
                src="/images/8.jpg"
                alt="Party room"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Book Your Event */}
      <section className="py-20 bg-gradient-to-br from-navy-900 via-red-900 to-navy-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <h2 className="text-4xl font-bold mb-6">
              Book Your Event
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Ready to plan your event? Contact us to discuss your needs and we'll create a custom package that's perfect for your celebration. We handle all the details so you can focus on having fun!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-8">
              <div>
                <ul className="space-y-2 text-gray-300">
                  <li>• Advance booking recommended</li>
                  <li>• Groups of all sizes welcome</li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2 text-gray-300">
                  <li>• Custom packages available</li>
                  <li>• Contact us to book</li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:(346) 932-1266"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors button-hover"
              >
                Call to Book
              </a>
              <a
                href="/contact"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-navy-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Contact Form
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;