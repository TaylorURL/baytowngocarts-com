const VARIANT_CLASSES = {
  race:    "bg-race-600 text-chalk",
  ignite:  "bg-ignite-500 text-asphalt-950",
  caution: "bg-caution-500 text-asphalt-950",
  asphalt: "bg-asphalt-800 text-chalk",
  navy:    "bg-asphalt-800 text-chalk",           // legacy alias
  red:     "bg-race-600 text-chalk",              // legacy alias
  light:   "bg-race-100 text-race-700",
  muted:   "bg-asphalt-100 text-asphalt-700",
  chalk:   "bg-chalk text-asphalt-900 ring-1 ring-asphalt-200",
};

/**
 * Eyebrow / category pill. Sits above titles. Restyle here once to
 * propagate everywhere.
 */
const Pill = ({
  children,
  variant = "race",
  size = "md",
  className = "",
  as: As = "span",
}) => {
  const sizing =
    size === "sm"
      ? "px-3 py-1 text-[11px]"
      : size === "lg"
        ? "px-5 py-2.5 text-base"
        : "px-4 py-1.5 text-xs";
  return (
    <As
      className={`inline-flex items-center gap-1.5 rounded-full font-display tracking-speedway uppercase ${VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.race} ${sizing} ${className}`}
    >
      {children}
    </As>
  );
};

export default Pill;
