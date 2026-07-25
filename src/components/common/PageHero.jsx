import Pill from "./Pill.jsx";
import Particles from "../reactbits/Particles.jsx";
import ShinyText from "../reactbits/ShinyText.jsx";

const PageHero = ({
  badge,
  badgeVariant = "race",
  title,
  titleAccent,
  description,
  backgroundImage,
  backgroundOpacityClass = "opacity-25",
  minHeightClass = "min-h-[68vh]",
  dividerColorClass = "bg-chalk",
  showDivider = true,
  showStripe = true,
  align = "center",
  children,
  contentClassName = "",
}) => {
  const alignClass = align === "left" ? "text-left mr-auto" : "text-center mx-auto";
  return (
    <section
      className={`relative bg-asphalt-900 overflow-hidden pt-32 pb-20 ${minHeightClass} flex items-center`}
    >
      <div className="absolute inset-0 z-0 asphalt-grain" aria-hidden="true" />
      {backgroundImage && (
        <div
          className={`absolute inset-0 z-[1] bg-cover bg-center ${backgroundOpacityClass}`}
          style={{ backgroundImage: `url(${backgroundImage})` }}
          aria-hidden="true"
        />
      )}
      {/* Deliberately near-invisible — pushed higher it fights the headline. */}
      <div className="absolute inset-0 z-[2] opacity-[0.06] checker-overlay" aria-hidden="true" />
      {/* Edge vignette buys headline contrast over arbitrary photography. */}
      <div className="absolute inset-0 z-[3] bg-hero-vignette" aria-hidden="true" />
      <div
        className="absolute inset-0 z-[4] pointer-events-none opacity-60"
        aria-hidden="true"
      >
        <Particles
          particleColors={["#e11d2a", "#f26800", "#fbfbf8"]}
          particleCount={140}
          particleSpread={12}
          speed={0.06}
          particleBaseSize={70}
          alphaParticles
          disableRotation
        />
      </div>
      {showStripe && (
        <div className="absolute top-0 left-0 right-0 h-1.5 z-[5] race-stripe" aria-hidden="true" />
      )}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`max-w-4xl ${alignClass} ${contentClassName}`}
          data-aos="fade-up"
        >
          {badge && (
            <div className={align === "left" ? "mb-6" : "mb-6 flex justify-center"}>
              <Pill variant={badgeVariant}>{badge}</Pill>
            </div>
          )}
          {title && (
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-chalk leading-[0.95] tracking-tight">
              {title}
              {titleAccent && (
                <>
                  {" "}
                  <ShinyText
                    text={titleAccent}
                    speed={4}
                    spread={90}
                    color="#e11d2a"
                    shineColor="#ffe3e4"
                    className="align-baseline"
                  />
                </>
              )}
            </h1>
          )}
          {description && (
            <p className="text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
      {showDivider && (
        <div
          className={`absolute bottom-0 left-0 right-0 h-16 z-[6] ${dividerColorClass} speedway-divider`}
          aria-hidden="true"
        />
      )}
    </section>
  );
};

export default PageHero;
