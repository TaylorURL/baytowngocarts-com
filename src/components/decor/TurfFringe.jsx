/*
 * The edge that carries TrackDivider's verge onto whatever the hero above it
 * hands over to. A band ending on a ruled horizontal line reads as two
 * pictures stacked; the same band ending in a shadow and a run of blades
 * hanging over the lip reads as one picture with grass in front of it, which
 * is the whole job of this file. The divider's verge goes into shadow at the
 * value this picks it up on, so the two meet inside a gradient.
 *
 * The blades are generated rather than listed, from a fixed seed, so the run
 * is irregular without hundreds of hand-written coordinates and is identical
 * on the server and in the browser that hydrates it. They are then collapsed
 * into three paths, one per tone, because a hundred and sixty elements is a
 * hundred and fifty-seven more than the drawing needs.
 */

const HEIGHT = 22;
const WIDTH = 1440;

/* Bases along the top edge, tips hanging down: this is the near lip of the
   verge seen from just above it, not grass growing out of the section. */
const TONES = [
  { tone: 700, width: 2.1, opacity: 1 },
  { tone: 600, width: 1.7, opacity: 0.9 },
  { tone: 500, width: 1.3, opacity: 0.75 },
];

const seeded = (seed) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

const BLADES = (() => {
  const rand = seeded(20260905);
  const runs = TONES.map(() => "");
  for (let x = -8; x < WIDTH + 8; x += 5 + rand() * 7) {
    const length = HEIGHT * (0.35 + rand() * 0.65);
    const lean = (rand() - 0.5) * 11;
    const base = Math.round(x * 10) / 10;
    const bucket = Math.floor(rand() * TONES.length);
    runs[bucket] +=
      `M${base} 0 C ${base + lean * 0.25} ${length * 0.45} ` +
      `${base + lean * 0.7} ${length * 0.78} ${base + lean} ${length} `;
  }
  return runs;
})();

const TurfFringe = ({ className = "" }) => (
  /* Grass in front of a section is scenery, and the shadow it hangs over the
     top of that section is scenery too. Neither takes a click off whatever the
     section puts under them. */
  <div className={`pointer-events-none ${className}`} aria-hidden="true">
    <div className="h-28 bg-gradient-to-b from-asphalt-950/50 to-transparent" />
    <svg
      className="absolute inset-x-0 top-0 h-5 w-full md:h-6"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      focusable="false"
    >
      <g fill="none" strokeLinecap="round">
        {TONES.map(({ tone, width, opacity }, i) => (
          <path
            key={tone}
            d={BLADES[i]}
            stroke={`var(--color-turf-${tone})`}
            strokeWidth={width}
            opacity={opacity}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
    </svg>
  </div>
);

export default TurfFringe;
