import React, { useEffect, useState } from "react";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";

const GallarySection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const images = [
    {
      src: "/images/14.JPEG",
      alt: "Go-kart racing action",
      title: "High-Speed Racing",
    },
    {
      src: "/images/15.JPEG",
      alt: "Kids enjoying the track",
      title: "Kids Racing",
    },
    {
      src: "/images/16.JPEG",
      alt: "Birthday party celebration",
      title: "Birthday Parties",
    },
    {
      src: "/images/18.JPEG",
      alt: "Family fun at Speedway 146",
      title: "Family Fun",
    },
    {
      src: "/images/19.JPEG",
      alt: "Racing excitement",
      title: "Racing Thrills",
    },
    { src: "/images/20.JPEG", alt: "Party celebrations", title: "Party Time" },
    {
      src: "/images/21.JPEG",
      alt: "Speedway 146 facilities",
      title: "Our Facilities",
    },
    { src: "/images/22.JPEG", alt: "Racing action", title: "Racing Action" },
  ];

  useEffect(() => {
    let loadedCount = 0;
    images.forEach((image) => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === images.length) {
          setImagesLoaded(true);
        }
      };
      img.src = image.src;
    });
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(images.length / 4));
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + Math.ceil(images.length / 4)) %
        Math.ceil(images.length / 4),
    );
  };

  const getSlideImages = (slideIndex) => {
    return images.slice(slideIndex * 4, (slideIndex + 1) * 4);
  };

  const totalSlides = Math.ceil(images.length / 4);

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16" data-aos="fade-up">
          <div className="inline-block mb-4 px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold tracking-wider">
            GALLERY
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-6">
            Experience the Action
          </h2>
          <p className="text-xl text-gray-600">
            Take a look at the excitement and fun that awaits you at Speedway
            146
          </p>
        </div>

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
              onClick={prevSlide}
              className="bg-navy-900 hover:bg-navy-800 text-white p-4 rounded-xl transition-all hover:scale-110 shadow-lg"
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
              onClick={nextSlide}
              className="bg-navy-900 hover:bg-navy-800 text-white p-4 rounded-xl transition-all hover:scale-110 shadow-lg"
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
