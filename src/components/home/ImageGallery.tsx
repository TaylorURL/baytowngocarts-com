import React, { useState } from 'react';

const ImageGallery: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const images = [
    { src: '/images/1.jpg', alt: 'Go-kart racing action', title: 'High-Speed Racing' },
    { src: '/images/2.jpg', alt: 'Kids enjoying bounce house', title: 'Bounce House Fun' },
    { src: '/images/3.jpg', alt: 'Birthday party celebration', title: 'Birthday Parties' },
    { src: '/images/4.jpg', alt: 'Corporate team building event', title: 'Corporate Events' },
    { src: '/images/5.jpg', alt: 'Family fun at Speedway 146', title: 'Family Fun' },
    { src: '/images/6.jpg', alt: 'Racing excitement', title: 'Racing Thrills' },
    { src: '/images/7.jpg', alt: 'Party celebrations', title: 'Party Time' },
    { src: '/images/8.jpg', alt: 'Speedway 146 facilities', title: 'Our Facilities' },
    { src: '/images/9.jpg', alt: 'Racing action', title: 'Racing Action' },
    { src: '/images/10.jpg', alt: 'Family activities', title: 'Family Activities' },
    { src: '/images/11.jpg', alt: 'Go-kart fun', title: 'Go-Kart Fun' },
    { src: '/images/12.jpg', alt: 'Entertainment center', title: 'Entertainment Center' },
    { src: '/images/13.jpg', alt: 'Speedway 146 experience', title: 'Our Experience' },
    { src: '/images/14.jpg', alt: 'Racing thrills', title: 'Racing Thrills' },
    { src: '/images/15.jpg', alt: 'Family entertainment', title: 'Family Entertainment' },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(images.length / 4));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(images.length / 4)) % Math.ceil(images.length / 4));
  };

  const currentImages = images.slice(currentSlide * 4, (currentSlide + 1) * 4);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-4">
            Experience the Action
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Take a look at the excitement and fun that awaits you at Speedway 146.
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-aos="zoom-in">
            {currentImages.map((image, index) => (
              <div
                key={currentSlide * 4 + index}
                className="relative image-hover rounded-lg overflow-hidden shadow-lg group"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <h3 className="text-white text-lg font-semibold">{image.title}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={prevSlide}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Previous
            </button>
            <span className="flex items-center text-gray-600">
              {currentSlide + 1} / {Math.ceil(images.length / 4)}
            </span>
            <button
              onClick={nextSlide}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageGallery;