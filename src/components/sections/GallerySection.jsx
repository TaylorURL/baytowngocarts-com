import { useState } from "react";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "../common/SectionHeading.jsx";
import {
  GALLERY_IMAGES,
  GALLERY_IMAGES_PER_SLIDE,
} from "../../lib/constants.js";
/**
 * Paginated image gallery carousel with slide navigation dots and
 * hover overlays showing each image's title.
 */
const GallarySection = () => {
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
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="GALLERY"
          badgeVariant="red"
          title="Experience the Action"
          subtitle="Take a look at the excitement and fun that awaits you at Speedway 146"
          centered
        />
        <div className="relative" data-aos="fade-up" data-aos-delay="200">
          <div className="relative overflow-hidden">
            {[...Array(totalSlides)].map((_, slideIndex) => (
              <div
                key={slideIndex}
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-500 ${
                  slideIndex === currentSlide
                    ? "opacity-100 relative"
                    : "opacity-0 absolute inset-0 pointer-events-none"
                }`}
              >
                {getSlideImages(slideIndex).map((image, index) => (
                  <div
                    key={index}
                    className="relative rounded-2xl overflow-hidden shadow-xl group cursor-pointer"
                  >
                    <div className="w-full h-64 bg-gray-200 overflow-hidden">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6 pointer-events-none">
                      <div className="text-center">
                        <Camera className="h-6 w-6 text-white mx-auto mb-2" />
                        <h3 className="text-white text-lg font-bold">
                          {image.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center mt-12 gap-6">
            <button
              onClick={() => navigateSlide(-1)}
              className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-xl transition-all hover:scale-110 shadow-lg"
              aria-label="Previous images"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-3">
              {[...Array(totalSlides)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentSlide
                      ? "bg-red-600 w-8 h-3"
                      : "bg-gray-300 hover:bg-gray-400 w-3 h-3"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => navigateSlide(1)}
              className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-xl transition-all hover:scale-110 shadow-lg"
              aria-label="Next images"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default GallarySection;
