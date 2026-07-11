import { Link } from "react-router-dom";
import Button from "../common/Button.jsx";
import Icon from "../common/Icon.jsx";
import StatTile from "../common/StatTile.jsx";
import Pill from "../common/Pill.jsx";
import {
  Particles,
  RotatingText,
  BlurText,
  Magnet,
} from "../reactbits";
import useImageSlideshow from "../../hooks/useImageSlideshow.js";
import {
  HERO_BACKGROUND_IMAGES,
  HERO_STATS,
  SLIDESHOW_INTERVAL_MS,
} from "../../lib/content/hero.js";
import { CONTACT_INFO } from "../../lib/content/business.js";

const HeroSection = () => {
  const [currentImageIndex] = useImageSlideshow(
    HERO_BACKGROUND_IMAGES,
    SLIDESHOW_INTERVAL_MS,
  );
  return (
    <div className="relative bg-asphalt-900 overflow-hidden min-h-screen">
      {/* Crossfading photography */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {HERO_BACKGROUND_IMAGES.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms] ease-snap ${
              index === currentImageIndex ? "opacity-45" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>
      {/* Asphalt grain + checker + vignette layers */}
      <div className="absolute inset-0 z-[1] asphalt-grain opacity-70" aria-hidden="true" />
      <div className="absolute inset-0 z-[2] opacity-[0.06] checker-overlay" aria-hidden="true" />
      {/* Drifting embers over the track */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none opacity-70"
        aria-hidden="true"
      >
        <Particles
          particleColors={["#e11d2a", "#f26800", "#fbfbf8"]}
          particleCount={180}
          particleSpread={14}
          speed={0.07}
          particleBaseSize={80}
          alphaParticles
          disableRotation
        />
      </div>
      <div className="absolute inset-0 z-[3] bg-gradient-to-b from-asphalt-950/55 via-transparent to-asphalt-950/85" aria-hidden="true" />
      {/* Corner-only vignette so the photo center stays bright but headlines have contrast */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(8,10,14,0.7) 100%)",
        }}
      />
      {/* Top race stripe — the starting line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 z-[5] race-stripe" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32 md:pt-44 md:pb-44">
        <div className="md:max-w-3xl">
          <div className="flex items-center gap-3 mb-6" data-aos="fade-up">
            <Pill variant="race" size="sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-chalk opacity-80 animate-pulse-race" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-chalk" />
              </span>
              Outdoor Speedway · Open Thu – Sun
            </Pill>
          </div>
          <h1
            className="text-5xl md:text-7xl lg:text-[7.5rem] font-bold text-chalk leading-[0.92] tracking-tight animate-fade-in hero-text-shadow"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Real Karts.
            <RotatingText
              texts={["Real Speed.", "Real Racing.", "Full Throttle."]}
              rotationInterval={2600}
              staggerDuration={0.02}
              splitLevelClassName="overflow-hidden"
              mainClassName="block text-race-500 tracking-[-0.01em]"
            />
          </h1>
          {/* Starting-line accent — chrome hairline + race-stripe tick */}
          <div
            className="mt-6 flex items-center gap-3"
            aria-hidden="true"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            <span className="block h-[2px] w-16 bg-gradient-to-r from-chalk/70 to-chalk/0 rounded-full" />
            <span className="block h-2 w-8 race-stripe rounded-sm" />
            <span className="block h-px flex-1 max-w-[140px] bg-chalk/15" />
          </div>
          <BlurText
            text="Baytown's outdoor speedway on TX-146. 5-minute heats, family-friendly track, open Thursday through Sunday."
            animateBy="words"
            delay={30}
            className="mt-6 text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed"
          />
          <div
            className="mt-10 flex flex-col sm:flex-row gap-3"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <Magnet padding={70} magnetStrength={4} innerClassName="w-full sm:w-auto">
              <Link to="/pricing">
                <Button size="lg" variant="primary" className="group">
                  See Pricing
                  <Icon name="arrow-right" className="h-5 w-5 transition-transform duration-base ease-snap group-hover:translate-x-1.5" />
                </Button>
              </Link>
            </Magnet>
            <Link to="/contact">
              <Button size="lg" variant="outlineLight">
                Book a Party
              </Button>
            </Link>
          </div>

          {/* Quick-glance info row — starting-grid info bar */}
          <div
            className="mt-10 inline-flex flex-wrap items-stretch gap-0 rounded-md border border-chalk/10 bg-asphalt-950/55 backdrop-blur-sm divide-x divide-chalk/10"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <a
              href={CONTACT_INFO.phoneTel}
              className="group inline-flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-200 hover:text-chalk transition-colors duration-base ease-snap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-race-500 focus-visible:ring-offset-2 focus-visible:ring-offset-asphalt-950 rounded-md"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-sm bg-race-600/15 text-race-500 group-hover:bg-race-600/25 transition-colors duration-base ease-snap">
                <Icon name="phone" className="h-3.5 w-3.5" />
              </span>
              <span className="font-display tracking-speedway text-[13px] tabular-nums">
                {CONTACT_INFO.phone}
              </span>
            </a>
            <span className="inline-flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-200">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-sm bg-race-600/15 text-race-500">
                <Icon name="map-pin" className="h-3.5 w-3.5" />
              </span>
              <span className="font-display tracking-speedway text-[13px]">
                {CONTACT_INFO.addressLine1} · Baytown
              </span>
            </span>
          </div>
        </div>

        {/* Instrument-cluster stat panel */}
        <div
          className="mt-16 max-w-2xl"
          data-aos="fade-up"
          data-aos-delay="500"
        >
          {/* Chrome top-rule + status eyebrow */}
          <div className="flex items-center gap-3 mb-3">
            <span className="block h-[2px] w-10 bg-gradient-to-r from-chalk/0 via-chalk/70 to-chalk/0 rounded-full" aria-hidden="true" />
            <span className="font-display tracking-speedway text-[10px] text-chalk/60 uppercase">
              Track Telemetry
            </span>
            <span className="block h-px flex-1 bg-chalk/10" aria-hidden="true" />
            <span className="inline-flex items-center gap-1.5 font-display tracking-speedway text-[10px] text-race-500 uppercase">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-race-500 animate-pulse-race" />
              Live
            </span>
          </div>
          <div className="relative rounded-md border border-chalk/10 bg-asphalt-950/55 backdrop-blur-sm shadow-track overflow-hidden">
            {/* Chrome top hairline */}
            <span
              className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-chalk/40 to-transparent"
              aria-hidden="true"
            />
            <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-chalk/10">
              {HERO_STATS.map(({ value, label, className }, idx) => (
                <div key={label} className="px-4 py-5 md:py-6">
                  <StatTile
                    value={value}
                    label={label}
                    accent={idx === 0 ? "race" : idx === 1 ? "ignite" : "chalk"}
                    className={className ?? ""}
                  />
                </div>
              ))}
            </div>
            {/* Chrome bottom hairline */}
            <span
              className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-chalk/20 to-transparent"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
      {/* Caution-tape hairline above the slope */}
      <div
        className="absolute bottom-16 left-0 right-0 h-[3px] z-[6] caution-tape opacity-80"
        aria-hidden="true"
      />
      {/* Slope into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 z-[6] bg-chalk speedway-divider"
        aria-hidden="true"
      />
    </div>
  );
};

export default HeroSection;
