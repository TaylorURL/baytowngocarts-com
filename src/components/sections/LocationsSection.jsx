import { BUSINESS_HOURS, CONTACT_INFO } from "../../lib/content/business.js";
import Icon from "../common/Icon.jsx";

const ContactRow = ({ icon, label, children }) => (
  <div className="flex items-start gap-4">
    <div className="bg-asphalt-100 p-3 rounded-md text-race-600">
      <Icon name={icon} className="h-5 w-5" />
    </div>
    <div>
      <h3 className="text-xs font-display tracking-speedway uppercase text-asphalt-500 mb-1">
        {label}
      </h3>
      <div className="text-asphalt-800 font-medium">{children}</div>
    </div>
  </div>
);

const LocationsSection = () => (
  <div className="space-y-6">
    <div className="space-y-4">
      <ContactRow icon="map-pin" label="Address">
        <p>{CONTACT_INFO.address}</p>
        <a
          href={CONTACT_INFO.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-race-600 hover:text-race-700 transition-colors duration-base font-semibold"
        >
          Open in Google Maps →
        </a>
      </ContactRow>
      <ContactRow icon="phone" label="Phone">
        <a
          href={CONTACT_INFO.phoneTel}
          className="tabular-nums hover:text-race-600 transition-colors duration-base"
        >
          {CONTACT_INFO.phone}
        </a>
      </ContactRow>
      <ContactRow icon="mail" label="Email">
        <a
          href={CONTACT_INFO.emailMailto}
          className="hover:text-race-600 transition-colors duration-base break-all"
        >
          {CONTACT_INFO.email}
        </a>
      </ContactRow>
      <ContactRow icon="clock" label="Hours">
        <ul className="space-y-1 text-sm tabular-nums">
          {BUSINESS_HOURS.map(({ day, hours }) => (
            <li key={day} className="flex items-baseline justify-between gap-4">
              <span className="font-semibold">{day}</span>
              <span className="text-asphalt-600">{hours}</span>
            </li>
          ))}
        </ul>
      </ContactRow>
    </div>
    <div className="rounded-md overflow-hidden border border-asphalt-200 h-64">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3464.8234567890123!2d-94.9876543210987!3d29.7654321098765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640c0123456789a%3A0x1234567890abcdef!2s6750%20N%20Tx-146%2C%20Baytown%2C%20TX%2077523!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
        width="100%"
        height="100%"
        className="border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Speedway 146 — 6750 N TX-146, Baytown TX"
      />
    </div>
  </div>
);

export default LocationsSection;
