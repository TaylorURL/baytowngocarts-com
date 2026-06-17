import { Link } from "react-router-dom";
import Button from "../components/common/Button.jsx";
import Icon from "../components/common/Icon.jsx";
import PageHero from "../components/common/PageHero.jsx";
import SectionEyebrow from "../components/common/SectionEyebrow.jsx";
import StatTile from "../components/common/StatTile.jsx";
import { CONTACT_INFO } from "../lib/content/business.js";

const FACTS = [
  { value: "2019", label: "Opened on TX-146", accent: "race" },
  { value: '5"', label: "Suggested Min Age", accent: "ignite" },
  { value: "5:00", label: "Per Heat", accent: "race" },
  { value: "60", label: "Party Room Cap", accent: "chalk" },
];

const TIMELINE = [
  {
    year: "2019",
    icon: "flag",
    title: "Doors open",
    description:
      "Pad poured, fence up, first heat run on a Saturday afternoon in Baytown.",
  },
  {
    year: "2021",
    icon: "wrench",
    title: "Fleet upgrade",
    description:
      "Pulled the original karts, replaced with a fresh fleet — geared adult and kiddie classes split.",
  },
  {
    year: "2023",
    icon: "bouncy-castle",
    title: "Bounce houses added",
    description:
      "Climate-controlled indoor unit added so the under-10 crew has somewhere to be while older siblings race.",
  },
  {
    year: "2026",
    icon: "cake",
    title: "Party room expanded",
    description:
      "Party room reworked to fit up to 60 guests, still with 20 racing wristbands included — extra wristbands available day-of upon request.",
  },
];

const HOUSE_RULES = [
  {
    icon: "helmet",
    title: "Real karts, not arcade rides",
    text: "Geared karts with real speed on an outdoor circuit. We don't run go-cart-shaped go-carts.",
  },
  {
    icon: "stopwatch",
    title: "Full 5 minutes — always",
    text: "If a kart breaks down or there's a caution, the timer stops. Every racer gets their full 5 minutes of track time.",
  },
  {
    icon: "users",
    title: "Kids race kids, adults race adults",
    text: "Separated by class for safety. Birthday parties on the kid side, after-work crews on the adult side.",
  },
  {
    icon: "fuel",
    title: "Outdoor, Thursday – Sunday",
    text: "Open Thursday through Sunday — light rain we run, heavy rain we pause for safety, then resume.",
  },
];

