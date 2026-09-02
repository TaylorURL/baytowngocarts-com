/*
 * Work that belongs after the page has arrived.
 *
 * An ambient layer - a rotation, the frame after the one on screen - is worth
 * nothing to a reader still waiting for the page, and costs the arrival the
 * bandwidth and the main thread it is spending on it. Anything queued here
 * waits for the document to finish loading, for the first frame to have been
 * shown, and then for the browser to have a moment spare.
 *
 * @param {Function} run - what to do once the page has settled
 * @param {number} timeout - how long the idle wait may hold the work back
 * @returns {Function} cancels the wait, whichever stage it is at
 */
export function whenSettled(run, timeout = 2000) {
  let idle;
  let timer;
  let observer;
  let painted = false;
  let loaded = document.readyState === "complete";

  const queue = () => {
    if (!painted || !loaded) return;
    if (typeof window.requestIdleCallback === "function") {
      idle = window.requestIdleCallback(run, { timeout });
    } else {
      timer = setTimeout(run, 0);
    }
  };
  const onLoad = () => {
    loaded = true;
    queue();
  };
  const onPaint = () => {
    if (painted) return;
    painted = true;
    if (observer) observer.disconnect();
    queue();
  };

  // Settled means the page has been shown, not only that it has loaded. On a
  // machine slow to draw its first frame, load fires while the screen is still
  // blank, and everything queued on it would then be fetched and run ahead of
  // the paint it was meant to follow. The first contentful paint is waited for
  // as well, with the same timeout as a ceiling where the observer is missing
  // or the page has nothing to report.
  try {
    observer = new PerformanceObserver((list) => {
      if (list.getEntriesByName("first-contentful-paint").length) onPaint();
    });
    observer.observe({ type: "paint", buffered: true });
    timer = setTimeout(onPaint, timeout);
  } catch {
    onPaint();
  }

  if (loaded) queue();
  else window.addEventListener("load", onLoad, { once: true });

  return () => {
    window.removeEventListener("load", onLoad);
    if (observer) observer.disconnect();
    if (idle !== undefined) window.cancelIdleCallback(idle);
    if (timer !== undefined) clearTimeout(timer);
  };
}
