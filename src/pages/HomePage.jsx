import HeroSection from "../components/sections/HeroSection.jsx";
import GallerySection from "../components/sections/GallerySection.jsx";
import FeatureSection from "../components/sections/FeatureSection.jsx";
import AttractionsSection from "../components/sections/AttractionsSection.jsx";
import TestimonialSection from "../components/sections/TestimonialSection.jsx";
import ActionSection from "../components/sections/ActionSection.jsx";

/**
 * Landing page that assembles the hero, gallery, features, attractions,
 * testimonials, and call-to-action sections.
 */
const HomePage = () => (
  <div className="w-full -mt-20">
    <HeroSection />
    <GallerySection />
    <FeatureSection />
    <AttractionsSection />
    <TestimonialSection />
    <ActionSection />
  </div>
);

export default HomePage;
