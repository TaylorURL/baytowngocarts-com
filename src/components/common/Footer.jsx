import { Link } from "react-router-dom";
import { NAV_ITEMS } from "../../lib/content/navigation.js";
import {
  BUSINESS_HOURS,
  CLOSED_DAYS_NOTE,
  CONTACT_INFO,
  HOLIDAY_HOURS_NOTE,
  SOCIAL_URLS,
} from "../../lib/content/business.js";
import Icon from "./Icon.jsx";
import Wordmark from "./Wordmark.jsx";

/*
 * One band, anchored by the wordmark. What a visitor comes to a venue's
 * footer for - where it is, what to call, and which days it opens - sits
 * beside the mast on one line, and the destinations run under it as a rule
 * rather than as a column of categories.
 */

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
    className="inline-flex items-center justify-center h-11 w-11 rounded-md bg-asphalt-800 text-gray-300 hover:bg-race-600 hover:text-chalk hover:-translate-y-0.5 transition-[background-color,color,transform] duration-base ease-snap"
    aria-label={label}
  >
    <Icon name={icon} className="h-4 w-4" />
  </a>
);

const Fact = ({ icon, label, children }) => (
  <div className="flex gap-3">
    <Icon name={icon} className="mt-1 h-4 w-4 flex-shrink-0 text-race-500" />
    <div>
      <div className="font-display text-[11px] tracking-speedway uppercase text-gray-500">
        {label}
      </div>
      <div className="mt-1 text-sm text-gray-300">{children}</div>
    </div>
  </div>
);

const Footer = ({ children }) => {
  /* Baked in at build. Reading the browser's clock at render time leaves the
     prerendered document and the render that attaches to it disagreeing across
     a New Year rollover and on a device set to the wrong time zone, and the
     two disagreeing is what throws hydration on that first paint. */
  const currentYear = __BUILD_YEAR__;
  return (
    /* Chrome pinned to the viewport's bottom edge publishes the height it
       covers as --docked-reserve, and the footer carries it, so the reserved
       space is footer ground rather than a strip of the body's. */
    <footer
      className="relative bg-asphalt-900 text-chalk"
      style={{ paddingBottom: "var(--docked-reserve, 0px)" }}
    >
      <div className="h-1.5 race-stripe" aria-hidden="true" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm space-y-5">
            <Wordmark to={null} size="md" tone="dark" />
            <p className="text-sm leading-relaxed text-gray-400">
              Baytown's outdoor speedway on TX-146. Real karts, real racing, and
              a private party room for 60, all on the same property.
            </p>
            <div className="flex gap-2">
              {SOCIAL_LINKS.map((link) => (
                <SocialLink key={link.label} {...link} />
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:max-w-xl lg:flex-1">
            <Fact icon="map-pin" label="Find Us">
              <a
                href={CONTACT_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center hover:text-chalk transition-colors duration-base"
              >
                {CONTACT_INFO.address}
              </a>
            </Fact>
            <Fact icon="phone" label="Call or Write">
              <a
                href={CONTACT_INFO.phoneTel}
                className="flex min-h-11 items-center tabular-nums hover:text-chalk transition-colors duration-base"
              >
                {CONTACT_INFO.phone}
              </a>
              <a
                href={CONTACT_INFO.emailMailto}
                className="flex min-h-11 items-center break-all hover:text-chalk transition-colors duration-base"
              >
                {CONTACT_INFO.email}
              </a>
            </Fact>
            <Fact icon="clock" label="Track Hours">
              <ul className="space-y-1 tabular-nums">
                {BUSINESS_HOURS.map(({ day, hours }) => (
                  <li
                    key={day}
                    className="flex items-baseline justify-between gap-4"
                  >
                    <span className="font-semibold text-chalk">{day}</span>
                    <span className="text-gray-400">{hours}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-gray-500">{CLOSED_DAYS_NOTE}</p>
            </Fact>
            <Fact icon="calendar" label="Holidays">
              <p className="text-xs leading-relaxed text-gray-400">
                {HOLIDAY_HOURS_NOTE}
              </p>
            </Fact>
          </div>
        </div>

        <nav
          aria-label="Footer"
          className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-asphalt-700 pt-6"
        >
          {NAV_ITEMS.map(({ label, href }) => (
            <Link
              key={label}
              to={href}
              className="inline-flex min-h-11 min-w-11 items-center justify-center font-display text-sm tracking-speedway uppercase text-gray-400 hover:text-chalk transition-colors duration-base"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
          <p>&copy; {currentYear} Speedway 146. All rights reserved.</p>
          <div className="flex gap-3">
            <Link
              to="/privacy"
              className="inline-flex min-h-11 min-w-11 items-center justify-center hover:text-gray-300 transition-colors duration-base"
            >
              Privacy
            </Link>
            <span className="text-asphalt-600">·</span>
            <Link
              to="/terms"
              className="inline-flex min-h-11 min-w-11 items-center justify-center hover:text-gray-300 transition-colors duration-base"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
      {children}
    </footer>
  );
};

export default Footer;
