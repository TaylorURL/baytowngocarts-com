/**
 * Race-stripe ribbon used to break sections or punctuate the page. Pure
 * decoration — does nothing functional. Has variants for thickness and an
 * optional "146" stencil for hero corners.
 */
const RaceRibbon = ({
  thickness = "md", // "sm" | "md" | "lg"
  variant = "race", // "race" | "caution"
  withLabel = false,
  className = "",
}) => {
  const height = { sm: "h-1.5", md: "h-3", lg: "h-5" }[thickness];
  const stripeClass = variant === "caution" ? "caution-tape" : "race-stripe";
  return (
    <div
      className={`relative w-full ${height} ${stripeClass} ${className}`}
      aria-hidden="true"
    >
      {withLabel && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-display tracking-speedway text-xs text-chalk drop-shadow">
          SPEEDWAY · 146
        </span>
      )}
    </div>
  );
};

export default RaceRibbon;
