import {
  Calendar,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
} from "lucide-react";
import ContactForm from "../components/forms/ContactForm.jsx";
import LocationsSection from "../components/sections/LocationsSection.jsx";
import PageHero from "../components/common/PageHero.jsx";
import Pill from "../components/common/Pill.jsx";
import { BUSINESS_HOURS, CONTACT_INFO } from "../lib/content/business.js";

const CONTACT_METHODS = [
  {
    icon: Phone,
    title: "Call Us",
    description: "Speak with our team directly",
    info: CONTACT_INFO.phone,
    action: CONTACT_INFO.phoneTel,
    color: "red",
  },
  {
    icon: Mail,
    title: "Email Us",
    description: "Send us a message anytime",
    info: CONTACT_INFO.email,
    action: CONTACT_INFO.emailMailto,
    color: "navy",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Come see us in person",
    info: CONTACT_INFO.address,
    action: CONTACT_INFO.mapsUrl,
    color: "red",
  },
];

/**
 * Renders the Contact page with contact methods, a contact form, location info, and business hours.
 */
const ContactPage = () => {
  return (
    <div className="w-full -mt-20">
      <PageHero
        badge="GET IN TOUCH"
        title="We're Here to"
        titleAccent="Help"
        description="Have questions or ready to book? Contact us and we'll make your racing experience unforgettable"
        backgroundImage="/images/22.JPEG"
        dividerColorClass="bg-white"
      />
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="max-w-3xl mx-auto text-center mb-16"
            data-aos="fade-up"
          >
            <Pill variant="light" className="mb-4">CONTACT METHODS</Pill>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 mt-4">
              Choose How to Connect
            </h2>
            <p className="text-xl text-gray-600">
              Pick the method that works best for you. We're ready to assist!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            {CONTACT_METHODS.map((method, index) => (
              <a
                key={index}
                href={method.action}
                target={method.icon === MapPin ? "_blank" : undefined}
                rel={method.icon === MapPin ? "noopener noreferrer" : undefined}
                aria-label={`${method.title}: ${method.info}`}
                className={`bg-white p-8 rounded-2xl shadow-xl hover-lift text-center border-2 transition-colors duration-300 ease-out border-gray-200 ${
                  method.color === "red"
                    ? "hover:border-red-500"
                    : "hover:border-gray-600"
                }`}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div
                  className={`${method.color === "red" ? "bg-red-600" : "bg-gray-700"} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                >
                  <method.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {method.title}
                </h3>
                <p className="text-gray-600 mb-4">{method.description}</p>
                <p
                  className={`font-semibold ${method.color === "red" ? "text-red-600" : "text-gray-800"}`}
                >
                  {method.info}
                </p>
              </a>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
            <div data-aos="fade-right">
              <Pill variant="navy" className="mb-4">SEND MESSAGE</Pill>
              <h2 className="text-4xl font-bold text-gray-800 mb-6 mt-4">
                Contact Form
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Fill out the form below and we'll get back to you as soon as
                possible. For immediate assistance, please call us directly.
              </p>
              <ContactForm />
            </div>
            <div data-aos="fade-left">
              <Pill variant="muted" className="mb-4">VISIT US</Pill>
              <h2 className="text-4xl font-bold text-gray-800 mb-6 mt-4">Find Us</h2>
              <p className="text-lg text-gray-600 mb-8">
                We're conveniently located in Baytown, TX. Come visit us during
                our business hours for an unforgettable racing experience!
              </p>
              <LocationsSection />
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="bg-gray-800 text-white p-12">
                  <Pill className="mb-6">BUSINESS HOURS</Pill>
                  <h2 className="text-3xl font-bold mb-8 mt-4">When We're Open</h2>
                  <div className="space-y-4">
                    {BUSINESS_HOURS.map((schedule, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-3 border-b border-white border-opacity-20"
                      >
                        <span className="font-semibold text-lg">
                          {schedule.day}
                        </span>
                        <span
                          className={`${schedule.hours === "Closed" ? "text-red-400" : "text-gray-300"}`}
                        >
                          {schedule.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 p-6 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl">
                    <Clock className="h-8 w-8 mb-3 text-gray-400" />
                    <p className="text-sm text-gray-300">
                      Extended hours on weekends! Visit us Saturday and Sunday
                      from 10:30 AM to 10:30 PM for all-day racing fun.
                    </p>
                  </div>
                </div>
                <div className="text-white p-12 flex flex-col justify-center bg-gradient-to-br from-slate-700 to-slate-800">
                  <MessageSquare className="h-16 w-16 mb-6" />
                  <h3 className="text-3xl font-bold mb-4">
                    Questions About Booking?
                  </h3>
                  <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                    Our team is ready to help you plan the perfect event.
                    Whether it's a birthday party, corporate event, or racing
                    league, we've got you covered.
                  </p>
                  <div className="space-y-4">
                    <a
                      href={CONTACT_INFO.phoneTel}
                      className="flex items-center justify-center gap-3 bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold transition-transform duration-200 ease-out hover:scale-105 active:scale-95"
                    >
                      <Phone className="h-5 w-5" />
                      Call {CONTACT_INFO.phone}
                    </a>
                    <a
                      href={CONTACT_INFO.emailMailto}
                      className="flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-bold transition-colors duration-200 ease-out"
                    >
                      <Send className="h-5 w-5" />
                      Send Email
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-gray-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <Calendar className="h-16 w-16 mx-auto mb-6 text-red-500" />
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Book Your Visit?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Don't wait! Contact us today to reserve your spot for an
              unforgettable racing adventure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:(346) 932-1266"
                className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-xl font-bold text-xl transition-transform duration-200 ease-out hover:scale-105 active:scale-95"
              >
                <Phone className="h-6 w-6 mr-3" />
                Call Now
              </a>
              <a
                href="#contact-form"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center border-2 border-white text-white hover:bg-white hover:text-gray-800 px-10 py-5 rounded-xl font-bold text-xl transition-colors duration-200 ease-out"
              >
                <MessageSquare className="h-6 w-6 mr-3" />
                Send Message
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default ContactPage;
