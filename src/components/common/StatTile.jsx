const StatTile = ({
  value,
  label,
  hint,
  tone = "dark",
  accent = "race",
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

  return (
    <div className={`text-center ${className}`}>
      <div
        className={`font-display tracking-wide leading-none text-5xl md:text-6xl tabular-nums ${valueColor}`}
      >
        {value}
      </div>
      <div
        className={`mt-2 text-xs md:text-sm font-display tracking-speedway uppercase ${labelColor}`}
      >
        {label}
      </div>
      {hint && (
        <div className={`mt-1 text-xs ${hintColor}`}>{hint}</div>
      )}
    </div>
  );
};

export default StatTile;
