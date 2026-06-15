import { Shield, Trophy, Users, Zap } from "lucide-react";
import SectionEyebrow from "../common/SectionEyebrow.jsx";

const FEATURES = [
  {
    icon: Zap,
    title: "High-Speed Racing",
    description:
      "Professional outdoor track. Karts geared to your size, run by a crew that knows the surface.",
  },
  {
    icon: Users,
    title: "Family-Friendly",
    description:
      "Kids race kids, adults race adults. Birthdays, group outings, date nights — we run them all.",
  },
  {
    icon: Trophy,
    title: "Leagues & Events",
    description:
      "Racing leagues launching Q1 2026. Compete weekly for the fastest laps on TX-146.",
  },
  {
    icon: Shield,
    title: "Open 7 Days",
    description:
      "Late weekend hours. Walk-ins welcome. Reservations only needed for private parties.",
  },
];

const FeatureSection = () => (
  <section className="py-24 bg-chalk">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div
        className="max-w-3xl mx-auto text-center mb-16"
        data-aos="fade-up"
      >
        <SectionEyebrow tone="light" className="justify-center">
          Why Speedway 146
        </SectionEyebrow>
        <h2 className="mt-5 text-4xl lg:text-5xl font-bold text-asphalt-900">
          Built for speed. Tuned for fun.
        </h2>
        <p className="mt-4 text-lg text-asphalt-600">
          We've kept the things that matter — real karts, real track, real
          marshals — and ditched the arcade fluff.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map(({ icon: Icon, title, description }, index) => (
          <div
            key={title}
            className="group relative bg-white p-8 rounded-lg border border-asphalt-200 hover:border-race-500 hover:shadow-lift transition-[border-color,box-shadow,transform] duration-base ease-snap hover:-translate-y-1"
            data-aos="fade-up"
            data-aos-delay={index * 80}
          >
            <div className="absolute top-0 left-8 h-1 w-12 bg-race-500 rounded-b-sm transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-slow ease-snap" />
            <div className="bg-race-50 w-14 h-14 rounded-md flex items-center justify-center mb-5 group-hover:bg-race-600 transition-colors duration-base ease-snap">
              <Icon className="h-7 w-7 text-race-600 group-hover:text-chalk transition-colors duration-base ease-snap" />
            </div>
            <h3 className="text-xl font-bold text-asphalt-900 mb-3">
              {title}
            </h3>
            <p className="text-asphalt-600 leading-relaxed text-sm">
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeatureSection;
