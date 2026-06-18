import Icon from "../common/Icon.jsx";
import SectionEyebrow from "../common/SectionEyebrow.jsx";

const FEATURES = [
  {
    icon: "stopwatch",
    title: "Full 5 Minutes — Always",
    description:
      "If a kart breaks down or there's a caution, the timer stops. Every racer gets their full 5 minutes of track time, no exceptions.",
  },
  {
    icon: "flag",
    title: "Outdoor Track",
    description:
      "Real outdoor speedway on TX-146 — geared karts, family-friendly layout, kids race kids and adults race adults.",
  },
  {
    icon: "helmet",
    title: "Safety Glasses Provided",
    description:
      "We provide safety glasses for every rider. Helmets aren't included but are always recommended — bring your own and wear it.",
  },
  {
    icon: "cake",
    title: "Party Room for 60",
    description:
      "Private party room fits up to 60 guests with 20 racing wristbands included. Extra wristbands available day-of upon request.",
  },
];

const FeatureSection = () => (
  <section className="relative py-24 bg-chalk overflow-hidden">
    {/* Hairline chrome rule across the very top of the section */}
    <div
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-asphalt-200 to-transparent"
    />

    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div
        className="max-w-3xl mx-auto text-center mb-16"
        data-aos="fade-up"
      >
        {/* Pit-board accent rule above the eyebrow */}
        <div className="flex justify-center mb-5">
          <span
            aria-hidden="true"
            className="block h-[3px] w-10 race-stripe rounded-full"
          />
        </div>
        <SectionEyebrow tone="light" className="justify-center">
          Why Speedway 146
        </SectionEyebrow>
        <h2 className="mt-5 font-display tracking-speedway text-5xl lg:text-6xl text-asphalt-900">
          Real karting. No arcade fluff.
        </h2>
        <p className="mt-4 text-lg text-asphalt-600">
          We're not a screen, not a simulator, not a trampoline park with a
          slow track in the back. It's an actual outdoor circuit on TX-146.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map(({ icon, title, description }, index) => {
          const label = String(index + 1).padStart(2, "0");
          const total = String(FEATURES.length).padStart(2, "0");
          return (
            <div
              key={title}
              className="group relative bg-white p-8 pt-9 rounded-lg border border-asphalt-200 hover:border-race-500 hover:shadow-lift transition-[border-color,box-shadow,transform] duration-base ease-snap hover:-translate-y-1"
              data-aos="fade-up"
              data-aos-delay={index * 80}
            >
              {/* Edge-to-edge race-stripe ribbon that paints on hover */}
              <div
                aria-hidden="true"
                className="absolute top-0 inset-x-0 h-[3px] race-stripe rounded-t-lg origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-slow ease-snap"
              />

              {/* Pit-board index — top-right corner */}
              <div className="absolute top-4 right-5 font-display tracking-speedway text-xs text-asphalt-400 tabular-nums group-hover:text-race-600 transition-colors duration-base ease-snap">
                {label}
                <span className="text-asphalt-300 mx-1">/</span>
                <span className="text-asphalt-300">{total}</span>
              </div>

              {/* Icon plate with chrome ring */}
              <div className="relative bg-race-50 ring-1 ring-inset ring-asphalt-200/70 w-12 h-12 rounded-md flex items-center justify-center mb-6 group-hover:bg-race-600 group-hover:ring-race-700 transition-colors duration-base ease-snap">
                <Icon
                  name={icon}
                  className="h-6 w-6 text-race-600 group-hover:text-chalk transition-colors duration-base ease-snap"
                />
              </div>

              <h3 className="font-display tracking-speedway text-2xl text-asphalt-900 leading-none">
                {title}
              </h3>

              {/* Hairline divider — draws in on hover */}
              <div
                aria-hidden="true"
                className="mt-3 mb-4 h-px bg-asphalt-200 origin-left scale-x-50 group-hover:scale-x-100 group-hover:bg-race-500 transition-[transform,background-color] duration-slow ease-snap"
              />

              <p className="text-asphalt-600 leading-relaxed text-sm">
                {description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default FeatureSection;
