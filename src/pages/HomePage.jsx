import HeroSection from "../components/sections/HeroSection.jsx";
import ThursdaySpecialSection from "../components/sections/ThursdaySpecialSection.jsx";
import PartySection from "../components/sections/PartySection.jsx";
import GallerySection from "../components/sections/GallerySection.jsx";
import FeatureSection from "../components/sections/FeatureSection.jsx";
import AttractionsSection from "../components/sections/AttractionsSection.jsx";
import TestimonialSection from "../components/sections/TestimonialSection.jsx";
import ActionSection from "../components/sections/ActionSection.jsx";

const HomePage = () => (
  <div className="w-full -mt-20">
    <HeroSection />
    <ThursdaySpecialSection />
    <PartySection />
    <GallerySection />
    <FeatureSection />
    <AttractionsSection />
    <TestimonialSection />
    <ActionSection />
  </div>
);
export default HomePage;
