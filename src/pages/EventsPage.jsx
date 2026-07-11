import { Link } from "react-router-dom";
import Button from "../components/common/Button.jsx";
import Icon from "../components/common/Icon.jsx";
import PageHero from "../components/common/PageHero.jsx";
import SectionEyebrow from "../components/common/SectionEyebrow.jsx";
import { SpotlightCard, Magnet } from "../components/reactbits";
import { CONTACT_INFO } from "../lib/content/business.js";

const HERO_BADGES = [
  { icon: "cake", label: "Birthday Parties" },
  { icon: "briefcase", label: "Corporate" },
  { icon: "stopwatch", label: "Thursday Special" },
];

const EVENT_TYPES = [
  {
    title: "Birthday Parties",
    description:
      "Private room rental with 20 racing wristbands included. Staff runs the heats. Decorate 30 minutes before guests arrive. Extra wristbands available day-of upon request.",
    image: "/images/17.JPEG",
    icon: "cake",
    features: [
      "Private room — fits up to 60",
      "20 racing wristbands included",
      "Extra wristbands day-of on request",
      "Bring your own cake & decor",
    ],
  },
  {
    title: "Corporate Outings",
    description:
      "Bring the team. Private heats, bracket or open format — staff handles the lineups so you can focus on giving your coworkers a hard time.",
    image: "/images/18.JPEG",
    icon: "briefcase",
    features: [
      "Private track windows",
      "Bracket or open format",
      "Catering on request",
      "Staff-run heats",
    ],
  },
  {
    title: "Thursday Unlimited Special",
    description:
      "Every Thursday — 2.5 hours of unlimited racing for one flat price. $49.99 plus tax per person. Wristband on the clock from the moment it's issued.",
    image: "/images/19.JPEG",
    icon: "stopwatch",
    features: [
      "Thursdays only",
      "$49.99 + tax per person",
      "2.5 hours of unlimited racing",
      "Adult or Kid karts",
    ],
  },
];

const HOW_IT_WORKS = [
  {
    icon: "phone",
    title: "Call to book",
    text: "20% deposit holds the date. 7-business-day notice for refund. Reconfirm 24 hours out.",
  },
  {
    icon: "calendar",
    title: "Pick a slot",
    text: "Party rooms run in 3-hour blocks. Weekends fill four weeks out — book early for Saturdays.",
  },
  {
    icon: "users",
    title: "Tell us your count",
    text: "Headcount up to 60 inside, more outside on the patio. We staff to size.",
  },
  {
    icon: "flag",
    title: "Show up & race",
    text: "Arrive 30 minutes early to decorate. We handle the rest — heat lineups, wristband distribution, room reset.",
  },
];

