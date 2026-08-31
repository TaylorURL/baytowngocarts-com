import { useEffect, useRef, useState } from "react";

/**
 * Whether a frame loop has anything to draw for right now.
 *
 * A loop that keeps running behind the footer, or in a tab nobody is looking
 * at, competes with every interaction for the length of the visit. This is
 * false while the tab is hidden and while the element the loop draws into is
 * off screen. What a component does when it stops is its own decision, and so
 * is what it does for a reader who has asked for less motion.
 *
 * @param {{current: Element|null}} ref - the element the loop draws into
 */
export default function useFrameLoop(ref) {
  const [onScreen, setOnScreen] = useState(true);
  const stateRef = useRef({ visible: true, intersecting: true });

  useEffect(() => {
    const state = stateRef.current;
    const settle = () => setOnScreen(state.visible && state.intersecting);

    const onVisibility = () => {
      state.visible = document.visibilityState !== "hidden";
      settle();
    };
    document.addEventListener("visibilitychange", onVisibility);

    let observer;
    const node = ref.current;
    if (node) {
      observer = new IntersectionObserver(
        ([entry]) => {
          state.intersecting = entry.isIntersecting;
          settle();
        },
        { rootMargin: "200px" },
      );
      observer.observe(node);
    }

    onVisibility();

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      observer?.disconnect();
    };
  }, [ref]);

  return onScreen;
}
