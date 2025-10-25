import React from 'react';
import Hero from '../components/home/Hero';
import VideoSection from '../components/home/VideoSection';
import ImageGallery from '../components/home/ImageGallery';
import Features from '../components/home/Features';
import Attractions from '../components/home/Attractions';
import Testimonials from '../components/home/Testimonials';
import CTA from '../components/home/CTA';

const HomePage = () => {
  return (
    <div>
      <Hero />
      <VideoSection />
      <ImageGallery />
      <Features />
      <Attractions />
      <Testimonials />
      <CTA />
    </div>
  );
};

export default HomePage;