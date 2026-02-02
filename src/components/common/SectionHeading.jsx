import React from "react";

const SectionHeading = ({
  title,
  subtitle,
  centered = false,
  className = "",
}) => {
  const alignmentClass = centered ? "text-center" : "";

  return (
    <div className={`mb-12 ${alignmentClass} ${className}`}>
      <h2 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionHeading;
