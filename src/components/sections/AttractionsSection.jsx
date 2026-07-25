import { Link } from "react-router-dom";
import Icon from "../common/Icon.jsx";
import SectionEyebrow from "../common/SectionEyebrow.jsx";

const ATTRACTIONS = [
  {
    title: "Outdoor Karting",
    description:
      "Geared karts and full 5-minute heats — if a kart breaks down or there's a caution, the timer stops so you get every second. Kids race kids, adults race adults.",
    image: "/images/22.JPEG",
    icon: "kart",
    features: [
      'Adult karts (53"+)',
      'Kiddie karts (40"+)',
      "Safety glasses provided",
    ],
    accent: "race",
  },
  {
    title: "Bounce Houses",
    description:
      "Indoor, climate-controlled, supervised. Weekday $10 unlimited; weekends $5 / 30-min or $15 all-day.",
    image: "/images/21.JPEG",
    icon: "bouncy-castle",
    features: [
      "Climate-controlled",
      "Cleaned daily",
      "Weekend wristbands",
    ],
    accent: "ignite",
  },
  {
    title: "Party Room",
    description:
      "Private room for up to 60 guests with 20 racing wristbands included. Extra wristbands can be purchased the day of upon request. Tables and chairs set up before you arrive.",
    image: "/images/20.JPEG",
    icon: "cake",
    features: [
      "Up to 60 guests",
      "20 racing wristbands included",
      "Decor 30 min early",
    ],
    accent: "race",
  },
];

const ACCENT = {
  race: {
    badge: "bg-race-600 text-chalk ring-race-300/60",
    seam: "bg-race-600",
    check: "text-race-600",
    link: "text-race-600 group-hover:text-race-700",
    linkRule: "bg-race-600",
    border: "hover:border-race-500",
  },
  ignite: {
    badge: "bg-ignite-500 text-asphalt-950 ring-ignite-300/60",
    seam: "bg-ignite-500",
    check: "text-ignite-600",
    link: "text-ignite-600 group-hover:text-ignite-700",
    linkRule: "bg-ignite-500",
    border: "hover:border-ignite-500",
  },
};

const AttractionsSection = () => (
  <section className="relative py-24 bg-asphalt-50">
    {/* Separates this light band from the dark Gallery above it. */}
    <div
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-asphalt-300 to-transparent"
    />
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-16" data-aos="fade-up">
        <div className="flex justify-center mb-6" aria-hidden="true">
          <span className="block h-[3px] w-10 bg-asphalt-300 rounded-full" />
        </div>
        <SectionEyebrow tone="light" className="justify-center">
          What's On-Site
        </SectionEyebrow>
        <h2 className="mt-5 text-4xl lg:text-5xl font-display tracking-tight leading-[0.95] text-asphalt-900">
          One venue. Three reasons to drive out.
        </h2>
        <p className="mt-4 text-lg text-asphalt-600 leading-relaxed">
          Twenty minutes from Houston, ten minutes from La Porte. Park once,
          stay all afternoon.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {ATTRACTIONS.map(
          ({ title, description, image, icon, features, accent }, index) => {
            const a = ACCENT[accent];
            return (
              <article
                key={title}
                className={`group relative bg-white rounded-lg overflow-hidden border border-asphalt-200 ${a.border} shadow-track hover:shadow-lift hover:-translate-y-1 transition-[border-color,box-shadow,transform] duration-base ease-snap`}
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
                    className={`absolute top-4 right-4 ${a.badge} px-2.5 py-2 rounded-md shadow-lift ring-1 ring-inset`}
                  >
                    <Icon name={icon} className="h-5 w-5" />
                  </div>
                </div>
                <div
                  aria-hidden="true"
                  className={`h-1 ${a.seam}`}
                />
                <div className="p-7">
                  <h3 className="text-3xl font-display tracking-tight leading-none text-asphalt-900 mb-3">
                    {title}
                  </h3>
                  <p className="text-asphalt-600 mb-5 leading-relaxed">
                    {description}
                  </p>
                  <ul className="space-y-1.5 mb-6 border-t border-asphalt-100 pt-4">
                    {features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start text-sm text-asphalt-700 tracking-wide"
                      >
                        <Icon
                          name="check"
                          className={`h-4 w-4 ${a.check} mr-2 mt-0.5 shrink-0`}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/pricing"
                    className={`inline-flex items-center gap-2 font-display tracking-speedway text-sm ${a.link} transition-colors duration-base ease-snap`}
                  >
                    <span className="relative">
                      See Pricing
                      <span
                        aria-hidden="true"
                        className={`absolute left-0 -bottom-0.5 h-[2px] w-6 ${a.linkRule} transition-all duration-base ease-snap group-hover:w-full`}
                      />
                    </span>
                    <Icon
                      name="arrow-right"
                      className="h-4 w-4 transition-transform duration-base ease-snap group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            );
          },
        )}
      </div>
    </div>
  </section>
);

export default AttractionsSection;
