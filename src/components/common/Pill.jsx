const VARIANT_CLASSES = {
  red: "bg-red-600 text-white",
  navy: "bg-gray-700 text-white",
  light: "bg-red-100 text-red-600",
  muted: "bg-gray-100 text-gray-600",
};

/**
 * Eyebrow / category pill used above page titles and section headings.
 * Single source of truth for the badge style — restyle here to update every page.
 */
const Pill = ({ children, variant = "red", className = "" }) => (
  <span
    className={`inline-block px-4 py-2 rounded-full text-sm font-display tracking-widest ${VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.red} ${className}`}
  >
    {children}
  </span>
);

export default Pill;
