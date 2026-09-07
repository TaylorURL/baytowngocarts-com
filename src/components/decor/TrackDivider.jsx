import { useId } from "react";
import { useLocation } from "react-router-dom";
import TrackSign from "./TrackSign.jsx";

/*
 * The seam between two sections, drawn as a length of track rather than as a
 * rule. Every layer strokes the same centre line, so the gravel, the kerbs,
 * the two edge markings and the dashes between them are exact parallel offsets
 * of one curve: they take the same turns together, hold the same gaps, and
 * cannot converge however wide the viewport gets.
 *
 * The box is stretched to the viewport rather than scaled to it, which keeps
 * the curve full-bleed at any width. Stroke widths and dash lengths are held
 * out of that with non-scaling-stroke, so the markings stay the same weight on
 * a phone and on a 27-inch display, and every texture is built from marks that
 * still read when squeezed or pulled: horizontal for asphalt, upright for
 * turf. What stretching cannot fix is the number of turns, so the narrow
 * layout gets a shorter run of track with one bend in it instead of three
 * switchbacks.
 *
 * The verge is turf rather than a continuation of the section below it, which
 * is what puts the join out of reach of that section's own gradient and washes
 * instead of forever chasing them. TurfFringe carries it the rest of the way.
 */

/* The track is held as nodes with a gradient through each one, not as flat
   straights bolted to symmetrical corners. Every segment is a cubic whose
   handles run along those gradients, so the curve is continuous everywhere,
   and because a node's gradient is set independently of the chord it sits on,
   a straight carries a little bow and no two corners share a radius. `hIn`
   and `hOut` are the handle lengths: unequal ones tighten a corner's entry
   against its exit, which is what stops three turns reading as one turn drawn
   three times.

   `turn` marks a segment as a corner, which is what earns it kerbing, and
   `patch` marks one as resurfaced. `line` is the racing line: not the middle
   of the road but the way round it, wide on the approach, tight at the apex,
   drifting out again after. It is why the dark strip crosses the dashes
   instead of lying under them. */

/* Every page draws a different stretch of the same lap, and every stretch
   enters and leaves on the same height and the same gradient. That is what
   makes them join: whichever page a visitor came from, the track carries on
   from where it left the last one rather than jumping. Only the middle is
   the page's own. */
const JOIN = {
  wide: { y: 104, g: 0.012 },
  narrow: { y: 90, g: 0.016 },
};

