/**
 * Reusable section heading with an optional colored badge, title, and subtitle.
 * Supports centered alignment and AOS fade-up animation.
 */
const SectionHeading = ({
  badge,
  badgeVariant = "red",
  title,
  subtitle,
  centered = false,
  className = "",
}) => {
  const badgeStyles = {
    red: "bg-red-100 text-red-600",
    navy: "bg-gray-700 text-white",
  };
  return (
    <div
      className={`mb-16 ${centered ? "text-center max-w-3xl mx-auto" : ""} ${className}`}
      data-aos="fade-up"
    >
      {badge && (
        <div
          className={`inline-block mb-4 px-3.5 py-1 rounded-full text-sm font-display tracking-widest ${badgeStyles[badgeVariant]}`}
        >
          {badge}
        </div>
      )}
      <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
};
export default SectionHeading;
