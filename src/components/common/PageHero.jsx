import Pill from "./Pill.jsx";

/**
 * Standard page hero used across every route. A full-bleed navy panel with a
 * background photo, checkerboard overlay, eyebrow pill, headline, optional
 * description, and a clip-path divider into the next section.
 *
 * Use the `titleAccent` prop to render the standard red-accent fragment as
 * the second half of the title.
 */
const PageHero = ({
  badge,
  title,
  titleAccent,
  description,
  backgroundImage,
  backgroundOpacityClass = "opacity-30",
  minHeightClass = "min-h-[70vh]",
  dividerColorClass = "bg-gray-50",
  showDivider = true,
  children,
  contentClassName = "",
}) => (
  <section
    className={`relative bg-navy-900 overflow-hidden pt-32 pb-20 ${minHeightClass} flex items-center`}
  >
    {backgroundImage && (
      <div className="absolute inset-0 z-0">
        <div
          className={`absolute inset-0 bg-cover bg-center ${backgroundOpacityClass}`}
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      </div>
    )}
    <div className="absolute inset-0 z-[5] opacity-10 checker-overlay" />
    <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
      <div
        className={`max-w-4xl mx-auto text-center ${contentClassName}`}
        data-aos="fade-up"
      >
        {badge && (
          <div className="mb-6">
            <Pill>{badge}</Pill>
          </div>
        )}
        {title && (
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-white leading-tight">
            {title}
            {titleAccent && (
              <>
                {" "}
                <span className="text-red-500">{titleAccent}</span>
              </>
            )}
          </h1>
        )}
        {description && (
          <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
    {showDivider && (
      <div
        className={`absolute bottom-0 left-0 right-0 h-16 z-[6] ${dividerColorClass} [clip-path:polygon(0_100%,100%_0,100%_100%,0%_100%)]`}
      />
    )}
  </section>
);

export default PageHero;