const PATTERNS = {
  home: {
    wide: {
      lead: 130,
      tail: 60,
      close: true,
      mid: [
        { x: 170, y: 107, g: 0.014, hIn: 80, hOut: 140 },
        { x: 430, y: 48, g: -0.01, hIn: 110, hOut: 90, turn: true },
        { x: 640, y: 45, g: -0.006, hIn: 80, hOut: 160, patch: true },
        { x: 930, y: 126, g: 0.012, hIn: 120, hOut: 80, turn: true },
        { x: 1120, y: 128, g: 0.008, hIn: 70, hOut: 130 },
        { x: 1300, y: 88, g: -0.014, hIn: 110, hOut: 60, turn: true },
      ],
    },
    narrow: {
      lead: 40,
      tail: 90,
      mid: [
        { x: 120, y: 92, g: 0.018, hIn: 36, hOut: 64 },
        { x: 250, y: 44, g: -0.01, hIn: 56, hOut: 44, turn: true, patch: true },
      ],
    },
  },

  about: {
    wide: {
      lead: 150,
      tail: 220,
      mid: [
        { x: 260, y: 108, g: 0.012, hIn: 90, hOut: 170 },
        { x: 620, y: 134, g: 0.004, hIn: 150, hOut: 150, turn: true },
        {
          x: 950,
          y: 58,
          g: -0.01,
          hIn: 160,
          hOut: 150,
          turn: true,
          patch: true,
        },
      ],
    },
    narrow: {
      lead: 60,
      tail: 80,
      mid: [
        { x: 180, y: 100, g: 0.006, hIn: 70, hOut: 64, turn: true },
        { x: 330, y: 50, g: -0.01, hIn: 64, hOut: 56, turn: true, patch: true },
      ],
    },
  },

  pricing: {
    wide: {
      lead: 170,
      tail: 170,
      mid: [
        { x: 330, y: 96, g: -0.03, hIn: 130, hOut: 170, turn: true },
        {
          x: 760,
          y: 46,
          g: 0,
          hIn: 200,
          hOut: 190,
          turn: true,
          patch: true,
        },
        { x: 1120, y: 100, g: 0.02, hIn: 150, hOut: 130, turn: true },
      ],
    },
    narrow: {
      lead: 90,
      tail: 130,
      mid: [
        { x: 240, y: 44, g: 0, hIn: 100, hOut: 96, turn: true, patch: true },
      ],
    },
  },

  events: {
    wide: {
      lead: 90,
      tail: 110,
      mid: [
        { x: 210, y: 78, g: -0.012, hIn: 90, hOut: 80, turn: true },
        { x: 470, y: 126, g: 0.01, hIn: 110, hOut: 90, turn: true },
        { x: 720, y: 62, g: -0.012, hIn: 100, hOut: 90, turn: true },
        {
          x: 990,
          y: 124,
          g: 0.01,
          hIn: 110,
          hOut: 100,
          turn: true,
          patch: true,
        },
        { x: 1230, y: 82, g: -0.012, hIn: 100, hOut: 70, turn: true },
      ],
    },
    narrow: {
      lead: 40,
      tail: 36,
      close: true,
      mid: [
        { x: 130, y: 56, g: -0.01, hIn: 50, hOut: 44, turn: true },
        {
          x: 290,
          y: 104,
          g: 0.01,
          hIn: 60,
          hOut: 52,
          turn: true,
          patch: true,
        },
        { x: 400, y: 64, g: -0.012, hIn: 48, hOut: 34, turn: true },
      ],
    },
  },

  contact: {
    wide: {
      lead: 160,
      tail: 150,
      mid: [
        { x: 380, y: 52, g: -0.014, hIn: 170, hOut: 150, turn: true },
        { x: 820, y: 44, g: 0.002, hIn: 200, hOut: 190, patch: true },
        { x: 1180, y: 120, g: 0.01, hIn: 170, hOut: 150, turn: true },
      ],
    },
    narrow: {
      lead: 60,
      tail: 80,
      mid: [
        { x: 170, y: 48, g: -0.008, hIn: 70, hOut: 60, turn: true },
        { x: 330, y: 44, g: 0.004, hIn: 70, hOut: 70, patch: true },
      ],
    },
  },

  faq: {
    wide: {
      lead: 140,
      tail: 200,
      mid: [
        { x: 300, y: 132, g: 0.008, hIn: 140, hOut: 130, turn: true },
        { x: 640, y: 128, g: -0.004, hIn: 150, hOut: 160, patch: true },
        { x: 1000, y: 52, g: -0.012, hIn: 170, hOut: 150, turn: true },
      ],
    },
    narrow: {
      lead: 60,
      tail: 70,
      mid: [
        { x: 190, y: 106, g: 0.006, hIn: 70, hOut: 64, turn: true },
        { x: 360, y: 48, g: -0.01, hIn: 70, hOut: 64, turn: true, patch: true },
      ],
    },
  },

  legal: {
    wide: {
      lead: 190,
      tail: 230,
      mid: [
        { x: 420, y: 78, g: -0.01, hIn: 200, hOut: 190, turn: true },
        { x: 900, y: 62, g: 0.006, hIn: 220, hOut: 210, patch: true },
      ],
    },
    narrow: {
      lead: 100,
      tail: 120,
      mid: [
        { x: 250, y: 62, g: 0, hIn: 100, hOut: 96, turn: true, patch: true },
      ],
    },
  },

  account: {
    wide: {
      lead: 120,
      tail: 130,
      mid: [
        { x: 290, y: 126, g: 0.01, hIn: 130, hOut: 120, turn: true },
        { x: 560, y: 70, g: -0.012, hIn: 120, hOut: 110, turn: true },
        {
          x: 860,
          y: 124,
          g: 0.01,
          hIn: 130,
          hOut: 120,
          turn: true,
          patch: true,
        },
        { x: 1160, y: 66, g: -0.012, hIn: 130, hOut: 120, turn: true },
      ],
    },
    narrow: {
      lead: 50,
      tail: 80,
      mid: [
        { x: 150, y: 104, g: 0.008, hIn: 56, hOut: 50, turn: true },
        { x: 300, y: 52, g: -0.01, hIn: 60, hOut: 54, turn: true, patch: true },
      ],
    },
  },
};

