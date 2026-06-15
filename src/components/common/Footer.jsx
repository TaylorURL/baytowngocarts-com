import { Link } from "react-router-dom";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { NAV_ITEMS } from "../../lib/content/navigation.js";
import { BUSINESS_HOURS, CONTACT_INFO, SOCIAL_URLS } from "../../lib/content/business.js";

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
      >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
  },
];
const SOCIAL_LINK_CLASS =
  "text-gray-500 hover:text-red-600 hover:-translate-y-0.5 transition duration-200 ease-out";
const SocialLink = ({ href, label, icon: Icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={SOCIAL_LINK_CLASS}
    aria-label={label}
  >
    <Icon className="h-5 w-5" />
  </a>
);
const ContactRow = ({ icon: Icon, children, alignTop }) => (
  <div
    className={`flex space-x-3 ${alignTop ? "items-start" : "items-center"}`}
  >
    <Icon className={`h-4 w-4 text-gray-500 ${alignTop ? "mt-1" : ""}`} />
    <span className="text-gray-600">{children}</span>
  </div>
);
/**
 * Site-wide footer with branding, quick links, contact details,
 * hours of operation, and social media links.
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-gray-300 bg-gradient-to-b from-[#dce1e8] to-[#cdd4de]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Branding & legal */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/images/logo.png"
                alt="Speedway 146 Logo"
                loading="lazy"
                decoding="async"
                className="h-9 w-9 rounded-lg"
              />
            </div>
            <p className="text-gray-600">
              Baytown's go-to spot for family fun! Experience exciting go-kart
              racing, bounce houses, and more in our welcoming environment.
            </p>
            <div className="flex space-x-4">
              {SOCIAL_LINKS.map((link) => (
                <SocialLink key={link.label} {...link} />
              ))}
            </div>
            <div className="pt-4 mt-4 border-t border-gray-300 space-y-1.5 text-xs text-gray-500">
              <p>&copy; {currentYear} Speedway 146. All rights reserved.</p>
              <div className="flex gap-3">
                <Link
                  to="/privacy"
                  className="hover:text-gray-700 transition-colors"
                >
                  Privacy Policy
                </Link>
                <span className="text-gray-400">|</span>
                <Link
                  to="/terms"
                  className="hover:text-gray-700 transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
              <p>
                Website by{" "}
                <a
                  href="https://taylorurl.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  TaylorURL.com
                </a>
              </p>
            </div>
          </div>
          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Quick Links</h3>
            <ul className="space-y-2">
              {NAV_ITEMS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-lg font-display tracking-wide text-gray-600 hover:text-red-600 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Contact info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Contact Us</h3>
            <div className="space-y-3">
              <ContactRow icon={MapPin} alignTop>
                {CONTACT_INFO.address}
              </ContactRow>
              <ContactRow icon={Phone}>{CONTACT_INFO.phone}</ContactRow>
              <ContactRow icon={Mail}>{CONTACT_INFO.email}</ContactRow>
            </div>
          </div>
          {/* Hours of operation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Hours of Operation
            </h3>
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <Clock className="h-4 w-4 text-gray-500 mt-1" />
                <div className="text-gray-600 text-sm">
                  {BUSINESS_HOURS.map(({ day, hours }) => (
                    <div key={day}>
                      <span className="font-medium text-gray-700">{day}:</span>{" "}
                      {hours}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
