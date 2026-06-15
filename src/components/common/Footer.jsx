import { Link } from "react-router-dom";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { NAV_ITEMS } from "../../lib/content/navigation.js";
import {
  BUSINESS_HOURS,
  CONTACT_INFO,
  SOCIAL_URLS,
} from "../../lib/content/business.js";
import Wordmark from "./Wordmark.jsx";

const SOCIAL_LINKS = [
  { label: "Facebook", href: SOCIAL_URLS.facebook, icon: Facebook },
  { label: "Instagram", href: SOCIAL_URLS.instagram, icon: Instagram },
  {
    label: "TikTok",
    href: SOCIAL_URLS.tiktok,
    icon: ({ className }) => (
      <svg
        className={className}
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
  },
];

const SocialLink = ({ href, label, icon: Icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-asphalt-800 text-gray-300 hover:bg-race-600 hover:text-chalk hover:-translate-y-0.5 transition-[background-color,color,transform] duration-base ease-snap"
    aria-label={label}
  >
    <Icon className="h-4 w-4" />
  </a>
);

const ContactRow = ({ icon: Icon, children, alignTop }) => (
  <div
    className={`flex gap-3 ${alignTop ? "items-start" : "items-center"} text-gray-300`}
  >
    <Icon
      className={`h-4 w-4 text-race-500 flex-shrink-0 ${alignTop ? "mt-1" : ""}`}
    />
    <span>{children}</span>
  </div>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="relative bg-asphalt-900 text-chalk">
      {/* Race ribbon — visually re-anchors the brand */}
      <div className="h-1.5 race-stripe" aria-hidden="true" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand + legal */}
          <div className="space-y-5">
            <Wordmark to={null} size="md" tone="dark" />
            <p className="text-gray-400 text-sm leading-relaxed">
              Baytown's outdoor speedway. Family-friendly karting, bounce houses,
              and party packages — every day of the week.
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

          {/* Quick links */}
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

          {/* Contact */}
          <div className="space-y-5">
            <h3 className="text-xs font-display tracking-speedway uppercase text-race-500">
              Contact
            </h3>
            <div className="space-y-3 text-sm">
              <ContactRow icon={MapPin} alignTop>
                {CONTACT_INFO.address}
              </ContactRow>
              <ContactRow icon={Phone}>
                <a
                  href={CONTACT_INFO.phoneTel}
                  className="hover:text-chalk transition-colors duration-base"
                >
                  {CONTACT_INFO.phone}
                </a>
              </ContactRow>
              <ContactRow icon={Mail}>
                <a
                  href={CONTACT_INFO.emailMailto}
                  className="hover:text-chalk transition-colors duration-base break-all"
                >
                  {CONTACT_INFO.email}
                </a>
              </ContactRow>
            </div>
          </div>

          {/* Hours */}
          <div className="space-y-5">
            <h3 className="text-xs font-display tracking-speedway uppercase text-race-500">
              Hours
            </h3>
            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-race-500 mt-1 flex-shrink-0" />
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
