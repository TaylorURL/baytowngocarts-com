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
    <div
      className={`flex flex-col items-center gap-1 text-center ${className}`}
    >
      <div
        className={`font-display tracking-wide leading-none text-5xl md:text-6xl tabular-nums ${valueColor}`}
      >
        {parsed ? (
          <>
            {/* The symbols either side of the figure are elements rather than
                the bare text they read as. The count is picked up once the
                page has settled, and that swap inserts the figure's element
                at the position React recorded - the node standing after it,
                which is the trailing symbol. A browser's own page translation
                rewrites the text runs it finds in a block by moving each one
                inside an element of its own, so a loose symbol stops being a
                child of the tile the moment the page is translated and the
                insertion then names a node this block no longer parents.
                Wrapped, each symbol is translated inside itself and the tile
                keeps the children React wrote. */}
            {parsed.prefix ? <span>{parsed.prefix}</span> : null}
            <CountUp
              to={parsed.numeric}
              duration={1.6}
              separator={parsed.hasSeparator ? "," : ""}
              className="tabular-nums"
            />
            {parsed.suffix ? <span>{parsed.suffix}</span> : null}
          </>
        ) : (
          value
        )}
      </div>
      <div
        className={`text-xs md:text-sm font-display tracking-speedway uppercase ${labelColor}`}
      >
        {label}
      </div>
      {hint && <div className={`text-xs ${hintColor}`}>{hint}</div>}
    </div>
  );
};

export default StatTile;
