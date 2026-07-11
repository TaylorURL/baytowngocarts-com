import CountUp from "../reactbits/CountUp.jsx";

// Split a stat string into a leading symbol, a countable number, and a trailing
// symbol — e.g. "$13.99" -> ["$", 13.99, ""], `40"` -> ["", 40, '"'].
// Values without a clean single number (like "5:00") return null and render
// static.
const parseStat = (value) => {
  if (typeof value !== "string") return null;
  const match = value.match(/^(\D*)(\d[\d,]*(?:\.\d+)?)(\D*)$/);
  if (!match) return null;
  const [, prefix, digits, suffix] = match;
  const numeric = Number(digits.replace(/,/g, ""));
  if (!Number.isFinite(numeric)) return null;
  return { prefix, numeric, suffix, hasSeparator: digits.includes(",") };
};

const StatTile = ({
  value,
  label,
  hint,
  tone = "dark",
  accent = "race",
  animate = true,
  className = "",
}) => {
  const valueColor = {
    race: "text-race-500",
    ignite: "text-ignite-500",
    caution: "text-caution-500",
    chalk: tone === "dark" ? "text-chalk" : "text-asphalt-900",
  }[accent];

  const labelColor = tone === "dark" ? "text-gray-400" : "text-asphalt-600";
  const hintColor = tone === "dark" ? "text-gray-500" : "text-asphalt-500";

  const parsed = animate ? parseStat(value) : null;

  return (
    <div className={`text-center ${className}`}>
      <div
        className={`font-display tracking-wide leading-none text-5xl md:text-6xl tabular-nums ${valueColor}`}
      >
        {parsed ? (
          <>
            {parsed.prefix}
            <CountUp
              to={parsed.numeric}
              duration={1.6}
              separator={parsed.hasSeparator ? "," : ""}
              className="tabular-nums"
            />
            {parsed.suffix}
          </>
        ) : (
          value
        )}
      </div>
      <div
        className={`mt-2 text-xs md:text-sm font-display tracking-speedway uppercase ${labelColor}`}
      >
        {label}
      </div>
      {hint && <div className={`mt-1 text-xs ${hintColor}`}>{hint}</div>}
    </div>
  );
};

export default StatTile;
