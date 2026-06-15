import Icon from "../common/Icon.jsx";
import SectionEyebrow from "../common/SectionEyebrow.jsx";

const FEATURES = [
  {
    icon: "stopwatch",
    title: "5-Minute Heats",
    description:
      "Every race is a clean 5 minutes on the timer. If a kart fails mid-heat, you get the rest of your time on the next race.",
  },
  {
    icon: "flag",
    title: "Lap Timing",
    description:
      "Outdoor track, transponder timing, posted leaderboard. Bring your friends — we'll tell you who's fastest.",
  },
  {
    icon: "trophy",
    title: "Leagues Q1 2026",
    description:
      "Eight-week racing leagues launching Q1 2026. Same drivers, same karts, points carry over week to week.",
  },
  {
    icon: "helmet",
    title: "Gear Provided",
    description:
      "Helmets stocked in every size from kids to XL. Bring your own if you'd rather — that's allowed too.",
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
          Real karting. No arcade fluff.
        </h2>
        <p className="mt-4 text-lg text-asphalt-600">
          We're not a screen, not a simulator, not a trampoline park with a
          slow track in the back. It's an actual outdoor circuit on TX-146.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map(({ icon, title, description }, index) => (
          <div
            key={title}
            className="group relative bg-white p-8 rounded-lg border border-asphalt-200 hover:border-race-500 hover:shadow-lift transition-[border-color,box-shadow,transform] duration-base ease-snap hover:-translate-y-1"
            data-aos="fade-up"
            data-aos-delay={index * 80}
          >
            <div className="absolute top-0 left-8 h-1 w-12 bg-race-500 rounded-b-sm transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-slow ease-snap" />
            <div className="bg-race-50 w-14 h-14 rounded-md flex items-center justify-center mb-5 group-hover:bg-race-600 transition-colors duration-base ease-snap">
              <Icon
                name={icon}
                className="h-7 w-7 text-race-600 group-hover:text-chalk transition-colors duration-base ease-snap"
              />
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
