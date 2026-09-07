import { BRAND } from "../content/brand.js";
import {
  BUSINESS_HOURS,
  CONTACT_INFO,
  SOCIAL_URLS,
} from "../content/business.js";

export const SITE_URL = "https://baytowngokarts.com";
export const SHARE_IMAGE = `${SITE_URL}/images/share-card.jpg`;

const DAY_CODES = {
  Monday: "Mo",
  Tuesday: "Tu",
  Wednesday: "We",
  Thursday: "Th",
  Friday: "Fr",
  Saturday: "Sa",
  Sunday: "Su",
};

/** "5:00 PM to 10:30 PM" as the 24-hour pair schema.org asks for. */
function toTwentyFourHour(label) {
  const match = label.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  const [, rawHour, minute, meridiem] = match;
  let hour = Number(rawHour) % 12;
  if (meridiem.toUpperCase() === "PM") hour += 12;
  return `${String(hour).padStart(2, "0")}:${minute}`;
}

/** "5:00 PM to 10:30 PM" as the two ends of the day it describes. */
function hourEnds(hours) {
  return hours.split(" to ").map((part) => toTwentyFourHour(part.trim()));
}

function openingHoursSpecification() {
  return BUSINESS_HOURS.map(({ day, hours }) => {
    const [opens, closes] = hourEnds(hours);
    return {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${day}`,
      opens,
      closes,
    };
  }).filter((spec) => spec.opens && spec.closes);
}

/** The same hours in the short form, for readers that take only that. */
function compactOpeningHours() {
  return BUSINESS_HOURS.map(({ day, hours }) => {
    const [opens, closes] = hourEnds(hours);
    return opens && closes ? `${DAY_CODES[day]} ${opens}-${closes}` : null;
  }).filter(Boolean);
}

/**
 * The venue itself.
 *
 * One node with an @id every other graph node points at, so a crawler reads
 * the pricing page's offers and this business as the same organisation rather
 * than as two things that happen to share a name.
 */
export function localBusinessSchema() {
  return {
    "@type": "LocalBusiness",
    additionalType: "https://schema.org/AmusementPark",
    "@id": `${SITE_URL}/#business`,
    name: BRAND.name,
    description: BRAND.longTagline,
    url: SITE_URL,
    telephone: CONTACT_INFO.phone,
    email: CONTACT_INFO.email,
    image: SHARE_IMAGE,
    logo: `${SITE_URL}/images/logo.webp`,
    priceRange: "$$",
    foundingDate: BRAND.since,
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT_INFO.addressLine1,
      addressLocality: "Baytown",
      addressRegion: "TX",
      postalCode: "77523",
      addressCountry: "US",
    },
    hasMap: CONTACT_INFO.mapsUrl,
    geo: {
      "@type": "GeoCoordinates",
      latitude: 29.792921,
      longitude: -94.909283,
    },
    openingHours: compactOpeningHours(),
    openingHoursSpecification: openingHoursSpecification(),
    sameAs: Object.values(SOCIAL_URLS),
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: BRAND.name,
    publisher: { "@id": `${SITE_URL}/#business` },
  };
}

export function breadcrumbSchema(crumbs) {
  if (!crumbs || crumbs.length === 0) return null;
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...crumbs].map(
      (crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: `${SITE_URL}${crumb.path}`,
      }),
    ),
  };
}

/**
 * A standing document - the privacy policy, the terms - as an Article.
 *
 * The date is the one the page shows a reader, so the two cannot disagree.
 */
export function articleSchema({ title, description, path, updated }) {
  return {
    "@type": "Article",
    headline: title,
    description,
    mainEntityOfPage: `${SITE_URL}${path}`,
    dateModified: updated,
    author: { "@id": `${SITE_URL}/#business` },
    publisher: { "@id": `${SITE_URL}/#business` },
  };
}

/**
 * A bookable item, as an Offer under the venue.
 *
 * Prices are strings on the page ("$25"), so the numeric part is taken from
 * the same string the reader sees rather than kept as a second copy that can
 * disagree with it.
 */
export function productSchema({ name, description, price, url }) {
  const amount = String(price).replace(/[^0-9.]/g, "");
  return {
    "@type": "Product",
    name,
    description,
    brand: { "@id": `${SITE_URL}/#business` },
    offers: {
      "@type": "Offer",
      price: amount,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}${url}`,
      seller: { "@id": `${SITE_URL}/#business` },
    },
  };
}
