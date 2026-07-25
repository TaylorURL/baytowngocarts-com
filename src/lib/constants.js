// Compatibility barrel. New code should import straight from
// `lib/content/<domain>`; this only exists so older import paths keep resolving.
export {
  HERO_BACKGROUND_IMAGES,
  HERO_STATS,
  SLIDESHOW_INTERVAL_MS,
} from "./content/hero.js";
export {
  GALLERY_IMAGES,
  GALLERY_IMAGES_PER_SLIDE,
} from "./content/gallery.js";
export { NAV_ITEMS } from "./content/navigation.js";
export { BUSINESS_HOURS, CONTACT_INFO, SOCIAL_URLS } from "./content/business.js";
export { BOUNCE_PRICING } from "./content/bounce.js";
export { TESTIMONIALS } from "./content/testimonials.js";
export { FAQS } from "./content/faqs.js";
