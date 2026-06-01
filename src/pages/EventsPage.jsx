import {
  Briefcase,
  Cake,
  Check,
  Clock,
  Gift,
  PartyPopper,
  Phone,
  Shield,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button.jsx";
import { CONTACT_INFO } from "../lib/constants.js";
const HERO_BADGES = [
  { icon: PartyPopper, label: "Birthday Parties" },
  { icon: Briefcase, label: "Corporate Events" },
  { icon: Trophy, label: "Racing Leagues" },
];
const EVENT_TYPES = [
  {
    title: "Birthday Parties",
    description:
      "Make your birthday unforgettable with high-speed racing and our private party room.",
    image: "/images/17.JPEG",
    icon: Cake,
    features: [
      "Private party room for 45 guests",
      "Racing packages included",
      "Food & drinks available",
      "Party decorations & setup",
    ],
  },
  {
    title: "Corporate Events",
    description:
      "Team building activities and corporate entertainment that your team will love.",
    image: "/images/18.JPEG",
    icon: Briefcase,
    features: [
      "Team building races",
      "Private track time available",
      "Catering options",
      "Meeting space included",
    ],
  },
  {
    title: "Racing Leagues",
    description:
      "Join our competitive racing leagues and compete for championship titles.",
    image: "/images/19.JPEG",
    icon: Trophy,
    features: [
      "Weekly competitive races",
      "Championship points system",
      "Trophies & prizes",
      "Professional lap timing",
    ],
  },
];
const BENEFITS = [
  {
    icon: Shield,
    title: "Stress-Free Planning",
    description: "We handle all the details so you can focus on having fun",
  },
  {
    icon: Users,
    title: "All Ages Welcome",
    description: "Activities and entertainment for kids and adults alike",
  },
  {
    icon: Zap,
    title: "Unforgettable Fun",
    description: "High-speed thrills combined with great hospitality",
  },
  {
    icon: Gift,
    title: "Custom Packages",
    description: "Tailored solutions for your specific needs and budget",
  },
];
const CTA_INFO_CARDS = [
  {
    icon: Clock,
    title: "Quick Info",
    items: [
      "Advance booking recommended",
      "Groups of all sizes welcome",
      "Flexible scheduling options",
    ],
  },
  {
    icon: Gift,
    title: "What's Included",
    items: [
      "Custom packages available",
      "Dedicated event coordinator",
      "Setup and cleanup included",
    ],
  },
];
/** Renders the Events page showcasing birthday parties, corporate events, and racing leagues. */
const EventsPage = () => (
  <div className="w-full -mt-20">
    {/* Hero */}
    <section className="relative bg-navy-900 overflow-hidden pt-32 pb-20 min-h-[70vh] flex items-center">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center opacity-30 bg-[url('/images/14.JPEG')]" />
      </div>
      {/* Decorative checkerboard overlay */}
      <div className="absolute inset-0 z-5 opacity-10 checker-overlay" />
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
          <div className="inline-block mb-6 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-display tracking-widest">
            EVENTS & PARTIES
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-white leading-tight">
            Celebrate in the <span className="text-red-500">Fast Lane</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Create unforgettable memories with our exciting events, party
            packages, and racing leagues
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {HERO_BADGES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 bg-navy-800 bg-opacity-80 backdrop-blur-sm px-6 py-3 rounded-full border border-red-600 border-opacity-50"
              >
                <Icon className="h-5 w-5 text-red-500" />
                <span className="text-white font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white [clip-path:polygon(0_100%,100%_0,100%_100%,0%_100%)]" />
    </section>
    {/* Event Types */}
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16" data-aos="fade-up">
          <div className="inline-block mb-4 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-display tracking-widest">
            EVENT TYPES
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            Events for Every Occasion
          </h2>
          <p className="text-xl text-gray-600">
            From birthday celebrations to corporate team building, we have the
            perfect event solution
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {EVENT_TYPES.map((eventType, index) => (
            <div
              key={eventType.title}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover-lift border-2 border-gray-100 hover:border-red-500 transition-colors duration-300 ease-out"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="relative image-hover h-64 overflow-hidden">
                <img
                  src={eventType.image}
                  alt={eventType.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-red-600 p-3 rounded-xl shadow-lg">
                  <eventType.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {eventType.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {eventType.description}
                </p>
                <ul className="space-y-3 mb-6">
                  {eventType.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start text-gray-700"
                    >
                      <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className="block w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg transition-transform duration-200 ease-out hover:scale-105 active:scale-95 text-center"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    {/* Benefits */}
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            Why Choose Speedway 146?
          </h2>
          <p className="text-xl text-gray-600">
            We make event planning easy and ensure your celebration is
            unforgettable
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {BENEFITS.map((benefit, index) => (
            <div
              key={benefit.title}
              className="bg-white p-8 rounded-2xl shadow-lg hover-lift text-center"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="bg-red-50 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                <benefit.icon className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
    {/* CTA */}
    <section className="py-24 text-white bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
          <PartyPopper className="h-16 w-16 mx-auto mb-6 text-red-500" />
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Book Your Event?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact us today to discuss your event needs. We'll create a custom
            package perfect for your celebration!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${CONTACT_INFO.phone}`}
              className="inline-flex items-center justify-center bg-white text-red-600 hover:bg-gray-100 px-10 py-5 rounded-xl font-bold text-xl transition-transform duration-200 ease-out hover:scale-105 active:scale-95"
            >
              <Phone className="h-6 w-6 mr-3" />
              {CONTACT_INFO.phone}
            </a>
            <Link to="/pricing">
              <Button
                size="lg"
                variant="outlineLight"
                className="text-xl px-10 py-5"
              >
                View Pricing
              </Button>
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
            {CTA_INFO_CARDS.map(({ icon: Icon, title, items }) => (
              <div
                key={title}
                className="bg-gray-700 bg-opacity-70 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20"
              >
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {title}
                </h4>
                <ul className="space-y-2 text-white">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </div>
);
export default EventsPage;
