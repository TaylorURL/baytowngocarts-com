import React from 'react';
import HeroSection from '../components/sections/HeroSection.jsx';
import GallarySection from '../components/sections/GallarySection.jsx';
import FeatureSection from '../components/sections/FeatureSection.jsx';
import AttractionsSection from '../components/sections/AttractionsSection.jsx';
import TestimonialSection from '../components/sections/TestimonialSection.jsx';
import ActionSection from '../components/sections/ActionSection.jsx';

const HomePage = () => {
  return (
    <div className="w-full -mt-20">
      <HeroSection />
      <GallarySection />
      <FeatureSection />
      <AttractionsSection />
      <TestimonialSection />
      <ActionSection />
    </div>
  );
};

export default HomePage;