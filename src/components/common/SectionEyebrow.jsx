import ShinyText from "../reactbits/ShinyText.jsx";

const SectionEyebrow = ({ children, tone = "dark", className = "" }) => {
  const color = tone === "dark" ? "text-chalk" : "text-asphalt-700";
  // Chrome-sweep the label text. Base/shine tuned per surface so it reads as
  // brushed metal, not a rainbow.
  const shine =
    tone === "dark"
      ? { color: "#e7eaef", shineColor: "#ffffff" }
      : { color: "#2f333c", shineColor: "#e11d2a" };
  return (
    <div
      className={`inline-flex items-center gap-3 font-display tracking-speedway text-sm ${color} ${className}`}
    >
      <span className="block h-[3px] w-6 bg-race-600 rounded-full" />
      <span className="block h-[3px] w-3 bg-race-600 rounded-full" />
      {typeof children === "string" ? (
        <ShinyText
          text={children}
          speed={5}
          spread={140}
          color={shine.color}
          shineColor={shine.shineColor}
          className="leading-none"
        />
      ) : (
        <span className="leading-none">{children}</span>
      )}
    </div>
  );
};

export default SectionEyebrow;
