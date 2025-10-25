import React from 'react';
import Hero from '../components/common/Hero.jsx';
import ImageGallery from '../components/common/ImageGallery.jsx';
import Features from '../components/common/Features.jsx';
import Attractions from '../components/common/Attractions.jsx';
import Testimonials from '../components/common/Testimonials.jsx';
import CTA from '../components/common/CTA.jsx';

const HomePage = () => {
  return (
    <div>
      <Hero />
      <ImageGallery />
      <Features />
      <Attractions />
      <Testimonials />
      <CTA />
    </div>
  );
};

export default HomePage;