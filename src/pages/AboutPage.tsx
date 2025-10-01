import React from 'react';
import { Users, Award, Clock, MapPin } from 'lucide-react';

const AboutPage: React.FC = () => {
  const stats = [
    { icon: Users, label: 'Happy Customers', value: '5,000+' },
    { icon: Award, label: 'Years of Experience', value: '5+' },
    { icon: Clock, label: 'Hours of Fun Daily', value: '12+' },
    { icon: MapPin, label: 'Track Length', value: '1/4 Mile' },
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-red-900 via-red-800 to-navy-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              About Speedway 146
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Baytown's premier destination for high-speed go-kart racing and family entertainment
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <stat.icon className="h-12 w-12 mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-red-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <h2 className="text-4xl font-bold text-navy-900 mb-6">
                Our Story
              </h2>
              <p className="text-gray-600 mb-6">
                Speedway 146 was born from a passion for racing and a vision to bring world-class go-kart racing to the Baytown community. We've created a state-of-the-art facility that combines the thrill of high-speed racing with a safe, family-friendly environment.
              </p>
              <p className="text-gray-600 mb-6">
                Our professionally designed track, top-quality karts, and commitment to safety make us the go-to destination for racing enthusiasts, families, and anyone looking for an unforgettable experience.
              </p>
            </div>
            <div data-aos="fade-left" className="image-hover">
              <img
                src="/images/1.jpg"
                alt="Go-kart racing at Speedway 146"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <h2 className="text-4xl font-bold text-navy-900 mb-8">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              What drives us every day
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center" data-aos="fade-up" data-aos-delay="100">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">Community First</h3>
                <p className="text-gray-600">
                  We're proud to be part of the Baytown community and committed to providing a space where families and friends can create lasting memories.
                </p>
              </div>
              
              <div className="text-center" data-aos="fade-up" data-aos-delay="200">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">Excellence</h3>
                <p className="text-gray-600">
                  From our track design to our customer service, we strive for excellence in everything we do to ensure the best possible experience.
                </p>
              </div>
              
              <div className="text-center" data-aos="fade-up" data-aos-delay="300">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">Safety & Fun</h3>
                <p className="text-gray-600">
                  Safety is our top priority, but we never forget that the ultimate goal is to have an amazing, thrilling experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-left" className="image-hover">
              <img
                src="/images/2.jpg"
                alt="Speedway 146 team"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div data-aos="fade-right">
              <h2 className="text-4xl font-bold text-navy-900 mb-6">
                Meet Our Team
              </h2>
              <p className="text-gray-600 mb-6">
                Our experienced team is passionate about racing and dedicated to ensuring every visitor has an incredible experience. From our track marshals to our customer service staff, everyone at Speedway 146 is committed to safety, fun, and excellence.
              </p>
              <p className="text-gray-600">
                Whether you're a first-time racer or a seasoned pro, our team is here to help you make the most of your visit and ensure you leave with a smile.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;