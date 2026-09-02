"use client";

import { Suspense, forwardRef, lazy, useEffect, useState } from "react";
import { withBuildRefresh } from "../../lib/chunk-recovery.js";
import { whenSettled } from "../../lib/idle.js";

const Rotation = lazy(
  withBuildRefresh(() => import("./RotatingTextMotion.jsx")),
);

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/*
 * The headline the document was written with, held until the page has arrived.
 *
 * The rotation is the animation library, a spring per character and a layout
 * projection that measures every one of them on each turn. Mounted with the
 * page it is downloaded, compiled and set running against the first paint of
 * the headline it sits in, and its first turn repaints the largest type on the
 * first screen while the rest of the page is still landing. It waits for the
 * page to arrive and the browser to have a moment spare, the same wait the
 * hero's photographs and the particle field ride, and the phrase standing
 * there in the meantime is the one the document already carries.
 */
const RotatingText = forwardRef((props, ref) => {
  const { texts, mainClassName } = props;
  const [settled, setSettled] = useState(false);

  useEffect(() => whenSettled(() => setSettled(true)), []);

  const held = (
    <span
      className={cn(
        "flex flex-wrap whitespace-pre-wrap relative",
        mainClassName,
      )}
    >
      {texts[0]}
    </span>
  );

  if (!settled) return held;

  return (
    <Suspense fallback={held}>
      <Rotation ref={ref} {...props} />
    </Suspense>
  );
});

RotatingText.displayName = "RotatingText";
export default RotatingText;
