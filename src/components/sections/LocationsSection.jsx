import {
  BUSINESS_HOURS,
  CLOSED_DAYS_NOTE,
  CONTACT_INFO,
  HOLIDAY_HOURS_NOTE,
} from "../../lib/content/business.js";
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
          href={CONTACT_INFO.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-race-600 hover:text-race-700 transition-colors duration-base font-semibold"
        >
          Get Directions →
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
        <p className="mt-2 text-xs text-asphalt-500 italic">
          {CLOSED_DAYS_NOTE}
        </p>
        <p className="mt-1 text-xs text-asphalt-500 leading-relaxed">
          {HOLIDAY_HOURS_NOTE}
        </p>
      </ContactRow>
    </div>
    <div className="rounded-md overflow-hidden border border-asphalt-200 h-64">
      <iframe
        src={`https://www.google.com/maps?q=${encodeURIComponent(CONTACT_INFO.address)}&output=embed`}
        width="100%"
        height="100%"
        className="border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Speedway 146 — ${CONTACT_INFO.address}`}
      />
    </div>
  </div>
);

export default LocationsSection;
