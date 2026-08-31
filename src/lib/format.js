/** @example formatCents(1399) // "$13.99" */
export const formatCents = (cents) => `$${(cents / 100).toFixed(2)}`;

/** @example formatDollars(13.99) // "$13.99" */
export const formatDollars = (dollars) => `$${dollars.toFixed(2)}`;

const SHORT_DATETIME_OPTIONS = {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

const LONG_DATETIME_OPTIONS = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

const COMPACT_DATETIME_OPTIONS = {
  year: "numeric",
  month: "short",
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

/** "Jun 15, 2026, 02:30 PM" — same output as formatShortDateTime. */
export const formatCompactDateTime = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", COMPACT_DATETIME_OPTIONS);
