import React from 'react';
import { Zap, Shield, Trophy, Users } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Zap,
      title: 'High-Speed Racing',
      description: 'Experience the thrill of high-speed go-kart racing on our professionally designed track.',
    },
    {
      icon: Users,
      title: 'Family Fun',
      description: 'Perfect for families, birthday parties, and group events. Fun for all ages!',
    },
    {
      icon: Trophy,
      title: 'Competitive Racing',
      description: 'Join our racing leagues and compete for the fastest lap times and championship titles.',
    },
    {
      icon: Shield,
      title: 'Flexible Hours',
      description: 'Open Thursday through Sunday with extended weekend hours for maximum fun.',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-4">
            Why Choose Speedway 146?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We deliver the ultimate racing experience with top-notch facilities and unmatched excitement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover-lift text-center"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <feature.icon className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;