import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Phone, Zap } from "lucide-react";
import Button from "../common/Button.jsx";
import { CONTACT_INFO } from "../../lib/constants.js";

/**
 * Bold call-to-action banner with pricing and event links,
 * plus a phone number for direct contact.
 */
const ActionSection = () => (
  <section
    className="py-20 text-white relative overflow-hidden"
    style={{
      background:
        "linear-gradient(135deg, #334155 0%, #1e293b 50%, #0f172a 100%)",
    }}
  >
    <div className="absolute inset-0 opacity-5">
      <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl" />
    </div>

    <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-4xl mx-auto" data-aos="fade-up">
        <Zap className="h-16 w-16 mx-auto mb-6 text-gray-300" />
        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
          Ready for an Unforgettable Experience?
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Bring your family and friends to Speedway 146 for a day filled with
          racing, bouncing, and creating memories that last a lifetime
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/pricing">
            <Button
              size="lg"
              variant="primary"
              className="text-xl px-10 py-5 flex items-center gap-3"
            >
              <span>View Pricing</span>
              <ArrowRight className="h-6 w-6" />
            </Button>
          </Link>

          <Link to="/events">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-800 text-xl px-10 py-5 flex items-center gap-3"
            >
              <Calendar className="h-6 w-6" />
              <span>Plan Your Event</span>
            </Button>
          </Link>
        </div>

        <div className="mt-12 pt-12 border-t border-white border-opacity-20">
          <p className="text-gray-400 mb-4">
            Need help planning? Give us a call!
          </p>
          <a
            href={`tel:${CONTACT_INFO.phone}`}
            className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105"
          >
            <Phone className="h-5 w-5" />
            {CONTACT_INFO.phone}
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default ActionSection;
