import { Suspense, lazy, useEffect, useRef, useState } from "react";
import ErrorBoundary from "../shell/ErrorBoundary.jsx";
import { withBuildRefresh } from "../../lib/chunk-recovery.js";

const Animated = lazy(withBuildRefresh(() => import("./BlurTextMotion.jsx")));

/*
 * Copy standing on screen at the moment this takes the paragraph over was
 * already painted. Blurring it back out to bring it in blanks a line the
 * reader is part-way through, so text that starts in view keeps its glyphs
 * and only text scrolled to afterwards animates.
 *
 * A paragraph that keeps its glyphs never runs a single frame of animation, so
 * the animation library is asked for only where it has something to do. The
 * hero's copy is on the first screen on every viewport the site is read on,
 * which leaves nothing on the home page's first load reaching for it.
 */
const BlurText = (props) => {
  const { text = "", className = "", animateBy = "words" } = props;
  const [animates, setAnimates] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const box = ref.current?.getBoundingClientRect();
    if (box && box.top < window.innerHeight && box.bottom > 0) return;
    setAnimates(true);
  }, []);

  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const held = (
    <p ref={ref} className={`blur-text ${className} flex flex-wrap`}>
      {elements.map((segment, index) => (
        <span className="inline-block" key={index}>
          {segment === " " ? "\u00A0" : segment}
          {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
        </span>
      ))}
    </p>
  );

  if (!animates) return held;

  /* The paragraph is already written into the document, so a chunk that never
     arrives costs the reader an animation rather than the page. Without the
     boundary the rejection React raises out of the lazy element travels to the
     one around the app and replaces everything. */
  return (
    <ErrorBoundary fallback={held}>
      <Suspense fallback={held}>
        <Animated {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default BlurText;
