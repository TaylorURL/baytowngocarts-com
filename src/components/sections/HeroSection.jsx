import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import Button from "../common/Button.jsx";
import StatTile from "../common/StatTile.jsx";
import Pill from "../common/Pill.jsx";
import useImageSlideshow from "../../hooks/useImageSlideshow.js";
import {
  HERO_BACKGROUND_IMAGES,
  HERO_STATS,
  SLIDESHOW_INTERVAL_MS,
} from "../../lib/content/hero.js";
import { CONTACT_INFO } from "../../lib/content/business.js";

/**
 * Full-screen home hero. Asphalt foundation, crossfading track photography,
 * race-stripe top edge, big display headline, stat tiles. Designed to read
 * "real outdoor speedway in Baytown" in one glance.
 */
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
              index === currentImageIndex ? "opacity-40" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>
      {/* Asphalt grain + checker + vignette layers */}
      <div className="absolute inset-0 z-[1] asphalt-grain opacity-70" aria-hidden="true" />
      <div className="absolute inset-0 z-[2] opacity-[0.06] checker-overlay" aria-hidden="true" />
      <div className="absolute inset-0 z-[3] bg-gradient-to-b from-asphalt-950/40 via-transparent to-asphalt-950/80" aria-hidden="true" />
      {/* Top race stripe — the starting line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 z-[5] race-stripe" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32 md:pt-44 md:pb-44">
        <div className="md:max-w-3xl">
          <Pill variant="race" size="sm" className="mb-6" data-aos="fade-up">
            Outdoor Speedway · Open Daily
          </Pill>
          <h1
            className="text-5xl md:text-7xl lg:text-[7.5rem] font-bold text-chalk leading-[0.92] tracking-tight animate-fade-in"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Real Karts.
            <span className="block text-race-500">Real Speed.</span>
          </h1>
          <p
            className="mt-6 text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Baytown's outdoor speedway on TX-146. 5-minute heats, family-friendly
            track, leagues kicking off Q1 2026.
          </p>
          <div
            className="mt-10 flex flex-col sm:flex-row gap-3"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <Link to="/pricing">
              <Button size="lg" variant="primary" className="group">
                See Pricing
                <ArrowRight className="h-5 w-5 transition-transform duration-base ease-snap group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outlineLight">
                Book a Party
              </Button>
            </Link>
          </div>

          {/* Quick-glance info pills */}
          <div
            className="mt-10 flex flex-wrap items-center gap-4 text-sm text-gray-300"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <a
              href={CONTACT_INFO.phoneTel}
              className="inline-flex items-center gap-2 hover:text-chalk transition-colors duration-base ease-snap"
            >
              <Phone className="h-4 w-4 text-race-500" />
              <span className="font-semibold tracking-wide">
                {CONTACT_INFO.phone}
              </span>
            </a>
            <span className="hidden sm:block h-4 w-px bg-chalk/20" />
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-race-500" />
              <span className="font-semibold tracking-wide">
                6750 N TX-146 · Baytown
              </span>
            </span>
          </div>
        </div>

        <div
          className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl"
          data-aos="fade-up"
          data-aos-delay="500"
        >
          {HERO_STATS.map(({ value, label, className }, idx) => (
            <StatTile
              key={label}
              value={value}
              label={label}
              accent={idx === 0 ? "race" : idx === 1 ? "ignite" : "chalk"}
              className={className ?? ""}
            />
          ))}
        </div>
      </div>
      {/* Slope into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 z-[6] bg-chalk speedway-divider"
        aria-hidden="true"
      />
    </div>
  );
};

export default HeroSection;
