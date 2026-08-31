import { Suspense, lazy, useState, useEffect } from "react";
import { withBuildRefresh } from "../../lib/chunk-recovery.js";

const Particles = lazy(withBuildRefresh(() => import("./Particles.jsx")));

const ParticleField = (props) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <Suspense fallback={null}>
      <Particles {...props} />
    </Suspense>
  );
};

export default ParticleField;
