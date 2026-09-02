/* How long the first screen is held still after the browser first goes idle.
   Long enough to outlast the rest of an arrival on a slow phone, where the
   bundle, the fonts and the photography all land well after the document. */
const QUIET_MS = 3000;

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
  return wait(run, timeout, 0);
}

/*
 * Work that may not redraw the first screen.
 *
 * Arriving and being still are not the same thing. The browser's first spare
 * moment falls in the middle of the arrival - after the document has landed,
 * while the bundle, the fonts and the photography are still coming - and a
 * layer that starts drawing there repaints the screen underneath a reader who
 * has only just been given it. So the spare moment is asked for twice, with a
 * quiet stretch in between, and the work runs on the second one. What the
 * reader meets is the screen the document described, held still until the page
 * has stopped arriving, and then the motion the page has always had.
 *
 * @param {Function} run - what to do once the first screen can be redrawn
 * @param {number} timeout - how long either idle wait may hold the work back
 * @returns {Function} cancels the wait, whichever stage it is at
 */
export function whenStill(run, timeout = 2000) {
  return wait(run, timeout, QUIET_MS);
}

function wait(run, timeout, quietMs) {
  let idle;
  let quiet;
  let spare;
  let paintTimer;
  let observer;
  let painted = false;
  let loaded = document.readyState === "complete";

  const whenSpare = (then) => {
    if (typeof window.requestIdleCallback === "function") {
      idle = window.requestIdleCallback(then, { timeout });
    } else {
      spare = setTimeout(then, 0);
    }
  };

  const queue = () => {
    if (!painted || !loaded) return;
    if (!quietMs) {
      whenSpare(run);
      return;
    }
    whenSpare(() => {
      idle = undefined;
      spare = undefined;
      quiet = setTimeout(() => {
        quiet = undefined;
        whenSpare(run);
      }, quietMs);
    });
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
    paintTimer = setTimeout(onPaint, timeout);
  } catch {
    onPaint();
  }

  if (loaded) queue();
  else window.addEventListener("load", onLoad, { once: true });

  return () => {
    window.removeEventListener("load", onLoad);
    if (observer) observer.disconnect();
    if (idle !== undefined) window.cancelIdleCallback(idle);
    if (quiet !== undefined) clearTimeout(quiet);
    if (spare !== undefined) clearTimeout(spare);
    if (paintTimer !== undefined) clearTimeout(paintTimer);
  };
}
