// Strips everything but digits, dot and minus, so "$13.99", "13.99" and
// " $13.99 " all parse. Unparseable input yields 0 rather than NaN.
export const parsePriceString = (price) =>
  parseFloat(String(price).replace(/[^0-9.-]/g, "")) || 0;

/** @example priceStringToCents("$13.99") // 1399 */
export const priceStringToCents = (price) =>
  Math.round(parsePriceString(price) * 100);
