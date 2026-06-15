/**
 * Parses a display price string (e.g. "$13.99") into a numeric dollar amount.
 * Tolerant of missing dollar signs and whitespace.
 */
export const parsePriceString = (price) =>
  parseFloat(String(price).replace(/[^0-9.-]/g, "")) || 0;

/**
 * Converts a display price string into integer cents for Stripe / database storage.
 * @example dollarsToCents("$13.99") // 1399
 */
export const priceStringToCents = (price) =>
  Math.round(parsePriceString(price) * 100);
