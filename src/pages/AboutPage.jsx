import Button from "../components/ui/Button.jsx";
import Icon from "../components/ui/Icon.jsx";
import PageHero from "../components/layout/PageHero.jsx";
import SectionEyebrow from "../components/ui/SectionEyebrow.jsx";
import StatTile from "../components/ui/StatTile.jsx";
import SpotlightCard from "../components/reactbits/SpotlightCard.jsx";
import TiltedCard from "../components/reactbits/TiltedCard.jsx";
import Magnet from "../components/reactbits/Magnet.jsx";
import { CONTACT_INFO } from "../lib/content/business.js";
import RouteMeta from "../components/shell/RouteMeta.jsx";
import { SHARE_IMAGE, SITE_URL } from "../lib/seo/schema.js";

export const metadata = {
  title: "About Speedway 146 | Baytown Go-Kart Track",
  description:
    "Speedway 146 has run outdoor kart racing in Baytown since 2019. The track, the karts, the safety rules and the people running the heats.",
  canonical: "/about",
  heroImage: "/images/16.webp",
  robots: "index, follow",
  crumbs: [{ name: "About", path: "/about" }],
  openGraph: {
    "og:title": "About Speedway 146 | Baytown Go-Kart Track",
    "og:description":
      "Speedway 146 has run outdoor kart racing in Baytown since 2019. The track, the karts, the safety rules and the people running the heats.",
    "og:url": SITE_URL + "/about",
    "og:image": SHARE_IMAGE,
    "og:type": "website",
  },
};

const FACTS = [
  { value: "2019", label: "Opened on TX-146", accent: "race" },
  { value: "5", label: "Suggested Min Age", accent: "ignite" },
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
      "Pulled the original karts, replaced with a fresh fleet, geared adult and kiddie classes split.",
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
      "Party room reworked to fit up to 60 guests, still with 20 racing wristbands included, with extra wristbands available day-of upon request.",
  },
];

const HOUSE_RULES = [
  {
    icon: "helmet",
    title: "Real karts, not arcade rides",
    text: "Geared karts with real speed on an outdoor circuit. We don't run go-kart-shaped go-karts.",
  },
  {
    icon: "stopwatch",
    title: "Full 5 minutes, always",
    text: "If a kart breaks down or there's a caution, the timer stops. Every racer gets their full 5 minutes of track time.",
  },
  {
    icon: "users",
    title: "Kids race kids, adults race adults",
    text: "Separated by class for safety. Birthday parties on the kid side, after-work crews on the adult side.",
  },
  {
    icon: "fuel",
    title: "Outdoor, Thursday to Sunday",
    text: "Open Thursday through Sunday. Light rain we run, heavy rain we pause for safety, then resume.",
  },
];

const AboutPage = () => (
  <div className="w-full -mt-20">
    <RouteMeta metadata={metadata} />
    <PageHero
      badge="About"
      heading={
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-chalk leading-[0.95] tracking-tight">
          The track <span className="text-race-500">on TX-146.</span>
        </h1>
      }
      crumbs={metadata.crumbs}
      description="Speedway 146 is an outdoor go-kart track on TX-146 in Baytown. Seven years on the same patch of asphalt, the long version, in case you want it."
      backgroundImage="/images/16.webp"
    />

    <section className="py-20 bg-asphalt-900 text-chalk">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12" data-aos="fade">
          <SectionEyebrow tone="dark" className="justify-center">
            By the numbers
          </SectionEyebrow>
          <h2 className="mt-5 text-3xl lg:text-4xl font-bold">
            What the venue actually looks like.
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {FACTS.map(({ value, label, accent }, index) => (
            <div key={label} data-aos="fade" data-aos-delay={index * 80}>
              <SpotlightCard
                className="h-full rounded-lg border border-asphalt-700/60 bg-asphalt-950/40 px-4 py-7"
                spotlightColor="var(--spotlight-race)"
              >
                <StatTile value={value} label={label} accent={accent} />
              </SpotlightCard>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-24 bg-chalk">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div data-aos="fade">
            <SectionEyebrow tone="light">Why we built it</SectionEyebrow>
            <h2 className="mt-5 text-4xl lg:text-5xl font-bold text-asphalt-900 leading-tight">
              An outdoor track,
              <span className="text-race-600">
                {" "}
                twenty minutes from Houston.
              </span>
            </h2>
            <p className="mt-6 text-lg text-asphalt-700 leading-relaxed">
              The closest serious karting used to be a forty-minute drive west.
              Baytown had trampoline parks with slow electric karts wedged into
              a corner.
            </p>
            <p className="mt-4 text-lg text-asphalt-700 leading-relaxed">
              We bought the land on TX-146, poured asphalt, and stocked it with
              karts that actually go.
            </p>
            <p className="mt-4 text-lg text-asphalt-700 leading-relaxed">
              Full five-minute heats, timer stopping on breakdowns and cautions
              so nobody loses time. Safety glasses provided, helmets always
              recommended.
            </p>
            <p className="mt-4 text-lg text-asphalt-700 leading-relaxed">
              Easy enough for a seven-year-old's birthday, fast enough that
              grown-ups come back to settle scores.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/pricing" size="lg" variant="primary">
                See Pricing
              </Button>
              <Button to="/contact" size="lg" variant="outline">
                Visit Us
              </Button>
            </div>
          </div>
          <div data-aos="fade" className="relative">
            <TiltedCard
              imageSrc="/images/19.webp"
              imageSizes="(min-width: 1024px) 45vw, 92vw"
              altText="Speedway 146 outdoor track on TX-146"
              containerHeight="500px"
              containerWidth="100%"
              imageHeight="100%"
              imageWidth="100%"
              scaleOnHover={1.05}
              rotateAmplitude={9}
              showTooltip={false}
            />
            <div className="absolute -bottom-6 -left-6 z-10 bg-race-600 text-chalk p-6 rounded-md shadow-lift max-w-xs">
              <div className="font-display text-2xl mb-1 tracking-speedway uppercase">
                {CONTACT_INFO.addressLine1}
              </div>
              <div className="text-chalk/80 text-sm">
                {CONTACT_INFO.addressCityState}, exit south of the bridge
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="py-24 bg-asphalt-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14" data-aos="fade">
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
              data-aos="fade"
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
        <div className="max-w-3xl mx-auto text-center mb-14" data-aos="fade">
          <SectionEyebrow tone="light" className="justify-center">
            Seven years on TX-146
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
              data-aos="fade"
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
      <div
        className="absolute inset-0 pointer-events-none asphalt-grain opacity-60"
        aria-hidden="true"
      />
      <div
        className="absolute top-0 left-0 right-0 h-1.5 race-stripe"
        aria-hidden="true"
      />
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center" data-aos="fade">
          <h2 className="font-display text-4xl lg:text-6xl tracking-tight leading-[0.95]">
            Come run a heat.
            <span className="block text-race-500">First one's $13.99.</span>
          </h2>
          <p className="mt-6 text-lg text-gray-300 max-w-xl mx-auto leading-relaxed">
            Walk-ins Thursday through Sunday. Parties booked by phone.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Magnet padding={70} magnetStrength={4}>
              <Button to="/pricing" size="lg" variant="light">
                See Pricing
              </Button>
            </Magnet>
            <Button to="/contact" size="lg" variant="outlineLight">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default AboutPage;
