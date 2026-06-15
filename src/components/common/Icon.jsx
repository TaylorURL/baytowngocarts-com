/*
 * Speedway 146 icon family — drawn for the site, not picked from a library.
 *
 * Geometry:    24×24 viewBox, fill="none", stroke-width 1.75, round caps + joins
 * Color:       currentColor — inherits whatever the surrounding text color is
 * Weight:      one weight. Never mix outline with solid in the same surface.
 * Source:      every path is hand-tuned. No lucide-react, no generic stock.
 *
 * Domain icons (flag, helmet, kart, stopwatch, lap, fuel, wrench, trophy,
 * traffic-light, bolt, bouncy-castle, cake, ticket) are drawn for a Texas
 * outdoor go-kart venue. Chrome icons (arrows, chevrons, ui controls) are
 * drawn in the same hand so the family reads as one set.
 *
 * Sizing: use Tailwind h-* w-* on the component as you would a normal icon.
 * The component renders an inline <svg>, so it sizes off the font/text box.
 */

const SVG_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const PATHS = {
  // ── Arrows & chevrons ────────────────────────────────────────────────
  "arrow-right": "M4 12h15M13 5l7 7-7 7",
  "arrow-left": "M20 12H5M11 19l-7-7 7-7",
  "arrow-up": "M12 19V4M5 11l7-7 7 7",
  "arrow-down": "M12 5v15M19 13l-7 7-7-7",
  "chevron-down": "M5 9l7 7 7-7",
  "chevron-up": "M19 15l-7-7-7 7",
  "chevron-left": "M15 6l-7 6 7 6",
  "chevron-right": "M9 6l7 6-7 6",

  // ── Window controls ──────────────────────────────────────────────────
  close: "M6 6l12 12M18 6L6 18",
  menu: "M4 7h16M4 12h16M4 17h16",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  search: "M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM16 16l5 5",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
  "eye-off":
    "M3 3l18 18 M10.6 6.2A10 10 0 0 1 12 6c6.5 0 10 6 10 6a17.7 17.7 0 0 1-3 3.5 M6.3 7.5A18 18 0 0 0 2 12s3.5 6 10 6c1 0 2-.1 2.9-.4 M9.9 9.9a3 3 0 0 0 4.2 4.2",

  // ── Status / validation ──────────────────────────────────────────────
  check: "M5 12l4.5 4.5L20 6",
  "check-circle":
    "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z M8 12l3 3 5-5.5",
  "alert-circle": "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z M12 8v5 M12 16h.01",
  "help-circle":
    "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z M9.5 9.5a2.5 2.5 0 1 1 4.4 1.7c-.7.7-1.9 1.1-1.9 2.3 M12 17h.01",
  star: "M12 3l2.6 5.6 6 .7-4.5 4.2 1.2 6-5.3-3-5.3 3 1.2-6L3 9.3l6-.7L12 3z",
  quote:
    "M7 7c-2 0-3.5 1.6-3.5 3.6 0 1.8 1.4 3.4 3.5 3.4 0 2-1 3-2.5 4 4-1 6-3.5 6-7C10.5 8.5 9 7 7 7z M17.5 7c-2 0-3.5 1.6-3.5 3.6 0 1.8 1.4 3.4 3.5 3.4 0 2-1 3-2.5 4 4-1 6-3.5 6-7C21 8.5 19.5 7 17.5 7z",
  trash:
    "M4 7h16 M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2 M6 7l1 12.5A2 2 0 0 0 9 21h6a2 2 0 0 0 2-1.5L18 7 M10 11v6 M14 11v6",

  // ── Calendar / time ──────────────────────────────────────────────────
  clock: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z M12 7v5l3.5 2",
  calendar:
    "M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z M4 10h16 M9 3v4 M15 3v4",

  // ── Place / contact ──────────────────────────────────────────────────
  "map-pin":
    "M12 22s-7-6.4-7-12.5A7 7 0 0 1 12 2.5a7 7 0 0 1 7 7C19 15.6 12 22 12 22z M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  phone:
    "M4.5 5c.5-1.2 1.6-2 2.8-2H8l1.5 4-1.6 1.2a13 13 0 0 0 6 6L15 12.5l4 1.5v.7c0 1.2-.8 2.3-2 2.8a14.6 14.6 0 0 1-12.5-12.5z",
  mail: "M3 6.5h18v11H3z M3 7l9 7 9-7",
  send: "M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z",
  home: "M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2v-9z",
  globe:
    "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z M3 12h18 M12 3a13.5 13.5 0 0 1 0 18 M12 3a13.5 13.5 0 0 0 0 18",

  // ── Commerce ─────────────────────────────────────────────────────────
  "shopping-cart":
    "M3 4h2.5L7 16h11.5L21 7H7 M9 21a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z M17 21a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z",
  "shopping-bag":
    "M5 7h14l-1.2 13.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 7z M9 7V5a3 3 0 0 1 6 0v2",
  "credit-card":
    "M3 6.5h18v11H3z M3 10.5h18 M7 14.5h4",
  download:
    "M5 20h14 M12 4v12 M7 11l5 5 5-5",
  ticket:
    "M3 9V7h18v2a2 2 0 0 0 0 4v2H3v-2a2 2 0 0 0 0-4z M9 7v10 M14 9.5l1 5",
  gift:
    "M4 12h16v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8z M3 8h18v4H3z M12 21V8 M12 8s-1.5-5-4-5a2 2 0 0 0 0 4h4z M12 8s1.5-5 4-5a2 2 0 0 1 0 4h-4z",
  "dollar-sign":
    "M12 2v20 M17 6.5C15 5 13.5 4.5 12 4.5c-3 0-4 2-4 3.2 0 4 8 2.6 8 6.8 0 1.2-1 3.5-4 3.5-1.7 0-3.5-.7-5-2.3",
  package:
    "M21 8L12 3 3 8v9l9 5 9-5V8z M3 8l9 5 M21 8l-9 5 M12 13v9 M7.5 5.5l9 5",
  "file-text":
    "M6 3h9l5 5v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z M14 3v5h5 M8 13h8 M8 17h6 M8 9h3",

  // ── Account ──────────────────────────────────────────────────────────
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7",
  users:
    "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M2 21c0-3.6 3.1-6 7-6s7 2.4 7 6 M17 4a3 3 0 1 1 0 6 M22 19c0-2.6-1.5-4.5-4-5.5",
  "log-out":
    "M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4 M14 12H4 M8 8l-4 4 4 4",
  shield:
    "M12 3l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z M9 12.5l2.2 2.2L15.5 10",
  briefcase:
    "M3 8h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8z M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M3 13h18",
  "credit-pointer":
    "M5 3l3.5 18 4-7 7-3.5L5 3z",
  "message-square":
    "M21 11.5a8 8 0 0 1-8 8H7l-4 3v-13a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8z",
  heart:
    "M12 20.5S3.5 14 3.5 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8.5 2.5C20.5 14 12 20.5 12 20.5z",

  // ── Domain: kart venue ───────────────────────────────────────────────
  // Tilted flag on a pole with two checker tiles — reads as racing without
  // becoming a 2x2 cliché grid.
  flag:
    "M5 21V3 M5 5c4-3 8 3 13 0v9c-5 3-9-3-13 0 M8 6.5h3v3h-3z M11 9.5h3v3h-3z M8 9.5h3v3 M11 6.5h3v3",

  // Full-face racing helmet, side profile with chinbar and visor.
  helmet:
    "M5 16c0-5.5 3.2-9 7-9s7 3.5 7 9v1H5v-1z M9 11h8 M5 17h14v2.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5V17z M16 7.5l1.5-2",

  // Kart silhouette — wheels, low chassis, driver headrest, exposed engine.
  kart:
    "M3.5 14.5h17 M5 11.5l1.5-3.5h8l2.5 3.5 M5 11.5h13.5 M14.5 11.5v-3 M7 17.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4z M17 17.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4z M19 11.5l1.5 2",

  // Stopwatch — circular face, crown stem at 12, single hand at 2 o'clock.
  stopwatch:
    "M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M12 5V3 M9 3h6 M12 13l3-3 M5.5 6.5l-1.5-1.5 M18.5 6.5L20 5",

  // Lap circuit — racing oval with start/finish line on the left.
  lap:
    "M7 5h10a5 5 0 0 1 0 14H7a5 5 0 0 1 0-14z M5 9.5h2 M5 14.5h2 M3 12h2",

  // Trophy with handles + base.
  trophy:
    "M8 5h8v5a4 4 0 0 1-8 0V5z M8 7H5v2a3 3 0 0 0 3 3 M16 7h3v2a3 3 0 0 1-3 3 M10 14v3h4v-3 M8 20h8 M9 17h6v3H9z",

  // Jerry-can / fuel can — handle on top, cap on side.
  fuel:
    "M4 7h11v13H4z M15 9h1.5l2 2.5v8.5H15 M6 11h7 M15 13.5h2.5 M9 4h6v3H9z",

  // Wrench — head + open jaw.
  wrench:
    "M14.5 3.5a4 4 0 0 0-4 4 4 4 0 0 0 .6 2L3 17.5 6.5 21l6.9-7.9a4 4 0 0 0 4.6-6L15 9l-3-3 2-2.5z",

  // Traffic light starting-grid — three stacked dots in a housing.
  "traffic-light":
    "M9 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M12 8v.01 M12 12v.01 M12 16v.01",

  // Bolt — angular, less twee than Lucide's Zap.
  bolt:
    "M13 2L4 14h6l-1 8 9-12h-6l1-8z",

  // Bouncy castle — three turrets + door.
  "bouncy-castle":
    "M3 20h18 M3 12v8 M21 12v8 M3 12l2-3h2v3 M7 12l2-3h2v3 M11 12l2-3h2v3 M15 12l2-3h2v3 M10 20v-5h4v5",

  // Birthday cake — three candles, two tiers.
  cake:
    "M4 21h16 M5 14h14v7H5z M8 14v-3 M12 14v-3 M16 14v-3 M7.5 9.5C7.5 8.5 8 8 8 7s.5-1.5.5-1.5S8 6 8 7 7.5 8.5 7.5 9.5z M11.5 9.5c0-1 .5-1.5.5-2.5s.5-1.5.5-1.5 0 .5 0 1.5-.5 1.5-.5 2.5z M15.5 9.5c0-1 .5-1.5.5-2.5s.5-1.5.5-1.5 0 .5 0 1.5-.5 1.5-.5 2.5z M5 17h14",

  // ── Analytics ────────────────────────────────────────────────────────
  "bar-chart": "M4 21V10 M10 21V4 M16 21v-8 M22 21v-5",
  "trending-up": "M3 17l6-6 4 4 8-9 M14 6h7v7",
  activity: "M3 12h4l3-9 4 18 3-9h4",
  monitor:
    "M3 5h18v11H3z M3 5h18v11H3z M9 20h6 M12 16v4",
  pointer: "M5 3l3.5 18 4-7 7-3.5L5 3z",

  // ── Social (drawn here so the family stays consistent) ───────────────
  facebook:
    "M14 7h2V4h-3a3 3 0 0 0-3 3v2H8v3h2v8h3v-8h2.5l.5-3H13V7.5A.5.5 0 0 1 13.5 7H14z",
  instagram:
    "M5 5h14v14H5z M16 8.01v.01 M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z",
  tiktok:
    "M16 3v9.5a4 4 0 1 1-4-4M16 3a4 4 0 0 0 4 4",
};

const Icon = ({ name, className = "", strokeWidth, ...rest }) => {
  const d = PATHS[name];
  if (!d) {
    if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
      console.warn(`Icon: unknown name "${name}"`);
    }
    return null;
  }
  const paths = d.split(/\s(?=M)/);
  return (
    <svg
      {...SVG_PROPS}
      strokeWidth={strokeWidth ?? SVG_PROPS.strokeWidth}
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {paths.map((segment, i) => (
        <path key={i} d={segment} />
      ))}
    </svg>
  );
};

export default Icon;
