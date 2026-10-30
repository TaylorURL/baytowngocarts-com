import { partsAt } from "../timezone.js";
import { BUSINESS_HOURS } from "./business.js";

/*
 * November, the one month the gate also opens on Thursday.
 *
 * The standing week is Friday to Sunday and lives in `business.js`. This is
 * the exception on top of it: the extra night, the price that runs on it, and
 * the date it stops. Everything a visitor reads about the promotion comes
 * from this one object, so the band on the home page, the two hours lists,
 * the FAQ answer and the structured data cannot end up advertising different
 * months or different money.
 *
 * `extraDay` is shaped like a `BUSINESS_HOURS` row on purpose: the lists
 * append it rather than keeping a second November copy of the whole week.
 */

/** The last day the promotion runs, read on the track's clock. */
const LAST_DAY = { year: 2026, month: 11, day: 30 };

const asNumber = ({ year, month, day }) => year * 10000 + month * 100 + day;

export const NOVEMBER_PROMO = {
  badge: "November Only",
  eyebrow: "November Only",
  title: "$5 Go-Kart Rides",
  price: "$5",
  unit: "per ride, plus tax",
  days: "Every Thursday & Friday",
  time: "5:00 PM to 10:30 PM",
  description:
    "For November only we open an extra night. Every Thursday and Friday in November, a go-kart ride is $5 from 5:00 PM to 10:30 PM. The gate goes back to Friday through Sunday in December.",
  highlights: [
    "November only",
    "Every Thursday and Friday",
    "5:00 PM to 10:30 PM",
    "$5 a ride, no wristband needed",
  ],

  /** The hours claim, long and short, for the month the exception runs. */
  hoursNote: "Open Thursday to Sunday in November",
  shortHoursNote: "Open Thu to Sun in November",
  closedDaysNote: "Closed Monday to Wednesday in November",

  /** The extra night, as an hours row, tagged so a list can say why. */
  extraDay: {
    day: "Thursday",
    hours: "5:00 PM to 10:30 PM",
    note: "November only",
  },

  /** The window Google is told the extra night is good for. */
  validFrom: "2026-11-01",
  validThrough: "2026-11-30",
};

/**
 * Whether the promotion has run out.
 *
 * Read on the track's clock rather than the reader's: a visitor in a zone
 * ahead of Baytown would otherwise lose the last night of the month hours
 * before the gate there closes on it.
 *
 * @param {Date} [now]
 * @returns {boolean} true once the day in Baytown is past the last day.
 */
export const novemberPromoOver = (now = new Date()) => {
  const at = partsAt(now);
  return at ? asNumber(at) > asNumber(LAST_DAY) : false;
};

/**
 * The days to print, with the extra night in front while it is running.
 *
 * @param {boolean} promoOn
 * @returns {Array<{day: string, hours: string, note?: string}>}
 */
export const hoursToPrint = (promoOn) =>
  promoOn ? [NOVEMBER_PROMO.extraDay, ...BUSINESS_HOURS] : BUSINESS_HOURS;
