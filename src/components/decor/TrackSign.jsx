import { logoSrcSet } from "../../lib/images.js";

/*
 * The trackside board that stands in the verge of TrackDivider, planted under
 * the long straight on each layout because that is the one stretch with turf
 * deep enough to take it. It stands nearer than the track does, so it crosses
 * in front of the road on its way up into the photograph above.
 */

/* Grass grows around a post, not in front of it, so each foot gets two
   clumps with the post between them in paint order: the back set is what the
   post stands behind, the front set is what closes over it. One wide
   symmetrical band across both posts reads as a sticker; two clumps that each
   swallow a foot read as ground. */
const BEHIND = [
  { d: "M4 31 C 5 21 4 14 1 9", t: 700, w: 1.9 },
  { d: "M11 28 C 11 20 13 13 17 7", t: 700, w: 2.1 },
  { d: "M17 31 C 16 21 15 15 12 11", t: 700, w: 1.7 },
  { d: "M23 27 C 24 19 26 12 30 6", t: 700, w: 2.2 },
  { d: "M28 30 C 28 20 27 13 25 8", t: 700, w: 2 },
  { d: "M33 28 C 34 19 36 12 40 5", t: 700, w: 2.1 },
  { d: "M38 31 C 37 21 36 15 33 10", t: 700, w: 1.8 },
  { d: "M44 29 C 45 20 47 13 51 8", t: 700, w: 2 },
  { d: "M50 31 C 49 21 48 15 46 11", t: 700, w: 1.7 },
  { d: "M56 28 C 57 20 58 14 60 9", t: 700, w: 1.9 },
];

const INFRONT = [
  { d: "M2 31 C 3 23 2 18 0 15", t: 700, w: 1.5 },
  { d: "M6 28 C 6 22 8 16 11 11", t: 600, w: 1.7 },
  { d: "M10 31 C 9 24 8 19 6 16", t: 700, w: 1.4 },
  { d: "M14 27 C 15 21 17 15 20 10", t: 500, w: 1.8 },
  { d: "M18 30 C 17 23 16 18 14 14", t: 600, w: 1.5 },
  { d: "M21 31 C 22 24 23 19 25 16", t: 700, w: 1.3 },
  { d: "M25 28 C 24 21 23 15 20 11", t: 600, w: 1.7 },
  { d: "M28 27 C 29 20 31 14 34 9", t: 500, w: 1.8 },
  { d: "M31 31 C 30 23 29 18 27 14", t: 700, w: 1.5 },
  { d: "M35 29 C 36 22 38 16 41 12", t: 600, w: 1.7 },
  { d: "M39 31 C 38 24 37 20 35 17", t: 700, w: 1.3 },
  { d: "M43 27 C 44 21 46 15 49 11", t: 500, w: 1.8 },
  { d: "M47 30 C 46 23 45 18 43 15", t: 600, w: 1.5 },
  { d: "M51 28 C 52 22 54 17 57 13", t: 600, w: 1.6 },
  { d: "M55 31 C 54 24 53 20 51 17", t: 700, w: 1.4 },
  { d: "M58 29 C 59 22 60 17 60 14", t: 600, w: 1.5 },
];

/* This drawing keeps its proportions: blades that lean are the point of it,
   and the stretched box the track uses to go full-bleed would flatten them. */
const Clump = ({ blades, className, flip = false }) => (
  <svg
    className={`${className}${flip ? " -scale-x-100" : ""}`}
    viewBox="0 0 60 30"
    preserveAspectRatio="xMidYMax meet"
    aria-hidden="true"
    focusable="false"
  >
    <g fill="none" strokeLinecap="round" opacity="0.85">
      {blades.map(({ d, t, w }) => (
        <path key={d} d={d} stroke={`var(--color-turf-${t})`} strokeWidth={w} />
      ))}
    </g>
  </svg>
);

/* Tight and dark where a post meets the ground. A single soft blob under the
   whole sign says the board is hovering; a small hard one under each foot is
   what says it is standing. */
const Foot = ({ className }) => (
  <span
    className={className}
    style={{
      background:
        "radial-gradient(ellipse at center, color-mix(in srgb, var(--color-asphalt-950) 85%, transparent) 0, transparent 70%)",
    }}
    aria-hidden="true"
  />
);

/* A pole is round, and the one cue that says so on a bar two pixels wide is
   the light running down one side of it and not the other. */
const POST =
  "block w-1 bg-[linear-gradient(90deg,var(--color-asphalt-700),var(--color-asphalt-400)_38%,var(--color-asphalt-600)_70%,var(--color-asphalt-800))] md:w-1.5";

const TrackSign = () => (
  <div className="absolute bottom-4 left-[56%] w-24 -translate-x-1/2 md:bottom-7 md:left-[34%] md:w-36">
    <div className="relative rounded-[2px] bg-gradient-to-b from-asphalt-800 to-asphalt-950 p-1.5 shadow-[0_14px_30px_-10px_rgba(0,0,0,0.85)] ring-2 ring-silver/40 md:p-2">
      <span
        className="pointer-events-none absolute inset-0 rounded-[1px] ring-1 ring-inset ring-chalk/10"
        aria-hidden="true"
      />
      <span
        className="absolute inset-x-0 top-0 h-px bg-chalk/25"
        aria-hidden="true"
      />
      <img
        src="/images/logo.webp"
        srcSet={logoSrcSet("/images/logo.webp", 512)}
        sizes="(min-width: 768px) 74px, 44px"
        alt=""
        loading="eager"
        decoding="async"
        width="512"
        height="560"
        className="mx-auto h-12 w-auto object-contain md:h-20"
      />
    </div>

    {/* The posts are flex items; everything around them is out of flow, so
        paint order alone decides what is in front of a foot and what is
        behind it. */}
    <div className="relative mx-auto flex w-2/3 justify-between">
      <Foot className="absolute -bottom-1.5 left-1/2 h-4 w-[190%] -translate-x-1/2 rounded-[50%] opacity-60 md:h-6" />
      <Foot className="absolute -bottom-1 left-[-23%] h-2 w-[46%] rounded-[50%] md:h-3" />
      <Foot className="absolute -bottom-1 right-[-23%] h-2 w-[46%] rounded-[50%] md:h-3" />

      <Clump
        blades={BEHIND}
        className="absolute -bottom-1.5 left-[-32%] h-6 w-[64%] md:h-9"
      />
      <Clump
        blades={BEHIND}
        flip
        className="absolute -bottom-2 right-[-32%] h-[1.625rem] w-[64%] md:h-10"
      />

      <span className={`${POST} h-10 md:h-24`} />
      <span className={`${POST} h-10 md:h-24`} />

      <Clump
        blades={INFRONT}
        className="absolute -bottom-2 left-[-32%] h-[1.625rem] w-[64%] md:h-10"
      />
      <Clump
        blades={INFRONT}
        flip
        className="absolute -bottom-2.5 right-[-32%] h-7 w-[64%] md:h-11"
      />
    </div>
  </div>
);

export default TrackSign;
