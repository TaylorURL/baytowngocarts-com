import React from "react";
import { Link } from "react-router-dom";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

const QUICK_LINKS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Pricing", path: "/pricing" },
  { name: "Events", path: "/events" },
  { name: "Contact", path: "/contact" },
  { name: "FAQ", path: "/faq" },
];

const SOCIAL_LINK_CLASS = "text-gray-500 hover:text-red-600 transition-colors";

/**
 * Site-wide footer with branding, quick links, contact details,
 * hours of operation, and social media links.
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t"
      style={{
        background: "linear-gradient(to bottom, #dce1e8, #cdd4de)",
        borderColor: "var(--color-gray-300)",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
              <a
                href="https://www.facebook.com/p/Speedway146-61575710985956/"
                target="_blank"
                rel="noopener noreferrer"
                className={SOCIAL_LINK_CLASS}
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/Speedway146/"
                target="_blank"
                rel="noopener noreferrer"
                className={SOCIAL_LINK_CLASS}
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.tiktok.com/@Speedway146"
                target="_blank"
                rel="noopener noreferrer"
                className={SOCIAL_LINK_CLASS}
                aria-label="TikTok"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Quick Links</h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map(({ name, path }) => (
                <li key={name}>
                  <Link
                    to={path}
                    className="text-gray-600 hover:text-red-600 transition-colors"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                <span className="text-gray-600">
                  6750 N TX-146, Baytown, TX 77523
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">(346) 932-1266</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">speedway146@gmail.com</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Hours of Operation
            </h3>
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <Clock className="h-4 w-4 text-gray-500 mt-1" />
                <div className="text-gray-600 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Thursday:</span>{" "}
                    5:00 PM – 10:30 PM
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Friday:</span>{" "}
                    5:00 PM – 10:30 PM
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Saturday:</span>{" "}
                    10:30 AM – 10:30 PM
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Sunday:</span>{" "}
                    10:30 AM – 10:30 PM
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Monday:</span>{" "}
                    Closed
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Tuesday:</span>{" "}
                    Closed
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Wednesday:
                    </span>{" "}
                    Closed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-8 pt-8 text-center">
          <p className="text-gray-600">
            &copy; {currentYear} Speedway 146. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link
              to="/faq"
              className="text-gray-500 hover:text-red-600 text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              to="/faq"
              className="text-gray-500 hover:text-red-600 text-sm"
            >
              Terms of Service
            </Link>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            Website by{" "}
            <a
              href="https://taylorurl.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-600 transition-colors"
            >
              TaylorURL.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
