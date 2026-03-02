import { Shield, Trophy, Users, Zap } from "lucide-react";
import SectionHeading from "../common/SectionHeading.jsx";

const FEATURES = [
  {
    icon: Zap,
    title: "High-Speed Racing",
    description:
      "Experience the thrill of high-speed go-kart racing on our professionally designed track.",
  },
  {
    icon: Users,
    title: "Family Fun",
    description:
      "Perfect for families, birthday parties, and group events. Fun for all ages!",
  },
  {
    icon: Trophy,
    title: "Competitive Racing",
    description:
      "Join our racing leagues and compete for the fastest lap times and championship titles.",
  },
  {
    icon: Shield,
    title: "Flexible Hours",
    description:
      "Open Thursday through Sunday with extended weekend hours for maximum fun.",
  },
];

const FeatureSection = () => (
  <section className="py-20 bg-gray-50">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading
        title="Why Choose Speedway 146?"
        subtitle="We deliver the ultimate racing experience with top-notch facilities and unmatched excitement."
        centered
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {FEATURES.map(({ icon: Icon, title, description }, index) => (
          <div
            key={title}
            className="bg-white p-8 rounded-xl shadow-lg hover-lift text-center"
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-navy-900 mb-4">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeatureSection;
