import HeroSection from "../components/sections/HeroSection.jsx";
import ThursdaySpecialSection from "../components/sections/ThursdaySpecialSection.jsx";
import PartySection from "../components/sections/PartySection.jsx";
import GallerySection from "../components/sections/GallerySection.jsx";
import FeatureSection from "../components/sections/FeatureSection.jsx";
import AttractionsSection from "../components/sections/AttractionsSection.jsx";
import TestimonialSection from "../components/sections/TestimonialSection.jsx";
import ActionSection from "../components/sections/ActionSection.jsx";
import RouteMeta from "../components/shell/RouteMeta.jsx";
import { SHARE_IMAGE, SITE_URL } from "../lib/seo/schema.js";

export const metadata = {
  title: "Speedway 146 | Go-Kart Racing in Baytown, TX",
  description:
    "Outdoor go-kart racing on TX-146 in Baytown. Five-minute heats, bounce houses and party rooms, open Thursday through Sunday, walk-ins welcome.",
  canonical: "/",
  heroImage: "/images/14.webp",
  robots: "index, follow",
  crumbs: [],
  openGraph: {
    "og:title": "Speedway 146 | Go-Kart Racing in Baytown, TX",
    "og:description":
      "Outdoor go-kart racing on TX-146 in Baytown. Five-minute heats, bounce houses and party rooms, open Thursday through Sunday, walk-ins welcome.",
    "og:url": SITE_URL + "/",
    "og:image": SHARE_IMAGE,
    "og:type": "website",
  },
};

/*
 * Everything under the hero is skipped until it is scrolled towards. The page
 * is eight full-bleed bands, and laying out the seven a visitor has not
 * reached yet is style and layout work paid for at load by every arrival,
 * including the ones who read the hero and call.
 */
const HomePage = () => (
  <div className="w-full -mt-20">
    <RouteMeta metadata={metadata} />
    <HeroSection />
    <div className="section-defer">
      <ThursdaySpecialSection />
    </div>
    <div className="section-defer">
      <PartySection />
    </div>
    <div className="section-defer">
      <GallerySection />
    </div>
    <div className="section-defer">
      <FeatureSection />
    </div>
    <div className="section-defer">
      <AttractionsSection />
    </div>
    <div className="section-defer">
      <TestimonialSection />
    </div>
    <div className="section-defer">
      <ActionSection />
    </div>
  </div>
);
export default HomePage;
