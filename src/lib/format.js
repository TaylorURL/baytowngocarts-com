import { ZONE } from "./timezone.js";

/** @example formatCents(1399) // "$13.99" */
export const formatCents = (cents) => `$${(cents / 100).toFixed(2)}`;

/** @example formatDollars(13.99) // "$13.99" */
export const formatDollars = (dollars) => `$${dollars.toFixed(2)}`;

const SHORT_DATETIME_OPTIONS = {
  timeZone: ZONE,
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

const LONG_DATETIME_OPTIONS = {
  timeZone: ZONE,
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

/** "Jun 15, 2026, 02:30 PM" */
export const formatShortDateTime = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", SHORT_DATETIME_OPTIONS);

/** "June 15, 2026, 02:30 PM" */
export const formatLongDateTime = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", LONG_DATETIME_OPTIONS);

const decimalPlaces = (value) => {
  const digits = String(value).split(".")[1];
  return digits && parseInt(digits, 10) !== 0 ? digits.length : 0;
};

/**
 * The formatter a counted stat is written with, shared by the tile that renders
 * the number the count starts on and the animation that carries it to the end,
 * so the two never disagree about how many decimals a figure carries.
 *
 * @param {number} from - the value the count starts on
 * @param {number} to - the value it lands on
 * @param {string} separator - what stands in for the thousands comma
 * @returns {(value: number) => string}
 */
export const countFormatter = (from, to, separator = "") => {
  const places = Math.max(decimalPlaces(from), decimalPlaces(to));
  const options = {
    useGrouping: !!separator,
    minimumFractionDigits: places,
    maximumFractionDigits: places,
  };
  return (value) => {
    const formatted = Intl.NumberFormat("en-US", options).format(value);
    return separator ? formatted.replace(/,/g, separator) : formatted;
  };
};
