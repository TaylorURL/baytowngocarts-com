/*
 * Responsive sources for the photographs.
 *
 * Each photograph ships alongside 480, 720, 768 and 960 wide derivatives, so a
 * phone downloads a phone-sized file instead of the desktop one. The names are
 * derived rather than listed: `/images/20.webp` has `/images/20-480.webp`,
 * `/images/20-720.webp`, `/images/20-768.webp` and `/images/20-960.webp` beside
 * it.
 *
 * The 720 is the step a gallery thumbnail lands on. Four to a row at a phone's
 * pixel ratio it asks for about 665 device pixels, and without a candidate
 * between 480 and 960 that request is answered with the 960.
 *
 * The 768 is the step the hero lands on. It paints full bleed, so a phone asks
 * for its whole viewport in device pixels, and the common one - 412 CSS pixels
 * at a ratio of 1.75 - comes to 721. One past the 720, and without this rung
 * that single pixel is answered with the 960.
 */

const VARIANT_WIDTHS = [480, 720, 768, 960];
const LOGO_WIDTHS = [128, 256];

/** The srcset for the wordmark, which ships at its own smaller widths. */
export function logoSrcSet(src, intrinsicWidth) {
  const stem = src.replace(/\.webp$/, "");
  return [
    ...LOGO_WIDTHS.map((width) => `${stem}-${width}.webp ${width}w`),
    `${src} ${intrinsicWidth}w`,
  ].join(", ");
}

/*
 * Intrinsic sizes of the photographs, so a component handed nothing but a path
 * can still reserve the right box and name the right widths.
 */
const PHOTO_SIZES = {
  "/images/14.webp": { width: 1800, height: 1200 },
  "/images/15.webp": { width: 1600, height: 2400 },
  "/images/16.webp": { width: 1600, height: 2400 },
  "/images/18.webp": { width: 1200, height: 1800 },
  "/images/19.webp": { width: 1200, height: 1800 },
  "/images/20.webp": { width: 1600, height: 2400 },
  "/images/21.webp": { width: 1600, height: 2400 },
};

/** The intrinsic box of a photograph, falling back to the commonest shape. */
export function photoSize(src) {
  return PHOTO_SIZES[src] || { width: 1600, height: 2400 };
}

/** The srcset for a photograph, its own file last and widest. */
export function srcSet(src, intrinsicWidth) {
  const stem = src.replace(/\.webp$/, "");
  const widths = VARIANT_WIDTHS.filter((width) => width < intrinsicWidth);
  return [
    ...widths.map((width) => `${stem}-${width}.webp ${width}w`),
    `${src} ${intrinsicWidth}w`,
  ].join(", ");
}
