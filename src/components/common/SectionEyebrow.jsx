const SectionEyebrow = ({ children, tone = "dark", className = "" }) => {
  const color = tone === "dark" ? "text-chalk" : "text-asphalt-700";
  return (
    <div
      className={`inline-flex items-center gap-3 font-display tracking-speedway text-sm ${color} ${className}`}
    >
      {/* The accent bar ahead of the label reads as a start-line marker
          rather than as a decorative rule. */}
      <span
        className="block h-[3px] w-6 bg-race-600 rounded-pill"
        aria-hidden="true"
      />
      <span className="leading-none">{children}</span>
    </div>
  );
};

export default SectionEyebrow;
