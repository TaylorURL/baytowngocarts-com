import { Link } from "react-router-dom";
import { ArrowRight, Baby, Check, PartyPopper, Zap } from "lucide-react";
import SectionEyebrow from "../common/SectionEyebrow.jsx";

const ATTRACTIONS = [
  {
    title: "Go-Kart Racing",
    description:
      "Outdoor track, geared karts, real lap times. The main event.",
    image: "/images/22.JPEG",
    icon: Zap,
    features: ["Pro-grade karts", "Timed 5-min heats", "Gear provided"],
    accent: "race",
  },
  {
    title: "Bounce Houses",
    description:
      "Climate-controlled, supervised, perfect for the under-10 crew.",
    image: "/images/21.JPEG",
    icon: Baby,
    features: ["All-ages safe", "Clean daily", "Weekend wristbands"],
    accent: "ignite",
  },
  {
    title: "Party Rooms",
    description:
      "Private space for 45. Tables, chairs, staff. You just show up.",
    image: "/images/20.JPEG",
    icon: PartyPopper,
    features: ["Up to 45 guests", "Catering options", "Setup included"],
    accent: "race",
  },
];

const ACCENT = {
  race: {
    badge: "bg-race-600 text-chalk",
    link: "text-race-600 group-hover:text-race-700",
    border: "hover:border-race-500",
  },
  ignite: {
    badge: "bg-ignite-500 text-asphalt-950",
    link: "text-ignite-600 group-hover:text-ignite-700",
    border: "hover:border-ignite-500",
  },
};

const AttractionsSection = () => (
  <section className="py-24 bg-asphalt-50">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-16" data-aos="fade-up">
        <SectionEyebrow tone="light" className="justify-center">
          What's On-Site
        </SectionEyebrow>
        <h2 className="mt-5 text-4xl lg:text-5xl font-bold text-asphalt-900">
          Three reasons to drive out.
        </h2>
        <p className="mt-4 text-lg text-asphalt-600">
          One ticket, one venue, three completely different ways to spend the
          afternoon.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {ATTRACTIONS.map(
          (
            { title, description, image, icon: Icon, features, accent },
            index,
          ) => {
            const a = ACCENT[accent];
            return (
              <div
                key={title}
                className={`group bg-white rounded-lg overflow-hidden border border-asphalt-200 ${a.border} shadow-track hover:shadow-lift hover:-translate-y-1 transition-[border-color,box-shadow,transform] duration-base ease-snap`}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="relative image-hover h-64 overflow-hidden">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-asphalt-950/60 via-transparent to-transparent" />
                  <div
                    className={`absolute top-4 right-4 ${a.badge} p-3 rounded-md shadow-lift`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="p-7">
                  <h3 className="text-2xl font-bold text-asphalt-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-asphalt-600 mb-5 leading-relaxed">
                    {description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start text-sm text-asphalt-700"
                      >
                        <Check className="h-4 w-4 text-race-600 mr-2 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/pricing"
                    className={`inline-flex items-center gap-2 font-bold text-sm tracking-wide ${a.link} transition-colors duration-base ease-snap`}
                  >
                    See Pricing
                    <ArrowRight className="h-4 w-4 transition-transform duration-base ease-snap group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          },
        )}
      </div>
    </div>
  </section>
);

export default AttractionsSection;