/* Routes the site actually has. Anything else - a query string, a trailing
   segment, a page added later - falls through to a stretch chosen from the
   path itself, so an unknown route still gets a stable shape rather than the
   same one every time. */
const ROUTE_STRETCH = {
  "/": "home",
  "/about": "about",
  "/pricing": "pricing",
  "/events": "events",
  "/contact": "contact",
  "/faq": "faq",
  "/privacy": "legal",
  "/terms": "legal",
  "/cart": "account",
  "/dashboard": "account",
  "/staff": "account",
  "/traffic": "account",
};

const NAMES = Object.keys(PATTERNS);

const stretchFor = (pathname = "/") => {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (ROUTE_STRETCH[path]) return ROUTE_STRETCH[path];
  if (path.startsWith("/purchase")) return "account";
  let sum = 0;
  for (let i = 0; i < path.length; i += 1) sum += path.charCodeAt(i);
  return NAMES[sum % NAMES.length];
};

const WIDE = {
  key: "wide",
  width: 1440,
  height: 188,
  road: 46,
  dash: [22, 18],
};
const NARROW = {
  key: "narrow",
  width: 480,
  height: 132,
  road: 40,
  dash: [16, 14],
};

const nodesOf = (shape, stretch) => {
  const p = PATTERNS[stretch][shape.key];
  const join = JOIN[shape.key];
  return [
    { x: 0, ...join, hOut: p.lead },
    ...p.mid,
    { x: shape.width, ...join, hIn: p.tail, turn: p.close },
  ];
};

/* The racing line is derived rather than drawn: it leans to the outside of
   the road on the way into a corner and to the inside through it, which is
   the shape a driver makes and the shape an offset of the centre never is.
   A node's own gradient says which way the road is about to bend, so the
   lean falls out of the geometry instead of being a second hand-drawn path
   per page. */
const SWING = 560;
const MAX_SWING = 7;

const lineOf = (nodes) =>
  nodes.map((n, i) => {
    const next = nodes[i + 1] ?? n;
    const prev = nodes[i - 1] ?? n;
    const bend = (next.g - prev.g) * SWING;
    const lean = Math.max(-MAX_SWING, Math.min(MAX_SWING, -bend));
    return { ...n, y: n.y + lean, turn: false, patch: false };
  });

/* Everything outward of the road surface, as widths added to it. */
const GRAVEL = 15;
const EDGE = 6;
const KERB = 16;
const RIM = 19;

/* The strip the karts actually polish, as a fraction of the road. */
const LINE = 0.52;

const round = (n) => Math.round(n * 100) / 100;

const curveTo = (a, b) =>
  `C ${a.x + a.hOut} ${round(a.y + a.hOut * a.g)} ` +
  `${b.x - b.hIn} ${round(b.y - b.hIn * b.g)} ${b.x} ${b.y}`;

const pathOf = (nodes) =>
  nodes.reduce(
    (d, n, i) => (i ? `${d} ${curveTo(nodes[i - 1], n)}` : `M ${n.x} ${n.y}`),
    "",
  );

/* The segments carrying a flag, each drawn on its own so a kerb or a patch
   starts and stops where the thing it belongs to does. */
const segmentsOf = (nodes, flag) =>
  nodes.flatMap((n, i) =>
    i && n[flag]
      ? [`M ${nodes[i - 1].x} ${nodes[i - 1].y} ${curveTo(nodes[i - 1], n)}`]
      : [],
  );

/* Two tones and three sizes, so the aggregate does not read as one repeated
   stamp at the width the pattern tiles. */
const GRAIN = [
  { x: 4, y: 6, w: 7, o: 0.5, t: 500 },
  { x: 26, y: 2, w: 5, o: 0.3, t: 400 },
  { x: 48, y: 9, w: 8, o: 0.44, t: 500 },
  { x: 71, y: 4, w: 4, o: 0.26, t: 400 },
  { x: 12, y: 15, w: 5, o: 0.38, t: 500 },
  { x: 37, y: 19, w: 9, o: 0.5, t: 600 },
  { x: 60, y: 16, w: 4, o: 0.24, t: 400 },
  { x: 84, y: 21, w: 6, o: 0.4, t: 500 },
  { x: 2, y: 27, w: 6, o: 0.3, t: 400 },
  { x: 22, y: 31, w: 8, o: 0.46, t: 500 },
  { x: 52, y: 29, w: 5, o: 0.28, t: 600 },
  { x: 76, y: 34, w: 7, o: 0.36, t: 500 },
  { x: 66, y: 25, w: 4, o: 0.2, t: 400 },
  { x: 32, y: 11, w: 4, o: 0.22, t: 600 },
];

