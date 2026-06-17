import ContactForm from "../components/forms/ContactForm.jsx";
import LocationsSection from "../components/sections/LocationsSection.jsx";
import Icon from "../components/common/Icon.jsx";
import PageHero from "../components/common/PageHero.jsx";
import SectionEyebrow from "../components/common/SectionEyebrow.jsx";
import { CONTACT_INFO } from "../lib/content/business.js";

const CONTACT_METHODS = [
  {
    icon: "phone",
    title: "Call",
    description: "Fastest for party bookings and group inquiries.",
    info: CONTACT_INFO.phone,
    action: CONTACT_INFO.phoneTel,
    primary: true,
  },
  {
    icon: "mail",
    title: "Email",
    description: "For everything that's not time-sensitive.",
    info: CONTACT_INFO.email,
    action: CONTACT_INFO.emailMailto,
  },
  {
    icon: "map-pin",
    title: "Drive Out",
    description: "Walk-ins welcome — every day we're open.",
    info: "6750 N TX-146, Baytown",
    action: CONTACT_INFO.mapsUrl,
    external: true,
  },
];

const ContactPage = () => (
  <div className="w-full -mt-20">
    <PageHero
      badge="Contact"
      title="Talk to"
      titleAccent="the track."
      description="The fastest way to book is by phone — parties, corporate slots, and group bookings are confirmed live. Form and email work too."
      backgroundImage="/images/22.JPEG"
      dividerColorClass="bg-chalk"
    />

    <section className="py-20 bg-chalk">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto mb-20">
          {CONTACT_METHODS.map((method, index) => (
            <a
              key={method.title}
              href={method.action}
              target={method.external ? "_blank" : undefined}
              rel={method.external ? "noopener noreferrer" : undefined}
              aria-label={`${method.title}: ${method.info}`}
              className={`group p-7 rounded-lg border-2 transition-[border-color,box-shadow,transform] duration-base ease-snap hover:-translate-y-1 hover:shadow-lift ${
                method.primary
                  ? "bg-asphalt-900 text-chalk border-race-500"
                  : "bg-white border-asphalt-200 hover:border-race-500"
              }`}
              data-aos="fade-up"
              data-aos-delay={index * 80}
            >
              <div
                className={`w-12 h-12 rounded-md flex items-center justify-center mb-5 ${
                  method.primary
                    ? "bg-race-600 text-chalk"
                    : "bg-race-50 text-race-600"
                }`}
              >
                <Icon name={method.icon} className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">{method.title}</h3>
              <p
                className={`text-sm mb-4 leading-relaxed ${method.primary ? "text-chalk/70" : "text-asphalt-600"}`}
              >
                {method.description}
              </p>
              <p
                className={`font-bold tabular-nums ${method.primary ? "text-chalk" : "text-asphalt-900"}`}
              >
                {method.info}
              </p>
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
          <div data-aos="fade-right">
            <SectionEyebrow tone="light">Send a Note</SectionEyebrow>
            <h2 className="mt-4 text-3xl lg:text-4xl font-bold text-asphalt-900 mb-3">
              Contact Form
            </h2>
            <p className="text-asphalt-600 mb-8 leading-relaxed">
              We read these the same day. For party deposits and group
              bookings, call instead.
            </p>
            <ContactForm />
          </div>
          <div data-aos="fade-left">
            <SectionEyebrow tone="light">Find Us</SectionEyebrow>
            <h2 className="mt-4 text-3xl lg:text-4xl font-bold text-asphalt-900 mb-3">
              6750 N TX-146
            </h2>
            <p className="text-asphalt-600 mb-8 leading-relaxed">
              Baytown, TX — 20 minutes east of Houston, 10 minutes south of
              the Fred Hartman Bridge. Easy parking, free.
            </p>
            <LocationsSection />
          </div>
        </div>
      </div>
    </section>

    <section className="py-20 bg-asphalt-900 text-chalk relative overflow-hidden">
      <div className="absolute inset-0 asphalt-grain opacity-50" aria-hidden="true" />
      <div className="absolute top-0 left-0 right-0 h-1.5 race-stripe" aria-hidden="true" />
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
          <h2 className="font-display text-4xl lg:text-6xl tracking-tight leading-[0.95]">
            Pick up the phone.
            <span className="block text-race-500">It's the fastest path.</span>
          </h2>
          <p className="mt-6 text-lg text-gray-300 max-w-xl mx-auto leading-relaxed">
            Same number for walk-in questions, party deposits, league rosters,
            and lost-and-found.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={CONTACT_INFO.phoneTel}
              className="inline-flex items-center justify-center gap-3 bg-race-600 hover:bg-race-500 text-chalk px-8 py-4 rounded-md font-display tracking-speedway uppercase text-lg transition duration-base ease-snap shadow-race active:scale-95"
            >
              <Icon name="phone" className="h-5 w-5" />
              <span className="tabular-nums">{CONTACT_INFO.phone}</span>
            </a>
            <a
              href={CONTACT_INFO.emailMailto}
              className="inline-flex items-center justify-center gap-3 border-2 border-chalk/80 hover:bg-chalk hover:text-asphalt-900 text-chalk px-8 py-4 rounded-md font-display tracking-speedway uppercase text-lg transition duration-base ease-snap"
            >
              <Icon name="send" className="h-5 w-5" />
              Email Us
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default ContactPage;
