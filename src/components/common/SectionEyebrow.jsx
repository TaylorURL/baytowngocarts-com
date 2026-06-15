/**
 * Section eyebrow — short uppercase label that sits above a section title.
 * Two leading red bars give it a "starting-grid" feel without being
 * cliche-checkered.
 */
const SectionEyebrow = ({ children, tone = "dark", className = "" }) => {
  const color = tone === "dark" ? "text-chalk" : "text-asphalt-700";
  return (
    <div
      className={`inline-flex items-center gap-3 font-display tracking-speedway text-sm ${color} ${className}`}
    >
      <span className="block h-[3px] w-6 bg-race-600 rounded-full" />
      <span className="block h-[3px] w-3 bg-race-600 rounded-full" />
      <span className="leading-none">{children}</span>
    </div>
  );
};

export default SectionEyebrow;
