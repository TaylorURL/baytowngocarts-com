import Pill from "./Pill.jsx";

const SectionHeading = ({
  badge,
  badgeVariant = "race",
  title,
  subtitle,
  centered = false,
  className = "",
  tone = "light",
}) => {
  const titleColor = tone === "dark" ? "text-chalk" : "text-asphalt-900";
  const subtitleColor = tone === "dark" ? "text-gray-400" : "text-asphalt-600";
  return (
    <div
      className={`mb-14 ${centered ? "text-center max-w-3xl mx-auto" : ""} ${className}`}
      data-aos="fade-up"
    >
      {badge && (
        <div className={centered ? "flex justify-center mb-4" : "mb-4"}>
          <Pill variant={badgeVariant}>{badge}</Pill>
        </div>
      )}
      <h2 className={`text-4xl lg:text-5xl font-bold ${titleColor} mb-5`}>
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-lg ${subtitleColor} ${centered ? "max-w-2xl mx-auto" : ""}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
