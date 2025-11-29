import React from 'react';
import { Trophy, Users, Gift, PartyPopper, Briefcase, Check, Phone, Cake, Star, Shield, Clock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button.jsx';

const EventsPage = () => {
  const eventTypes = [
    {
      title: 'Birthday Parties',
      description: 'Make your birthday unforgettable with high-speed racing and our private party room.',
      image: '/images/5.jpg',
      icon: Cake,
      features: ['Private party room for 30 guests', 'Racing packages included', 'Food & drinks available', 'Party decorations & setup'],
    },
    {
      title: 'Corporate Events',
      description: 'Team building activities and corporate entertainment that your team will love.',
      image: '/images/6.jpg',
      icon: Briefcase,
      features: ['Team building races', 'Private track time available', 'Catering options', 'Meeting space included'],
    },
    {
      title: 'Racing Leagues',
      description: 'Join our competitive racing leagues and compete for championship titles.',
      image: '/images/7.jpg',
      icon: Trophy,
      features: ['Weekly competitive races', 'Championship points system', 'Trophies & prizes', 'Professional lap timing'],
    },
  ];

  const packages = [
    {
      title: 'Basic Party',
      price: 'Starting at $299',
      description: 'Perfect for smaller gatherings',
      features: [
        'Up to 10 guests',
        '5 Race passes',
        '2 hours party room',
        'Basic decorations',
      ],
    },
    {
      title: 'Premium Party',
      price: 'Starting at $499',
      description: 'Our most popular package',
      features: [
        'Up to 20 guests',
        '10 Race passes',
        '3 hours party room',
        'Premium decorations',
        'Food & drinks included',
      ],
      isPopular: true,
    },
    {
      title: 'Ultimate Experience',
      price: 'Starting at $799',
      description: 'The complete celebration',
      features: [
        'Up to 30 guests',
        '15 Race passes',
        '4 hours party room',
        'Deluxe decorations',
        'Full catering package',
        'Dedicated party host',
      ],
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Stress-Free Planning',
      description: 'We handle all the details so you can focus on having fun',
    },
    {
      icon: Users,
      title: 'All Ages Welcome',
      description: 'Activities and entertainment for kids and adults alike',
    },
    {
      icon: Zap,
      title: 'Unforgettable Fun',
      description: 'High-speed thrills combined with great hospitality',
    },
    {
      icon: Gift,
      title: 'Custom Packages',
      description: 'Tailored solutions for your specific needs and budget',
    },
  ];

  return (
    <div className="w-full -mt-20">
      <section className="relative bg-navy-900 overflow-hidden pt-32 pb-20 min-h-[70vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: 'url(/images/5.jpg)' }}
          />
        </div>
        
        <div 
          className="absolute inset-0 z-5 opacity-10" 
          style={{
            backgroundImage: 'linear-gradient(45deg, var(--color-black) 25%, transparent 25%), linear-gradient(-45deg, var(--color-black) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--color-black) 75%), linear-gradient(-45deg, transparent 75%, var(--color-black) 75%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
          }}
        />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <div className="inline-block mb-6 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-bold tracking-wider">
              EVENTS & PARTIES
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              Celebrate in the <span className="text-red-500">Fast Lane</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Create unforgettable memories with our exciting events, party packages, and racing leagues
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-navy-800 bg-opacity-80 backdrop-blur-sm px-6 py-3 rounded-full border border-red-600 border-opacity-50">
                <PartyPopper className="h-5 w-5 text-red-500" />
                <span className="text-white font-semibold">Birthday Parties</span>
              </div>
              <div className="flex items-center gap-2 bg-navy-800 bg-opacity-80 backdrop-blur-sm px-6 py-3 rounded-full border border-red-600 border-opacity-50">
                <Briefcase className="h-5 w-5 text-red-500" />
                <span className="text-white font-semibold">Corporate Events</span>
              </div>
              <div className="flex items-center gap-2 bg-navy-800 bg-opacity-80 backdrop-blur-sm px-6 py-3 rounded-full border border-red-600 border-opacity-50">
                <Trophy className="h-5 w-5 text-red-500" />
                <span className="text-white font-semibold">Racing Leagues</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%, 0% 100%)' }} />
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16" data-aos="fade-up">
            <div className="inline-block mb-4 px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold tracking-wider">
              EVENT TYPES
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-6">
              Events for Every Occasion
            </h2>
            <p className="text-xl text-gray-600">
              From birthday celebrations to corporate team building, we have the perfect event solution
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {eventTypes.map((eventType, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover-lift border-2 border-gray-100 hover:border-red-400 transition-all duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="relative image-hover h-64 overflow-hidden">
                  <img
                    src={eventType.image}
                    alt={eventType.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-red-600 p-3 rounded-xl shadow-lg">
                    <eventType.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-navy-900 mb-4">
                    {eventType.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {eventType.description}
                  </p>
                  
                  <ul className="space-y-3 mb-6">
                    {eventType.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-gray-700">
                        <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link to="/contact">
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg transition-all hover:scale-105">
                      Book Now
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16" data-aos="fade-up">
            <div className="inline-block mb-4 px-3 py-1 bg-navy-900 text-white rounded-full text-xs font-bold tracking-wider">
              PARTY PACKAGES
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-6">
              Choose Your Package
            </h2>
            <p className="text-xl text-gray-600">
              Select the perfect package for your event or contact us for a custom solution
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-xl p-8 relative hover-lift ${
                  pkg.isPopular ? 'border-2 border-red-600 scale-105' : 'border-2 border-gray-200'
                }`}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-6 py-2 rounded-full shadow-lg flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      MOST POPULAR
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-navy-900 mb-2">{pkg.title}</h3>
                  <p className="text-gray-600 mb-4">{pkg.description}</p>
                  <div className="text-4xl font-bold text-red-600">{pkg.price}</div>
                </div>

                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/contact">
                  <button
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 ${
                      pkg.isPopular
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-navy-900 hover:bg-navy-800 text-white'
                    }`}
                  >
                    Get Started
                  </button>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center" data-aos="fade-up">
            <p className="text-gray-600 mb-4">Need a custom package? We're here to help!</p>
            <a
              href="tel:(346) 932-1266"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105"
            >
              <Phone className="h-5 w-5" />
              Call for Custom Quote
            </a>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div data-aos="fade-right">
              <div className="inline-block mb-4 px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold tracking-wider">
                PARTY ROOM
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-6 leading-tight">
                Private <span className="text-red-600">Party Room</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our private party room is the perfect space for celebrations of all kinds. With comfortable seating, decorations, and space for food and drinks, it's the ideal complement to your racing experience.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start text-gray-700">
                  <Check className="h-6 w-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-navy-900">Accommodates up to 30 guests</span>
                    <p className="text-gray-600 text-sm">Plenty of space for your entire group</p>
                  </div>
                </li>
                <li className="flex items-start text-gray-700">
                  <Check className="h-6 w-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-navy-900">Tables and chairs provided</span>
                    <p className="text-gray-600 text-sm">Full setup included with your rental</p>
                  </div>
                </li>
                <li className="flex items-start text-gray-700">
                  <Check className="h-6 w-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-navy-900">Decorations and setup included</span>
                    <p className="text-gray-600 text-sm">We handle all the party preparation</p>
                  </div>
                </li>
                <li className="flex items-start text-gray-700">
                  <Check className="h-6 w-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-navy-900">Food and beverage options</span>
                    <p className="text-gray-600 text-sm">Snack bar favorites and more available</p>
                  </div>
                </li>
              </ul>
              <Link to="/contact">
                <Button size="lg" variant="primary">
                  Reserve Party Room
                </Button>
              </Link>
            </div>
            <div data-aos="fade-left" className="relative">
              <div className="image-hover rounded-2xl overflow-hidden shadow-2xl h-[500px]">
                <img
                  src="/images/8.jpg"
                  alt="Party room"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-red-600 text-white p-6 rounded-xl shadow-xl">
                <Users className="h-8 w-8 mb-2" />
                <div className="text-2xl font-bold">Up to 30</div>
                <div className="text-red-100">Guests</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-6">
              Why Choose Speedway 146?
            </h2>
            <p className="text-xl text-gray-600">
              We make event planning easy and ensure your celebration is unforgettable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover-lift text-center"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="bg-red-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <PartyPopper className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Book Your Event?
            </h2>
            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Contact us today to discuss your event needs. We'll create a custom package perfect for your celebration!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:(346) 932-1266"
                className="inline-flex items-center justify-center bg-white text-red-600 hover:bg-gray-100 px-10 py-5 rounded-xl font-bold text-xl transition-all hover:scale-105"
              >
                <Phone className="h-6 w-6 mr-3" />
                (346) 932-1266
              </a>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600 text-xl px-10 py-5">
                  Contact Form
                </Button>
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
              <div className="bg-navy-800 bg-opacity-70 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Quick Info
                </h4>
                <ul className="space-y-2 text-white">
                  <li>• Advance booking recommended</li>
                  <li>• Groups of all sizes welcome</li>
                  <li>• Flexible scheduling options</li>
                </ul>
              </div>
              <div className="bg-navy-800 bg-opacity-70 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  What's Included
                </h4>
                <ul className="space-y-2 text-white">
                  <li>• Custom packages available</li>
                  <li>• Dedicated event coordinator</li>
                  <li>• Setup and cleanup included</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;