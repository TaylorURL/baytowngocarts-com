import { Link } from "react-router-dom";
import { NAV_ITEMS } from "../../lib/content/navigation.js";
import {
  BUSINESS_HOURS,
  CONTACT_INFO,
  SOCIAL_URLS,
} from "../../lib/content/business.js";
import Icon from "./Icon.jsx";
import Wordmark from "./Wordmark.jsx";

const SOCIAL_LINKS = [
  { label: "Facebook", href: SOCIAL_URLS.facebook, icon: "facebook" },
  { label: "Instagram", href: SOCIAL_URLS.instagram, icon: "instagram" },
  { label: "TikTok", href: SOCIAL_URLS.tiktok, icon: "tiktok" },
];

const SocialLink = ({ href, label, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-asphalt-800 text-gray-300 hover:bg-race-600 hover:text-chalk hover:-translate-y-0.5 transition-[background-color,color,transform] duration-base ease-snap"
    aria-label={label}
  >
    <Icon name={icon} className="h-4 w-4" />
  </a>
);

const ContactRow = ({ icon, children, alignTop }) => (
  <div
    className={`flex gap-3 ${alignTop ? "items-start" : "items-center"} text-gray-300`}
  >
    <Icon
      name={icon}
      className={`h-4 w-4 text-race-500 flex-shrink-0 ${alignTop ? "mt-1" : ""}`}
    />
    <span>{children}</span>
  </div>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="relative bg-asphalt-900 text-chalk">
      <div className="h-1.5 race-stripe" aria-hidden="true" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-5">
            <Wordmark to={null} size="md" tone="dark" />
            <p className="text-gray-400 text-sm leading-relaxed">
              Baytown's outdoor speedway on TX-146. Real karts, real lap times,
              and a private party room for 45 — all on the same property.
            </p>
            <div className="flex gap-2">
              {SOCIAL_LINKS.map((link) => (
                <SocialLink key={link.label} {...link} />
              ))}
            </div>
            <div className="pt-4 mt-4 border-t border-asphalt-700 space-y-2 text-xs text-gray-500">
              <p>&copy; {currentYear} Speedway 146. All rights reserved.</p>
              <div className="flex gap-3">
                <Link
                  to="/privacy"
                  className="hover:text-gray-300 transition-colors duration-base"
                >
                  Privacy
                </Link>
                <span className="text-asphalt-600">·</span>
                <Link
                  to="/terms"
                  className="hover:text-gray-300 transition-colors duration-base"
                >
                  Terms
                </Link>
              </div>
              <p>
                Site by{" "}
                <a
                  href="https://taylorurl.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-chalk transition-colors duration-base"
                >
                  TaylorURL.com
                </a>
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="text-xs font-display tracking-speedway uppercase text-race-500">
              Explore
            </h3>
            <ul className="space-y-3">
              {NAV_ITEMS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="group inline-flex items-center gap-2 text-base text-gray-300 hover:text-chalk transition-colors duration-base"
                  >
                    <span className="block h-px w-3 bg-race-500 transition-all duration-base ease-snap group-hover:w-6" />
                    <span className="font-semibold tracking-wide">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            <h3 className="text-xs font-display tracking-speedway uppercase text-race-500">
              Find Us
            </h3>
            <div className="space-y-3 text-sm">
              <ContactRow icon="map-pin" alignTop>
                {CONTACT_INFO.address}
              </ContactRow>
              <ContactRow icon="phone">
                <a
                  href={CONTACT_INFO.phoneTel}
                  className="hover:text-chalk transition-colors duration-base tabular-nums"
                >
                  {CONTACT_INFO.phone}
                </a>
              </ContactRow>
              <ContactRow icon="mail">
                <a
                  href={CONTACT_INFO.emailMailto}
                  className="hover:text-chalk transition-colors duration-base break-all"
                >
                  {CONTACT_INFO.email}
                </a>
              </ContactRow>
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="text-xs font-display tracking-speedway uppercase text-race-500">
              Track Hours
            </h3>
            <div className="flex items-start gap-3">
              <Icon name="clock" className="h-4 w-4 text-race-500 mt-1 flex-shrink-0" />
              <ul className="text-gray-300 text-sm space-y-1.5 tabular-nums">
                {BUSINESS_HOURS.map(({ day, hours }) => (
                  <li
                    key={day}
                    className="flex items-baseline justify-between gap-3"
                  >
                    <span className="font-semibold text-chalk">{day}</span>
                    <span className="text-gray-400">{hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
