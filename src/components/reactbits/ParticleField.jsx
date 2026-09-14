import { Suspense, lazy, useState, useEffect } from "react";
import ErrorBoundary from "../shell/ErrorBoundary.jsx";
import { withBuildRefresh } from "../../lib/chunk-recovery.js";
import { whenStill } from "../../lib/idle.js";

const Particles = lazy(withBuildRefresh(() => import("./Particles.jsx")));

/*
 * The field is decoration, and decoration is worth nothing to a reader still
 * waiting for the page. Mounted with the page it fetches its chunk, compiles
 * its shaders and draws its first frame against the first paint of the hero
 * it sits behind - and on a machine without a GPU that drawing is rasterised
 * on the same thread the page is painting on. It waits for the page to arrive
 * and the browser to have a moment spare, the same wait the hero's next
 * photograph rides. The layer it draws into waits with it, because a box that
 * covers the hero and holds nothing is still a box the first frame has to be
 * composited around.
 */
const ParticleField = ({ layer, ...props }) => {
  const [settled, setSettled] = useState(false);
  useEffect(() => whenStill(() => setSettled(true)), []);
  if (!settled) return null;
  /* Decoration nobody is told about is decoration whose absence nobody can
     see, so a chunk that never arrives leaves the layer empty rather than
     reaching the boundary around the app and taking the page with it. */
  return (
    <div className={layer} aria-hidden="true">
      <ErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <Particles {...props} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default ParticleField;