const EventsPage = () => (
  <div className="w-full -mt-20">
    <PageHero
      badge="Events & Parties"
      title="Book the"
      titleAccent="track."
      description="Birthdays, corporate outings, Thursday specials. Same venue, same karts — your group, your schedule."
      backgroundImage="/images/14.JPEG"
      dividerColorClass="bg-chalk"
    >
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {HERO_BADGES.map(({ icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 bg-asphalt-800/80 px-5 py-2.5 rounded-md border border-race-600/50"
          >
            <Icon name={icon} className="h-5 w-5 text-race-400" />
            <span className="text-chalk font-display tracking-speedway uppercase text-xs">
              {label}
            </span>
          </div>
        ))}
      </div>
    </PageHero>

    <section className="py-24 bg-chalk">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14" data-aos="fade-up">
          <SectionEyebrow tone="light" className="justify-center">
            Three Formats
          </SectionEyebrow>
          <h2 className="mt-5 text-4xl lg:text-5xl font-bold text-asphalt-900">
            Pick the one that fits your group.
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {EVENT_TYPES.map(
            ({ title, description, image, icon, features }, index) => (
              <div
                key={title}
                className="bg-white rounded-lg shadow-track overflow-hidden border border-asphalt-200 hover:border-race-500 hover:shadow-lift transition-[border-color,box-shadow] duration-base ease-snap"
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
                  <div className="absolute top-4 right-4 bg-race-600 p-3 rounded-md shadow-race">
                    <Icon name={icon} className="h-6 w-6 text-chalk" />
                  </div>
                </div>
                <div className="p-7">
                  <h3 className="text-2xl font-bold text-asphalt-900 mb-3">
                    {title}
                  </h3>
                  <p className="text-asphalt-600 mb-5 leading-relaxed text-sm">
                    {description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start text-asphalt-700 text-sm"
                      >
                        <Icon
                          name="check"
                          className="h-4 w-4 text-race-600 mr-2 mt-0.5 shrink-0"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={CONTACT_INFO.phoneTel}
                    className="block w-full bg-race-600 hover:bg-race-500 text-chalk py-3 rounded-md font-display tracking-speedway uppercase text-sm text-center transition duration-base ease-snap active:scale-95 shadow-race"
                  >
                    Call to Book
                  </a>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </section>

    <section className="py-24 bg-asphalt-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14" data-aos="fade-up">
          <SectionEyebrow tone="light" className="justify-center">
            How Booking Works
          </SectionEyebrow>
          <h2 className="mt-5 text-4xl lg:text-5xl font-bold text-asphalt-900">
            Four steps. No back-and-forth.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map(({ icon, title, text }, index) => (
            <div
              key={title}
              className="bg-white p-7 rounded-lg border border-asphalt-200 hover:border-race-500 hover:shadow-lift transition-[border-color,box-shadow] duration-base ease-snap"
              data-aos="fade-up"
              data-aos-delay={index * 80}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="bg-race-50 w-12 h-12 rounded-md flex items-center justify-center">
                  <Icon name={icon} className="h-6 w-6 text-race-600" />
                </div>
                <span className="font-display text-3xl text-asphalt-200 tracking-tight tabular-nums">
                  0{index + 1}
                </span>
              </div>
              <h3 className="text-lg font-bold text-asphalt-900 mb-2">
                {title}
              </h3>
              <p className="text-asphalt-600 text-sm leading-relaxed">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20 bg-asphalt-900 text-chalk relative overflow-hidden">
      <div className="absolute inset-0 asphalt-grain opacity-60" aria-hidden="true" />
      <div className="absolute top-0 left-0 right-0 h-2 caution-tape" aria-hidden="true" />
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
          <h2 className="font-display text-4xl lg:text-6xl tracking-tight leading-[0.95]">
            Ready to book?
            <span className="block text-race-500">Call the track.</span>
          </h2>
          <p className="mt-6 text-lg text-gray-300 max-w-xl mx-auto leading-relaxed">
            Parties and group bookings happen by phone — it's faster than
            sending forms back and forth.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Magnet padding={70} magnetStrength={4}>
              <a
                href={CONTACT_INFO.phoneTel}
                className="inline-flex items-center justify-center gap-3 bg-race-600 hover:bg-race-500 text-chalk px-8 py-4 rounded-md font-display tracking-speedway uppercase text-lg transition duration-base ease-snap shadow-race active:scale-95"
              >
                <Icon name="phone" className="h-5 w-5" />
                <span className="tabular-nums">{CONTACT_INFO.phone}</span>
              </a>
            </Magnet>
            <Link to="/pricing">
              <Button size="lg" variant="outlineLight">
                See Pricing
              </Button>
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
            <SpotlightCard
              className="bg-asphalt-800/70 rounded-md p-5 border border-asphalt-700"
              spotlightColor="rgba(225,29,42,0.16)"
            >
              <h4 className="font-display tracking-speedway uppercase text-sm mb-3 flex items-center gap-2 text-race-400">
                <Icon name="clock" className="h-4 w-4" />
                What to know
              </h4>
              <ul className="space-y-1.5 text-sm text-chalk/80">
                <li>20% deposit holds the date</li>
                <li>Reconfirm 24 hours before arrival</li>
                <li>7 business days for refund eligibility</li>
              </ul>
            </SpotlightCard>
            <SpotlightCard
              className="bg-asphalt-800/70 rounded-md p-5 border border-asphalt-700"
              spotlightColor="rgba(242,104,0,0.16)"
            >
              <h4 className="font-display tracking-speedway uppercase text-sm mb-3 flex items-center gap-2 text-race-400">
                <Icon name="ticket" className="h-4 w-4" />
                What's included
              </h4>
              <ul className="space-y-1.5 text-sm text-chalk/80">
                <li>Room set up + reset</li>
                <li>Heat scheduling + safety briefing</li>
                <li>Wristbands distributed by staff</li>
              </ul>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default EventsPage;