const BLADES = [
  { x: 3, y: 18, h: 7, o: 0.34, t: 500 },
  { x: 9, y: 20, h: 5, o: 0.22, t: 400 },
  { x: 16, y: 15, h: 9, o: 0.3, t: 300 },
  { x: 23, y: 21, h: 6, o: 0.18, t: 400 },
  { x: 30, y: 17, h: 8, o: 0.32, t: 500 },
  { x: 37, y: 22, h: 5, o: 0.2, t: 400 },
  { x: 44, y: 16, h: 8, o: 0.22, t: 300 },
  { x: 51, y: 20, h: 6, o: 0.16, t: 400 },
  { x: 58, y: 18, h: 9, o: 0.3, t: 500 },
  { x: 6, y: 4, h: 6, o: 0.34, t: 700 },
  { x: 20, y: 2, h: 8, o: 0.38, t: 700 },
  { x: 34, y: 5, h: 5, o: 0.3, t: 700 },
  { x: 47, y: 3, h: 7, o: 0.36, t: 700 },
  { x: 61, y: 6, h: 6, o: 0.32, t: 700 },
];

/* A second, coarser pass on a tile size that shares no factor with the first.
   Two patterns that never line up read as a field; one on its own reads as
   wallpaper by about the third repeat. */
const CLUMPS = [
  { x: 11, y: 26, h: 15, o: 0.26, t: 400 },
  { x: 15, y: 30, h: 11, o: 0.2, t: 500 },
  { x: 43, y: 12, h: 13, o: 0.22, t: 400 },
  { x: 47, y: 16, h: 9, o: 0.16, t: 500 },
  { x: 79, y: 41, h: 14, o: 0.24, t: 300 },
  { x: 83, y: 45, h: 10, o: 0.18, t: 500 },
  { x: 108, y: 7, h: 12, o: 0.2, t: 400 },
  { x: 112, y: 11, h: 8, o: 0.15, t: 500 },
  { x: 63, y: 55, h: 11, o: 0.19, t: 400 },
  { x: 127, y: 33, h: 13, o: 0.21, t: 400 },
  { x: 29, y: 49, h: 9, o: 0.17, t: 500 },
  { x: 95, y: 22, h: 12, o: 0.2, t: 400 },
];

/* Sparse and taller, on a third tile size again coprime with the other two.
   Three patterns whose periods only coincide every few thousand pixels is
   what keeps a verge from repeating inside one screen. */
const SPRIGS = [
  { x: 17, y: 9, h: 19, o: 0.18, t: 300 },
  { x: 21, y: 14, h: 13, o: 0.14, t: 400 },
  { x: 74, y: 47, h: 17, o: 0.16, t: 300 },
  { x: 78, y: 51, h: 12, o: 0.12, t: 400 },
  { x: 131, y: 22, h: 20, o: 0.17, t: 300 },
  { x: 136, y: 27, h: 14, o: 0.13, t: 400 },
  { x: 168, y: 63, h: 16, o: 0.15, t: 300 },
  { x: 44, y: 68, h: 15, o: 0.14, t: 400 },
  { x: 196, y: 36, h: 18, o: 0.16, t: 300 },
  { x: 104, y: 57, h: 13, o: 0.12, t: 400 },
];

/* Ground that is all one green is a fill, not a field. */
const MOTTLE = [
  { cx: 34, cy: 26, rx: 46, ry: 21, light: true },
  { cx: 128, cy: 71, rx: 58, ry: 26, light: false },
  { cx: 168, cy: 18, rx: 39, ry: 17, light: true },
  { cx: 71, cy: 96, rx: 52, ry: 22, light: false },
  { cx: 186, cy: 88, rx: 34, ry: 19, light: true },
  { cx: 14, cy: 62, rx: 41, ry: 24, light: false },
];

