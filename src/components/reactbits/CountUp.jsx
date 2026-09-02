import { Suspense, lazy, useEffect, useState } from "react";
import { withBuildRefresh } from "../../lib/chunk-recovery.js";
import { whenStill } from "../../lib/idle.js";
import { countFormatter } from "../../lib/format.js";

const Counter = lazy(withBuildRefresh(() => import("./CountUpMotion.jsx")));

/*
 * The figure the count starts on, written into the document.
 *
 * The spring that carries a stat from zero to its value is the animation
 * library, and the number itself is a string this can produce without it. A
 * tile that leaves the digits to the bundle stands on the first screen showing
 * a currency symbol with nothing after it for as long as the bundle takes, and
 * gains its width back when the figure lands. So the starting figure ships with
 * the page and the count is picked up once the page has arrived, which is the
 * same wait the hero's photographs and the particle field ride.
 */
const CountUp = (props) => {
  const {
    to,
    from = 0,
    direction = "up",
    separator = "",
    className = "",
  } = props;
  const [settled, setSettled] = useState(false);

  useEffect(() => whenStill(() => setSettled(true)), []);

  const held = (
    <span className={className}>
      {countFormatter(from, to, separator)(direction === "down" ? to : from)}
    </span>
  );

  if (!settled) return held;

  return (
    <Suspense fallback={held}>
      <Counter {...props} />
    </Suspense>
  );
};

export default CountUp;
