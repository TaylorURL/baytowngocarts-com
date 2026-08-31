import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";

/**
 * The trail from the front page to here.
 *
 * Google renders it in place of the raw URL in a result, and it gives a reader
 * arriving from search one click back up rather than a guess at the nav.
 * The matching BreadcrumbList markup is emitted by RouteMeta from the same
 * crumbs, so the trail on the page and the trail in the result agree.
 */
const Breadcrumbs = ({ crumbs, tone = "dark", className = "" }) => {
  if (!crumbs || crumbs.length === 0) return null;
  const muted = tone === "dark" ? "text-asphalt-300" : "text-asphalt-500";
  const current = tone === "dark" ? "text-chalk" : "text-asphalt-800";

  return (
    <nav aria-label="Breadcrumb" className={`text-xs ${className}`}>
      <ol className={`flex flex-wrap items-center gap-1.5 ${muted}`}>
        <li>
          <Link
            to="/"
            className="hover:text-race-400 transition-colors duration-base"
          >
            Home
          </Link>
        </li>
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-1.5">
              <Icon
                name="chevron-right"
                className="h-3 w-3 opacity-60"
                aria-hidden="true"
              />
              {last ? (
                <span
                  className={`font-semibold ${current}`}
                  aria-current="page"
                >
                  {crumb.name}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="hover:text-race-400 transition-colors duration-base"
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
