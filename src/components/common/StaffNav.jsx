import { Link, useLocation } from "react-router-dom";
import Icon from "./Icon.jsx";

const VIEWS = [
  { label: "Staff Panel", href: "/staff", icon: "shield" },
  { label: "Site Traffic", href: "/traffic", icon: "bar-chart" },
];

/**
 * Moves between the staff-only views, and back to the site.
 *
 * Both views are reached from the account menu, which closes behind whoever
 * opened it, so each one carries the way to the other.
 */
const StaffNav = () => {
  const { pathname } = useLocation();
  return (
    <nav
      aria-label="Staff Tools"
      className="flex flex-wrap items-center gap-2 border-b border-asphalt-200 bg-asphalt-50 px-4 py-3 sm:px-6 lg:px-8"
    >
      {VIEWS.map(({ label, href, icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            to={href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 font-display text-xs uppercase tracking-speedway transition-colors duration-base ease-snap ${
              active
                ? "bg-race-600 text-chalk"
                : "text-asphalt-600 hover:bg-asphalt-100 hover:text-asphalt-900"
            }`}
          >
            <Icon name={icon} className="h-4 w-4" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
      <Link
        to="/"
        className="ml-auto inline-flex items-center gap-2 rounded-md px-3 py-2 font-display text-xs uppercase tracking-speedway text-asphalt-600 transition-colors duration-base ease-snap hover:bg-asphalt-100 hover:text-asphalt-900"
      >
        <Icon name="arrow-left" className="h-4 w-4" aria-hidden="true" />
        Back to Site
      </Link>
    </nav>
  );
};

export default StaffNav;
