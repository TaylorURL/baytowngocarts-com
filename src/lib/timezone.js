/**
 * The track's clock.
 *
 * The park is in Baytown and everything a staffer counts is counted in a day
 * that starts and ends there. A day boundary taken off the browser instead
 * moves with whoever opened the panel, so the same afternoon's takings fall
 * under two different days depending on the seat they are read from, and the
 * visits-by-hour histogram shifts the morning rush by the reader's offset.
 *
 * Named rather than offset: the offset moves twice a year, and a fixed -06:00
 * is wrong for two thirds of the calendar.
 */
export const ZONE = "America/Chicago";

const PARTS = new Intl.DateTimeFormat("en-CA", {
  timeZone: ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

/** An instant broken into the numbers the track's clock showed. */
export const partsAt = (value) => {
  const at = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(at.getTime())) return null;
  const found = {};
  for (const part of PARTS.formatToParts(at)) {
    if (part.type !== "literal") found[part.type] = Number(part.value);
  }
  if (found.hour === 24) found.hour = 0;
  return found;
};

/** The hour of the day an instant fell in here, 0 to 23. */
export const hourAt = (value) => partsAt(value)?.hour ?? 0;

/** The calendar date an instant fell on here, as `YYYY-MM-DD`. */
export const dayAt = (value = new Date()) => {
  const found = partsAt(value);
  if (!found) return "";
  return `${found.year}-${String(found.month).padStart(2, "0")}-${String(found.day).padStart(2, "0")}`;
};

/** The year here, for a line that names the business rather than the reader. */
export const yearHere = () =>
  partsAt(new Date())?.year ?? new Date().getUTCFullYear();

const offsetAt = (instant) => {
  const found = partsAt(instant);
  return (
    Date.UTC(
      found.year,
      found.month - 1,
      found.day,
      found.hour,
      found.minute,
      found.second,
    ) - instant.getTime()
  );
};

/**
 * The instant a wall-clock reading here actually happens at.
 *
 * Read twice. The offset has to be read at an instant, and the only instant
 * available to read it at is the answer being solved for, so the first pass is
 * a guess and the second lands on the right side of a daylight saving boundary
 * the guess may have fallen the wrong side of.
 *
 * @param {number} year
 * @param {number} month 1 to 12.
 * @param {number} day
 * @returns {Date} midnight on that day, here.
 */
export const midnightOn = (year, month, day) => {
  const wall = Date.UTC(year, month - 1, day);
  const first = new Date(wall - offsetAt(new Date(wall)));
  return new Date(wall - offsetAt(first));
};
