import { Link } from "react-router-dom";

const SIZES = {
  sm: { logo: "h-9 w-9", primary: "text-lg", secondary: "text-[10px]" },
  md: { logo: "h-12 w-12", primary: "text-xl", secondary: "text-[11px]" },
  lg: { logo: "h-14 w-14", primary: "text-2xl", secondary: "text-[11px]" },
};

/**
 * Speedway 146 wordmark. Pairs the runner logo with the display name and a
 * tracking-widest tagline. Used in the header, mobile drawer, and auth pages
 * to keep the brand presentation identical everywhere.
 */
const Wordmark = ({
  to = "/",
  onClick,
  size = "md",
  tone = "dark", // "dark" for dark surfaces, "light" for chrome/silver chrome
  showTagline = true,
  className = "",
}) => {
  const s = SIZES[size];
  const primaryColor = tone === "dark" ? "text-chalk" : "text-asphalt-900";
  const secondaryColor =
    tone === "dark" ? "text-gray-400" : "text-asphalt-600";

  const inner = (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src="/images/logo.png"
        alt="Speedway 146 logo"
        loading="eager"
        className={`${s.logo} object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-snap group-hover:scale-105`}
      />
      <div className="leading-none">
        <div className={`font-display ${s.primary} tracking-speedway ${primaryColor}`}>
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
  return (
    <Link to={to} onClick={onClick} className="group inline-block">
      {inner}
    </Link>
  );
};

export default Wordmark;
