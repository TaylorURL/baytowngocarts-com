import { useEffect, useState } from "react";
import Button from "../common/Button.jsx";
import Icon from "../common/Icon.jsx";
import StatTile from "../common/StatTile.jsx";
import Pill from "../common/Pill.jsx";
import ParticleField from "../reactbits/ParticleField.jsx";
import RotatingText from "../reactbits/RotatingText.jsx";
import BlurText from "../reactbits/BlurText.jsx";
import Magnet from "../reactbits/Magnet.jsx";
import useImageSlideshow from "../../hooks/useImageSlideshow.js";
import { whenStill } from "../../lib/idle.js";
import { srcSet } from "../../lib/images.js";
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
  const [readAhead, setReadAhead] = useState(false);

  /* The frame after this one is worth having in hand before it is wanted, and
     worth nothing while the first one is still being painted. It rides the
     same wait the rotation does, so the file is asked for once the page is no
     longer competing with it and still lands with an interval left to arrive
     in. */
  useEffect(
    () => whenStill(() => setReadAhead(true), SLIDESHOW_INTERVAL_MS / 2),
    [],
  );

  return (
    <div
      data-hero
      className="relative bg-asphalt-900 overflow-hidden min-h-dvh"
    >
      {/* Only the slide on screen and the one after it are mounted. Giving all
          five a file at once fetches every photograph before the first one has
          painted. The frames are elements rather than backgrounds so the
          preload scanner finds the first one in the markup and can be told it
          outranks everything else the parser is queueing. */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {HERO_BACKGROUND_IMAGES.map((image, index) => {
          const isCurrent = index === currentImageIndex;
          const isNext =
            index === (currentImageIndex + 1) % HERO_BACKGROUND_IMAGES.length;
          if (!isCurrent && !(isNext && readAhead)) return null;
          return (
            <img
              key={index}
              src={image.src}
              srcSet={srcSet(image.src, image.width)}
              sizes="100vw"
              width={image.width}
              height={image.height}
              alt=""
              loading="eager"
              fetchpriority={isCurrent ? "high" : "low"}
              decoding={isCurrent ? "sync" : "async"}
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-ambient ease-snap ${
                isCurrent ? "opacity-45" : "opacity-0"
              }`}
            />
          );
        })}
      </div>
      <div
        className="absolute inset-0 pointer-events-none z-[1] asphalt-grain opacity-70"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-[2] opacity-[0.06] checker-overlay"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-[2] pointer-events-none opacity-70"
        aria-hidden="true"
      >
        <ParticleField
          particleCount={180}
          particleSpread={14}
          speed={0.07}
          particleBaseSize={80}
          alphaParticles
          disableRotation
        />
      </div>
      <div
        className="absolute inset-0 z-[3] bg-gradient-to-b from-asphalt-950/55 via-transparent to-asphalt-950/85"
        aria-hidden="true"
      />
      {/* Corners only — darkening the centre would dull the photography. */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, color-mix(in srgb, var(--color-asphalt-950) 70%, transparent) 100%)",
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-1.5 z-[5] race-stripe"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-24 md:pb-32">
        <div className="md:max-w-3xl">
          <div className="flex items-center gap-3 mb-6" data-aos="fade">
            <Pill variant="race" size="sm">
              Outdoor Speedway · Open Thu to Sun
            </Pill>
          </div>
          <h1
            className="text-5xl md:text-7xl lg:text-[7.5rem] font-bold text-chalk leading-[0.92] tracking-tight hero-text-shadow"
            data-aos="fade"
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
          <div
            className="mt-6 flex items-center gap-3"
            aria-hidden="true"
            data-aos="fade"
            data-aos-delay="150"
          >
            <span className="block h-[2px] w-16 bg-gradient-to-r from-chalk/70 to-chalk/0 rounded-full" />
            <span className="block h-2 w-8 race-stripe rounded-sm" />
            <span className="block h-px flex-1 max-w-[140px] bg-chalk/15" />
          </div>
          <BlurText
            text="Speedway 146 is Baytown's outdoor go-kart speedway on TX-146. 5-minute heats, family-friendly track, open Thursday through Sunday."
            animateBy="words"
            delay={30}
            className="mt-6 text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed"
          />
          <div
            className="mt-10 flex flex-col sm:flex-row gap-3"
            data-aos="fade"
            data-aos-delay="300"
          >
            <Magnet
              padding={70}
              magnetStrength={4}
              innerClassName="w-full sm:w-auto"
            >
              <Button
                to="/pricing"
                size="lg"
                variant="primary"
                className="group"
              >
                See Pricing
                <Icon
                  name="arrow-right"
                  className="h-5 w-5 transition-transform duration-base ease-snap group-hover:translate-x-1.5"
                />
              </Button>
            </Magnet>
            <Button to="/contact" size="lg" variant="outlineLight">
              Book a Party
            </Button>
          </div>

          <div
            className="mt-10 inline-flex flex-wrap items-stretch gap-0 rounded-md border border-chalk/10 bg-asphalt-950/55 backdrop-blur-sm divide-x divide-chalk/10"
            data-aos="fade"
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

        <div className="mt-16 max-w-2xl" data-aos="fade" data-aos-delay="500">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="block h-[2px] w-10 bg-gradient-to-r from-chalk/0 via-chalk/70 to-chalk/0 rounded-full"
              aria-hidden="true"
            />
            <span className="font-display tracking-speedway text-[10px] text-chalk/60 uppercase">
              Track Telemetry
            </span>
            <span
              className="block h-px flex-1 bg-chalk/10"
              aria-hidden="true"
            />
            <span className="inline-flex items-center gap-1.5 font-display tracking-speedway text-[10px] text-race-500 uppercase">
              Live
            </span>
          </div>
          <div className="relative rounded-md border border-chalk/10 bg-asphalt-950/55 backdrop-blur-sm shadow-track overflow-hidden">
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
            <span
              className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-chalk/20 to-transparent"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
      <div
        className="absolute bottom-16 left-0 right-0 h-[3px] z-[6] caution-tape opacity-80"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-16 z-[6] bg-chalk speedway-divider"
        aria-hidden="true"
      />
    </div>
  );
};

export default HeroSection;
