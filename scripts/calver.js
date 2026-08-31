/**
 * CalVer version bump for baytowngokarts.com.
 *
 * Format: YYYY.WW.PATCH
 *   YYYY  - ISO week-numbering year, which differs from the calendar year
 *           for the days either side of New Year
 *   WW    - ISO week number, zero-padded
 *   PATCH - sequential counter within the week, starting at 0 and reset
 *           whenever the week rolls over
 *
 * Writes the computed version to package.json and public/release.json.
 *
 * Usage: node scripts/calver.js           (bump and write)
 *        node scripts/calver.js --dry-run (print without writing)
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PACKAGE_JSON = join(ROOT, "package.json");
const RELEASE_JSON = join(ROOT, "public", "release.json");

/**
 * ISO weeks are identified by the Thursday they contain, so move to that
 * Thursday first; counting days from January 1 of the Thursday's year then
 * gives the week number directly. Sunday is day 0 in JS but day 7 in ISO.
 */
function isoThursday(date) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  return d;
}

function isoWeek(date) {
  const thursday = isoThursday(date);
  const yearStart = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 1));
  return Math.ceil(((thursday - yearStart) / 86400000 + 1) / 7);
}

/**
 * The year of the week's Thursday owns the week, which is why late December
 * and early January can report a year that is not the calendar year.
 */
function isoWeekYear(date) {
  return isoThursday(date).getUTCFullYear();
}

function nextCalVer(currentVersion) {
  const now = new Date();
  const year = isoWeekYear(now);
  const week = isoWeek(now);
  const weekStr = String(week).padStart(2, "0");

  const parts = currentVersion.split(".").map(Number);
  if (parts[0] === year && parts[1] === week) {
    return `${year}.${weekStr}.${(parts[2] || 0) + 1}`;
  }
  return `${year}.${weekStr}.0`;
}

const pkg = JSON.parse(readFileSync(PACKAGE_JSON, "utf-8"));
const oldVersion = pkg.version;
const newVersion = nextCalVer(oldVersion);

console.log(`[calver] ${oldVersion} -> ${newVersion}`);

if (!process.argv.includes("--dry-run")) {
  pkg.version = newVersion;
  writeFileSync(PACKAGE_JSON, JSON.stringify(pkg, null, 2) + "\n");

  const release = JSON.parse(readFileSync(RELEASE_JSON, "utf-8"));
  release.version = newVersion;
  writeFileSync(RELEASE_JSON, JSON.stringify(release, null, 2) + "\n");
}
