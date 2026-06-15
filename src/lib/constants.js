/**
 * Aggregator for content data. Content lives in domain-specific files
 * under `lib/content/` — this barrel re-exports them so older imports
 * keep working. Prefer importing directly from `lib/content/<domain>`
 * in new code.
 */
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
