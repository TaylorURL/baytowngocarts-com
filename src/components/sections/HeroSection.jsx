import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../common/Button.jsx";

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const backgroundImages = [
    "/images/14.JPEG",
    "/images/15.JPEG",
    "/images/16.JPEG",
    "/images/17.JPEG",
    "/images/18.JPEG",
  ];

  useEffect(() => {
    const preloadImages = backgroundImages.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    Promise.all(
      preloadImages.map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) resolve();
            else img.onload = resolve;
          }),
      ),
    ).then(() => setImagesLoaded(true));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % backgroundImages.length,
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-navy-900 overflow-hidden min-h-screen">
      {/* Background Image Slideshow */}
      <div className="absolute inset-0 z-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-30" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>

      {/* HeroSection Checkerboard Pattern Overlay */}
      <div
        className="absolute inset-0 z-5 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(45deg, var(--color-black) 25%, transparent 25%), linear-gradient(-45deg, var(--color-black) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--color-black) 75%), linear-gradient(-45deg, transparent 75%, var(--color-black) 75%)",
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
        }}
      />

      {/* HeroSection Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-32 md:pt-56 md:pb-48">
        <div className="md:max-w-2xl">
          <h1
            className="text-5xl md:text-6xl lg:text-8xl font-bold text-white leading-tight animate-fade-in italic sm:tracking-normal tracking-tighter"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Experience the <span className="text-red-600">Thrill</span> of
            <span className="block text-red-500">SPEEDWAY 146</span>
          </h1>

          <p
            className="mt-6 text-xl text-gray-300 max-w-lg hero-text-shadow"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            Baytown's go-to spot for family fun! Exciting go-kart racing, bounce
            houses, and party room rentals for unforgettable experiences.
          </p>

          <div
            className="mt-10 flex flex-col sm:flex-row gap-4"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <Link to="/pricing">
              <Button size="lg" variant="primary" className="animate-slide-up">
                View Pricing
              </Button>
            </Link>

            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="animate-slide-up delay-100"
              >
                Book Now
              </Button>
            </Link>
          </div>

          <div
            className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-8"
            data-aos="fade-up"
            data-aos-delay="800"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white">12+</div>
              <div className="text-gray-400 text-sm">MPH Top Speed</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-white">1200+</div>
              <div className="text-gray-400 text-sm">Race Hours</div>
            </div>

            <div className="text-center md:col-span-1 col-span-2">
              <div className="text-3xl font-bold text-white">5000+</div>
              <div className="text-gray-400 text-sm">Happy Racers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Diagonal Bottom Edge */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 bg-white"
        style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%, 0% 100%)" }}
      />
    </div>
  );
};

export default HeroSection;
