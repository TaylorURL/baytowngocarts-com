import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Baby, Check, PartyPopper, Zap } from "lucide-react";

const AttractionsSection = () => {
  const attractions = [
    {
      title: "Go-Kart Racing",
      description:
        "Professional racing karts on our challenging outdoor track designed for maximum excitement and adrenaline.",
      image: "/images/22.JPEG",
      icon: Zap,
      features: ["Professional Karts", "Timed Races", "Safety Gear Included"],
      color: "red",
    },
    {
      title: "Bounce Houses",
      description:
        "Multiple inflatable attractions perfect for kids parties and family fun in a safe, supervised environment.",
      image: "/images/21.JPEG",
      icon: Baby,
      features: ["Multiple Themes", "All Ages Welcome", "Safe & Clean"],
      color: "navy",
    },
    {
      title: "Party Rooms",
      description:
        "Private party spaces available for birthdays, corporate events, and celebrations of all kinds.",
      image: "/images/20.JPEG",
      icon: PartyPopper,
      features: ["Private Spaces", "Catering Available", "Event Planning"],
      color: "red",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16" data-aos="fade-up">
          <div className="inline-block mb-4 px-3 py-1 bg-navy-900 text-white rounded-full text-xs font-bold tracking-wider">
            ATTRACTIONS
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-6">
            Our Attractions
          </h2>
          <p className="text-xl text-gray-600">
            Discover all the exciting activities and amenities we have to offer
            for your next adventure
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {attractions.map((attraction, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover-lift border-2 border-gray-100 hover:border-red-400 transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="relative image-hover h-64 overflow-hidden">
                <img
                  src={attraction.image}
                  alt={attraction.title}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute top-4 right-4 ${attraction.color === "red" ? "bg-red-600" : "bg-navy-900"} p-3 rounded-xl shadow-lg`}
                >
                  <attraction.icon className="h-6 w-6 text-white" />
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-bold text-navy-900 mb-4">
                  {attraction.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {attraction.description}
                </p>

                <ul className="space-y-3 mb-6">
                  {attraction.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start text-gray-700"
                    >
                      <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/pricing"
                  className={`inline-flex items-center ${attraction.color === "red" ? "text-red-600 hover:text-red-700" : "text-navy-900 hover:text-navy-800"} font-bold transition-colors group`}
                >
                  Learn More
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AttractionsSection;
