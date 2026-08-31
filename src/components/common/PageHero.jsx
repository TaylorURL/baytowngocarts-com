import Pill from "./Pill.jsx";
import Breadcrumbs from "./Breadcrumbs.jsx";
import ParticleField from "../reactbits/ParticleField.jsx";
import { photoSize, srcSet } from "../../lib/images.js";

const PageHero = ({
  badge,
  badgeVariant = "race",
  // The page supplies its own h1, so a route's primary heading lives in the
  // file that route is.
  heading,
  crumbs,
  description,
  backgroundImage,
  backgroundOpacityClass = "opacity-25",
  minHeightClass = "min-h-[68dvh]",
  dividerColorClass = "bg-chalk",
  showDivider = true,
  showStripe = true,
  align = "center",
  children,
  contentClassName = "",
}) => {
  const alignClass =
    align === "left" ? "text-left mr-auto" : "text-center mx-auto";
  return (
    <section
      className={`relative bg-asphalt-900 overflow-hidden pt-32 pb-20 ${minHeightClass} flex items-center`}
    >
      <div
        className="absolute inset-0 z-0 pointer-events-none asphalt-grain"
        aria-hidden="true"
      />
      {/* An element rather than a background: the route's largest paint is this
          photograph, and only markup the preload scanner can read gets a fetch
          priority ahead of the bundle. */}
      {backgroundImage && (
        <img
          src={backgroundImage}
          srcSet={srcSet(backgroundImage, photoSize(backgroundImage).width)}
          sizes="100vw"
          width={photoSize(backgroundImage).width}
          height={photoSize(backgroundImage).height}
          alt=""
          loading="eager"
          fetchpriority="high"
          className={`absolute inset-0 z-[1] h-full w-full object-cover object-center ${backgroundOpacityClass}`}
          aria-hidden="true"
        />
      )}
      {/* Deliberately near-invisible — pushed higher it fights the headline. */}
      <div
        className="absolute inset-0 z-[2] opacity-[0.06] checker-overlay"
        aria-hidden="true"
      />
      {/* Edge vignette buys headline contrast over arbitrary photography. */}
      <div
        className="absolute inset-0 z-[3] bg-hero-vignette"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-[4] pointer-events-none opacity-60"
        aria-hidden="true"
      >
        <ParticleField
          particleCount={140}
          particleSpread={12}
          speed={0.06}
          particleBaseSize={70}
          alphaParticles
          disableRotation
        />
      </div>
      {showStripe && (
        <div
          className="absolute top-0 left-0 right-0 h-1.5 z-[5] race-stripe"
          aria-hidden="true"
        />
      )}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`max-w-4xl ${alignClass} ${contentClassName}`}
          data-aos="fade"
        >
          {badge && (
            <div
              className={align === "left" ? "mb-6" : "mb-6 flex justify-center"}
            >
              <Pill variant={badgeVariant}>{badge}</Pill>
            </div>
          )}
          {crumbs && (
            <Breadcrumbs
              crumbs={crumbs}
              className={align === "left" ? "mb-5" : "mb-5 flex justify-center"}
            />
          )}
          {heading}
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
