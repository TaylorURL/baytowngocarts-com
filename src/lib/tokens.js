/*
 * Reads design tokens out of the stylesheet.
 *
 * Canvas and WebGL take colours as strings rather than as CSS, so an effect
 * cannot name a token the way a class can. Resolving the custom property at
 * runtime keeps one source for the palette: Theme.css says what race red is,
 * and the sparks and the particles read it from there.
 */

const cache = new Map();

/** The computed value of a custom property, or the empty string off-browser. */
export function token(name) {
  if (cache.has(name)) return cache.get(name);
  if (typeof window === "undefined") return "";
  const value = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  cache.set(name, value);
  return value;
}

export function tokens(...names) {
  return names.map(token);
}

/**
 * The spark palette, as hex.
 *
 * ogl unpacks hex into floats and cannot parse a colour function, so these
 * three tokens are held as plain hex in Theme.css.
 */
export function sparkPalette() {
  return tokens("--spark-primary", "--spark-secondary", "--spark-tertiary");
}
