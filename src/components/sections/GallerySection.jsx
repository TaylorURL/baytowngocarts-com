import { useState } from "react";
import Icon from "../common/Icon.jsx";
import SectionEyebrow from "../common/SectionEyebrow.jsx";
import {
  GALLERY_IMAGES,
  GALLERY_IMAGES_PER_SLIDE,
} from "../../lib/content/gallery.js";

const GallerySection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = Math.ceil(
    GALLERY_IMAGES.length / GALLERY_IMAGES_PER_SLIDE,
  );
  const navigateSlide = (direction) =>
    setCurrentSlide((prev) => (prev + direction + totalSlides) % totalSlides);
  const getSlideImages = (slideIndex) =>
    GALLERY_IMAGES.slice(
      slideIndex * GALLERY_IMAGES_PER_SLIDE,
      (slideIndex + 1) * GALLERY_IMAGES_PER_SLIDE,
    );

  return (
    <section className="py-24 bg-asphalt-900 text-chalk relative overflow-hidden">
      <div className="absolute inset-0 asphalt-grain opacity-50" aria-hidden="true" />
      <div className="absolute top-0 left-0 right-0 h-1 race-stripe" aria-hidden="true" />
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14" data-aos="fade-up">
          <SectionEyebrow tone="dark" className="justify-center">
            Gallery
          </SectionEyebrow>
          <h2 className="mt-5 text-4xl lg:text-5xl font-bold">
            Track-side, not stock photos.
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Real karts, real guests, real Saturdays at Speedway 146.
          </p>
        </div>
        <div className="relative" data-aos="fade-up" data-aos-delay="150">
          <div className="relative overflow-hidden">
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div
                key={slideIndex}
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 transition-opacity duration-slow ease-snap ${
                  slideIndex === currentSlide
                    ? "opacity-100 relative"
                    : "opacity-0 absolute inset-0 pointer-events-none"
                }`}
              >
                {getSlideImages(slideIndex).map((image, index) => (
                  <figure
                    key={index}
                    className="relative rounded-md overflow-hidden ring-1 ring-asphalt-700 hover:ring-race-500 transition-[box-shadow,ring-color] duration-base ease-snap group cursor-pointer"
                  >
                    <div className="w-full h-64 bg-asphalt-800 overflow-hidden">
                      <img
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-snap group-hover:scale-110"
                      />
                    </div>
                    <figcaption className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-asphalt-950 via-asphalt-950/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-base">
                      <div className="flex items-center gap-2">
                        <Camera className="h-4 w-4 text-race-500" />
                        <span className="text-sm font-bold text-chalk tracking-wide">
                          {image.title}
                        </span>
                      </div>
                    </figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center mt-10 gap-5">
            <button
              onClick={() => navigateSlide(-1)}
              className="bg-asphalt-800 hover:bg-race-600 text-chalk p-3 rounded-md transition-[background-color,transform] duration-base ease-snap hover:-translate-x-0.5 active:scale-95 shadow-track"
              aria-label="Previous images"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div
              className="flex items-center gap-2"
              role="tablist"
              aria-label="Gallery slides"
            >
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  role="tab"
                  aria-selected={index === currentSlide}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`transition-[width,background-color] duration-base ease-snap rounded-full h-2 ${
                    index === currentSlide
                      ? "bg-race-500 w-10"
                      : "bg-asphalt-700 hover:bg-asphalt-600 w-2"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => navigateSlide(1)}
              className="bg-asphalt-800 hover:bg-race-600 text-chalk p-3 rounded-md transition-[background-color,transform] duration-base ease-snap hover:translate-x-0.5 active:scale-95 shadow-track"
              aria-label="Next images"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
