import { Link } from "react-router-dom";
import { logoSrcSet } from "../../lib/images.js";

const SIZES = {
  sm: { logo: "h-9 w-9", primary: "text-lg", secondary: "text-[10px]" },
  md: { logo: "h-11 w-11", primary: "text-xl", secondary: "text-[11px]" },
  lg: { logo: "h-14 w-14", primary: "text-2xl", secondary: "text-[11px]" },
};

const Wordmark = ({
  to = "/",
  onNavigate,
  size = "md",
  tone = "dark", // "dark" | "light" — pick the one matching the surface behind it
  showTagline = true,
  className = "",
}) => {
  const s = SIZES[size];
  const primaryColor = tone === "dark" ? "text-chalk" : "text-asphalt-900";
  const secondaryColor = tone === "dark" ? "text-gray-400" : "text-asphalt-600";

  const inner = (
    <div className={`flex h-11 items-center gap-3 ${className}`}>
      <img
        src="/images/logo.webp"
        srcSet={logoSrcSet("/images/logo.webp", 512)}
        sizes="64px"
        alt="Speedway 146 logo"
        loading="eager"
        width="512"
        height="560"
        className={`${s.logo} object-contain bg-transparent transition-transform duration-base ease-snap group-hover:scale-105`}
      />
      <div className="leading-none">
        <div
          className={`font-display ${s.primary} tracking-speedway ${primaryColor}`}
        >
          SPEEDWAY <span className="text-race-500">146</span>
        </div>
        {showTagline && (
          <div
            className={`mt-1 ${s.secondary} uppercase tracking-widest font-semibold ${secondaryColor}`}
          >
            Go-Kart Racing · Baytown TX
          </div>
        )}
      </div>
    </div>
  );

  if (!to) return inner;
  /* The header carries one of these per breakpoint and hides the one the
     viewport is not on, which leaves a link in the tab order whose whole
     content is display:none and which therefore answers to nothing. The name
     sits outside what the breakpoint hides, so the link has one at every
     width. */
  return (
    <Link to={to} onClick={onNavigate} className="group inline-block">
      <span className="sr-only">Speedway 146 Home</span>
      {inner}
    </Link>
  );
};

export default Wordmark;