const AboutPage = () => (
  <div className="w-full -mt-20">
    <PageHero
      badge="About"
      title="The track"
      titleAccent="on TX-146."
      description="Six years of running outdoor karts on the same patch of asphalt in Baytown — the long version, in case you want it."
      backgroundImage="/images/16.JPEG"
      dividerColorClass="bg-chalk"
    />

    <section className="py-20 bg-asphalt-900 text-chalk">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12" data-aos="fade-up">
          <SectionEyebrow tone="dark" className="justify-center">
            By the numbers
          </SectionEyebrow>
          <h2 className="mt-5 text-3xl lg:text-4xl font-bold">
            What the venue actually looks like.
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {FACTS.map(({ value, label, accent }, index) => (
            <div
              key={label}
              data-aos="fade-up"
              data-aos-delay={index * 80}
            >
              <StatTile value={value} label={label} accent={accent} />
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-24 bg-chalk">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div data-aos="fade-right">
            <SectionEyebrow tone="light">Why we built it</SectionEyebrow>
            <h2 className="mt-5 text-4xl lg:text-5xl font-bold text-asphalt-900 leading-tight">
              An outdoor track,
              <span className="text-race-600"> twenty minutes from Houston.</span>
            </h2>
            <p className="mt-6 text-lg text-asphalt-700 leading-relaxed">
              The closest serious karting used to be a forty-minute drive west.
              Baytown didn't have a real track — just a few trampoline parks
              with slow electric karts wedged into a corner. We bought the land
              on TX-146, poured asphalt, and stocked it with karts that
              actually go.
            </p>
            <p className="mt-4 text-lg text-asphalt-700 leading-relaxed">
              Full five-minute heats — timer stops on breakdowns and cautions
              so nobody loses time. Safety glasses provided; helmets always
              recommended (bring your own). Easy enough for a seven-year-old's
              birthday, fast enough that grown-ups come back to settle scores.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/pricing">
                <Button size="lg" variant="primary">
                  See Pricing
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline">
                  Visit Us
                </Button>
              </Link>
            </div>
          </div>
          <div data-aos="fade-left" className="relative">
            <div className="image-hover rounded-lg overflow-hidden shadow-lift h-[500px]">
              <img
                src="/images/19.JPEG"
                alt="Speedway 146 outdoor track on TX-146"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-race-600 text-chalk p-6 rounded-md shadow-lift max-w-xs">
              <div className="font-display text-2xl mb-1 tracking-speedway uppercase">
                {CONTACT_INFO.addressLine1}
              </div>
              <div className="text-chalk/80 text-sm">
                {CONTACT_INFO.addressCityState} — exit south of the bridge
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="py-24 bg-asphalt-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14" data-aos="fade-up">
          <SectionEyebrow tone="light" className="justify-center">
            House rules
          </SectionEyebrow>
          <h2 className="mt-5 text-4xl lg:text-5xl font-bold text-asphalt-900">
            How we run the track.
          </h2>
          <p className="mt-4 text-lg text-asphalt-600">
            The non-obvious things about how Speedway 146 actually operates.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {HOUSE_RULES.map(({ icon, title, text }, index) => (
            <div
              key={title}
              className="bg-white p-8 rounded-lg border border-asphalt-200 hover:border-race-500 hover:shadow-lift transition-[border-color,box-shadow] duration-base ease-snap"
              data-aos="fade-up"
              data-aos-delay={index * 80}
            >
              <div className="flex items-start gap-5">
                <div className="bg-race-50 p-3 rounded-md shrink-0">
                  <Icon name={icon} className="h-7 w-7 text-race-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-asphalt-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-asphalt-600 leading-relaxed">{text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-24 bg-chalk">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14" data-aos="fade-up">
          <SectionEyebrow tone="light" className="justify-center">
            Six years on TX-146
          </SectionEyebrow>
          <h2 className="mt-5 text-4xl lg:text-5xl font-bold text-asphalt-900">
            How we got here.
          </h2>
        </div>
        <ol className="max-w-3xl mx-auto space-y-6">
          {TIMELINE.map((item, index) => (
            <li
              key={item.year}
              className="relative bg-asphalt-50 p-6 rounded-lg border border-asphalt-200 flex items-start gap-5"
              data-aos="fade-up"
              data-aos-delay={index * 80}
            >
              <div className="bg-race-600 text-chalk w-14 h-14 rounded-md flex items-center justify-center shadow-race shrink-0">
                <Icon name={item.icon} className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <div className="font-display text-race-600 text-xl tracking-speedway uppercase tabular-nums">
                  {item.year}
                </div>
                <h3 className="text-xl font-bold text-asphalt-900 mt-1 mb-2">
                  {item.title}
                </h3>
                <p className="text-asphalt-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>

    <section className="py-20 bg-asphalt-900 text-chalk relative overflow-hidden">
      <div className="absolute inset-0 asphalt-grain opacity-60" aria-hidden="true" />
      <div className="absolute top-0 left-0 right-0 h-1.5 race-stripe" aria-hidden="true" />
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center" data-aos="fade-up">
          <h2 className="font-display text-4xl lg:text-6xl tracking-tight leading-[0.95]">
            Come run a heat.
            <span className="block text-race-500">First one's $13.99.</span>
          </h2>
          <p className="mt-6 text-lg text-gray-300 max-w-xl mx-auto leading-relaxed">
            Walk-ins Thursday through Sunday. Parties booked by phone.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/pricing">
              <Button size="lg" variant="light">
                See Pricing
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outlineLight">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default AboutPage;
