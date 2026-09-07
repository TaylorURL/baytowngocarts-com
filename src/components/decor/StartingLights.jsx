import { useEffect, useState } from "react";

/* The three lamps of a starting gantry, in the order they light. Each stage
   names its own lit and unlit custom property, so the housing renders from
   the palette in Theme.css rather than from colours copied into JS. */
const STAGES = [
  { key: "stop", on: "var(--lamp-stop-on)", off: "var(--lamp-stop-off)" },
  { key: "set", on: "var(--lamp-set-on)", off: "var(--lamp-set-off)" },
  { key: "go", on: "var(--lamp-go-on)", off: "var(--lamp-go-off)" },
];

const CYCLE_MS = 1000;

/**
 * The starting gantry in the header's navigation tier.
 *
 * The lit stage advances on a timer and carries no application meaning, so the
 * housing is hidden from assistive technology. Under a reduced-motion
 * preference the sequence holds on go instead of cycling: the lamps still read
 * as a gantry, and the one moving element in the bar stops moving.
 */
const StartingLights = ({ size = 10, gap = 6 }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let id;
    const apply = () => {
      clearInterval(id);
      if (motion.matches) {
        setStage(STAGES.length - 1);
        return;
      }
      id = setInterval(
        () => setStage((p) => (p + 1) % STAGES.length),
        CYCLE_MS,
      );
    };
    apply();
    motion.addEventListener("change", apply);
    return () => {
      clearInterval(id);
      motion.removeEventListener("change", apply);
    };
  }, []);

  return (
    <div
      className="flex items-center"
      style={{ gap: `${gap}px` }}
      aria-hidden="true"
    >
      {STAGES.map((lamp, i) => {
        const lit = stage === i;
        return (
          <span
            key={lamp.key}
            className="relative flex items-center justify-center"
            style={{ width: size + 6, height: size + 6 }}
          >
            {lit && (
              <span
                className="absolute rounded-full"
                style={{
                  width: size + 10,
                  height: size + 10,
                  backgroundColor: lamp.on,
                  filter: "blur(5px)",
                  opacity: 0.55,
                }}
              />
            )}
            <span
              className="relative rounded-full transition-colors duration-slow ease-snap"
              style={{
                width: size,
                height: size,
                backgroundColor: lit ? lamp.on : lamp.off,
                boxShadow: lit
                  ? `0 0 5px 1px ${lamp.on}, inset 0 -1px 2px var(--lamp-well), inset 0 1px 1px var(--lamp-sheen)`
                  : "inset 0 1px 3px var(--lamp-well-deep)",
              }}
            />
          </span>
        );
      })}
    </div>
  );
};

export default StartingLights;
