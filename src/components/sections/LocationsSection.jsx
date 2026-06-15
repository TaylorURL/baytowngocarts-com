import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { BUSINESS_HOURS, CONTACT_INFO } from "../../lib/content/business.js";
/** Renders an icon, label, and content row used in the contact info list. */
const ContactRow = ({ icon: Icon, label, children }) => (
  <div className="flex items-start space-x-4">
    <div className="bg-gray-100 p-3 rounded-full">
      <Icon className="h-6 w-6 text-gray-500" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{label}</h3>
      {children}
    </div>
  </div>
);
/**
 * Displays business contact details (address, phone, email, hours)
 * alongside an embedded Google Maps iframe.
 */
const LocationsSection = () => (
  <div className="space-y-6">
    <div className="space-y-4">
      <ContactRow icon={MapPin} label="Address">
        <p className="text-gray-600">{CONTACT_INFO.address}</p>
      </ContactRow>
      <ContactRow icon={Phone} label="Phone">
        <p className="text-gray-600">{CONTACT_INFO.phone}</p>
      </ContactRow>
      <ContactRow icon={Mail} label="Email">
        <p className="text-gray-600">{CONTACT_INFO.email}</p>
      </ContactRow>
      <ContactRow icon={Clock} label="Hours">
        <div className="text-gray-600 space-y-1">
          {BUSINESS_HOURS.map((schedule, index) => (
            <p key={index}>
              <span className="font-medium">{schedule.day}:</span>{" "}
              {schedule.hours}
            </p>
          ))}
        </div>
      </ContactRow>
    </div>
    <div className="bg-gray-200 rounded-lg h-64 overflow-hidden">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3464.8234567890123!2d-94.9876543210987!3d29.7654321098765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640c0123456789a%3A0x1234567890abcdef!2s6750%20N%20Tx-146%2C%20Baytown%2C%20TX%2077523!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
        width="100%"
        height="100%"
        className="border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Speedway 146 Location"
      />
    </div>
  </div>
);
export default LocationsSection;