const Track = ({ shape, stretch, className }) => {
  const uid = useId();
  const turfId = `track-turf-${uid}`;
  const footId = `track-foot-${uid}`;
  const surfaceId = `track-surface-${uid}`;
  const bladesId = `track-blades-${uid}`;
  const clumpsId = `track-clumps-${uid}`;
  const sprigsId = `track-sprigs-${uid}`;
  const mottleId = `track-mottle-${uid}`;
  const blobUpId = `track-blob-up-${uid}`;
  const blobDownId = `track-blob-down-${uid}`;
  const mowId = `track-mow-${uid}`;
  const grainId = `track-grain-${uid}`;
  const kerbId = `track-kerb-${uid}`;

  const nodes = nodesOf(shape, stretch);
  const run = pathOf(nodes);
  const line = pathOf(lineOf(nodes));
  const corners = segmentsOf(nodes, "turn");
  const patches = segmentsOf(nodes, "patch");

  /* The same curve closed against the bottom corners. Everything under the
     track is verge, edge to edge, and the ribbon covers the join. */
  const verge = `${run} L ${shape.width} ${shape.height} L 0 ${shape.height} Z`;

  const upright = (marks, tone) =>
    marks.map(({ x, y, h, o, t }) => (
      <rect
        key={`${x}-${y}`}
        x={x}
        y={y}
        width="1.6"
        height={h}
        rx="0.8"
        fill={`var(--color-${tone}-${t})`}
        opacity={o}
      />
    ));

  return (
    <svg
      className={className}
      style={{ height: shape.height }}
      viewBox={`0 0 ${shape.width} ${shape.height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Light falls down the band, on the verge and on the surface alike. */}
        <linearGradient
          id={turfId}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="0"
          y2={shape.height}
        >
          <stop offset="0" stopColor="var(--color-turf-500)" />
          <stop offset="0.5" stopColor="var(--color-turf-600)" />
          <stop offset="1" stopColor="var(--color-turf-700)" />
        </linearGradient>

        <linearGradient
          id={surfaceId}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="0"
          y2={shape.height}
        >
          <stop offset="0" stopColor="var(--color-asphalt-700)" />
          <stop offset="1" stopColor="var(--color-asphalt-900)" />
        </linearGradient>

        {/* The last of the verge goes into shadow, and the section arriving
            underneath picks that shadow up at the value it ends on, so the two
            meet inside a gradient instead of on a ruled line. */}
        <linearGradient
          id={footId}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1={shape.height - 62}
          x2="0"
          y2={shape.height}
        >
          <stop
            offset="0"
            stopColor="var(--color-asphalt-950)"
            stopOpacity="0"
          />
          <stop
            offset="1"
            stopColor="var(--color-asphalt-950)"
            stopOpacity="0.5"
          />
        </linearGradient>

        {/* Kerbing runs across the road, and the road is never steeper than
            its corners, so upright bars stay square to it at every point the
            kerb exists. Upright is also the one angle a stretched viewBox
            cannot skew. */}
        <pattern
          id={kerbId}
          width="26"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <rect width="26" height="8" fill="var(--color-chalk)" />
          <rect width="13" height="8" fill="var(--color-race-600)" />
        </pattern>

        {/* A mown verge is banded, and the bands are the one grass cue that
            survives being stretched sideways because they run that way. */}
        <pattern id={mowId} width="8" height="47" patternUnits="userSpaceOnUse">
          <rect
            width="8"
            height="23"
            fill="var(--color-chalk)"
            opacity="0.022"
          />
        </pattern>

        <pattern
          id={bladesId}
          width="68"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          {upright(BLADES, "turf")}
        </pattern>

        <pattern
          id={clumpsId}
          width="137"
          height="61"
          patternUnits="userSpaceOnUse"
        >
          {upright(CLUMPS, "turf")}
        </pattern>

        <pattern
          id={sprigsId}
          width="211"
          height="83"
          patternUnits="userSpaceOnUse"
        >
          {upright(SPRIGS, "turf")}
        </pattern>

        <radialGradient id={blobUpId}>
          <stop
            offset="0"
            stopColor="var(--color-turf-400)"
            stopOpacity="0.3"
          />
          <stop offset="1" stopColor="var(--color-turf-400)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={blobDownId}>
          <stop
            offset="0"
            stopColor="var(--color-turf-700)"
            stopOpacity="0.5"
          />
          <stop offset="1" stopColor="var(--color-turf-700)" stopOpacity="0" />
        </radialGradient>

        <pattern
          id={mottleId}
          width="199"
          height="107"
          patternUnits="userSpaceOnUse"
        >
          {MOTTLE.map(({ cx, cy, rx, ry, light }) => (
            <ellipse
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              fill={`url(#${light ? blobUpId : blobDownId})`}
            />
          ))}
        </pattern>

        <pattern
          id={grainId}
          width="96"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          {GRAIN.map(({ x, y, w, o, t }) => (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={w}
              height="1.6"
              rx="0.8"
              fill={`var(--color-asphalt-${t})`}
              opacity={o}
            />
          ))}
        </pattern>
      </defs>

      <path d={verge} fill={`url(#${turfId})`} />
      <path d={verge} fill={`url(#${mottleId})`} />
      <path d={verge} fill={`url(#${mowId})`} />
      <path d={verge} fill={`url(#${bladesId})`} />
      <path d={verge} fill={`url(#${clumpsId})`} />
      <path d={verge} fill={`url(#${sprigsId})`} />
      <path d={verge} fill={`url(#${footId})`} />

      {/* Gravel between the markings and the grass, which is what a track has
          everywhere it has not got a kerb. */}
      <path
        d={run}
        fill="none"
        stroke="var(--color-asphalt-600)"
        strokeWidth={shape.road + GRAVEL}
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={run}
        fill="none"
        stroke={`url(#${grainId})`}
        strokeWidth={shape.road + GRAVEL}
        opacity="0.7"
        vectorEffect="non-scaling-stroke"
      />

      {/* Kerbs belong to the turns and stop where the turn does, which is what
          the straights are for. The rim under them keeps the kerbing off the
          gravel it would otherwise sit flush against. */}
      {corners.map((d) => (
        <path
          key={`rim-${d}`}
          d={d}
          fill="none"
          stroke="var(--color-asphalt-950)"
          strokeWidth={shape.road + RIM}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {corners.map((d) => (
        <path
          key={`kerb-${d}`}
          d={d}
          fill="none"
          stroke={`url(#${kerbId})`}
          strokeWidth={shape.road + KERB}
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {/* Edge markings, then the road laid over their middle. What is left of
          the wide stroke is one marking down each side. */}
      <path
        d={run}
        fill="none"
        stroke="var(--color-caution-500)"
        strokeWidth={shape.road + EDGE}
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={run}
        fill="none"
        stroke={`url(#${surfaceId})`}
        strokeWidth={shape.road}
        vectorEffect="non-scaling-stroke"
      />

      {/* Resurfaced stretches, which start and stop on a butt cap because
          that is what a resurfacing joint looks like. */}
      {patches.map((d) => (
        <path
          key={`patch-${d}`}
          d={d}
          fill="none"
          stroke="var(--color-asphalt-700)"
          strokeWidth={shape.road}
          opacity="0.4"
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {/* The racing line: wide on the approach, tight at the apex, drifting
          out again after, darker because it is the part that gets driven. */}
      <path
        d={line}
        fill="none"
        stroke="var(--color-asphalt-950)"
        strokeWidth={shape.road * LINE}
        strokeLinecap="round"
        opacity="0.24"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={run}
        fill="none"
        stroke={`url(#${grainId})`}
        strokeWidth={shape.road}
        vectorEffect="non-scaling-stroke"
      />

      {/* The centre line rides the same curve as everything else, so it stays
          equidistant from both edges through every turn. */}
      <path
        d={run}
        fill="none"
        stroke="var(--color-chalk)"
        strokeWidth="3"
        strokeDasharray={shape.dash.join(" ")}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

const TrackDivider = ({ className = "", sign = false }) => {
  const { pathname } = useLocation();
  const stretch = stretchFor(pathname);

  return (
    /* The band is scenery and nothing in it is a target, so it takes no
       clicks. Its shading reaches 11rem above the drawing, over ground the
       hero puts its own controls on, and an element that paints there without
       saying this swallows every one of them. */
    <div className={`pointer-events-none ${className}`} aria-hidden="true">
      {/* The photograph above settles into the scene rather than being cut off
          by it: the ground darkens on the way down to the track, so the band is
          the floor of the hero and not a strip parked under it. It sits behind
          the drawing, so only the photograph is shaded. */}
      <span className="absolute inset-x-0 bottom-0 h-[calc(100%+11rem)] bg-gradient-to-b from-transparent via-asphalt-950/25 to-asphalt-950/60" />
      <Track
        shape={NARROW}
        stretch={stretch}
        className="relative block w-full md:hidden"
      />
      <Track
        shape={WIDE}
        stretch={stretch}
        className="relative hidden w-full md:block"
      />
      {sign && <TrackSign />}
    </div>
  );
};

export default TrackDivider;
