/*
 * The slideshow behind the headline. Intrinsic sizes travel with each frame so
 * the element can reserve its box and pick a width from the srcset before the
 * file lands.
 */
export const HERO_BACKGROUND_IMAGES = [
  { src: "/images/14.webp", width: 1800, height: 1200 },
  { src: "/images/15.webp", width: 1600, height: 2400 },
  { src: "/images/16.webp", width: 1600, height: 2400 },
  { src: "/images/16.webp", width: 1600, height: 2400 },
  { src: "/images/18.webp", width: 1200, height: 1800 },
];

/** The frame the document preloads, and the only one on screen at first paint. */
export const HERO_FIRST_FRAME = HERO_BACKGROUND_IMAGES[0];

export const HERO_STATS = [
  { value: '40"', label: "Kiddie Kart Min" },
  { value: "5:00", label: "Heat Length" },
  {
    value: "$13.99",
    label: "Single Race",
    className: "md:col-span-1 col-span-2",
  },
];

export const SLIDESHOW_INTERVAL_MS = 2000;
