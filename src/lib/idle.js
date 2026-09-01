/*
 * Work that belongs after the page has arrived.
 *
 * An ambient layer - a rotation, the frame after the one on screen - is worth
 * nothing to a reader still waiting for the page, and costs the arrival the
 * bandwidth and the main thread it is spending on it. Anything queued here
 * waits for the document to finish loading and then for the browser to have a
 * moment spare.
 *
 * @param {Function} run - what to do once the page has settled
 * @param {number} timeout - how long the idle wait may hold the work back
 * @returns {Function} cancels the wait, whichever stage it is at
 */
export function whenSettled(run, timeout = 2000) {
  let idle;
  let timer;

  const queue = () => {
    if (typeof window.requestIdleCallback === "function") {
      idle = window.requestIdleCallback(run, { timeout });
    } else {
      timer = setTimeout(run, 0);
    }
  };

  const loaded = document.readyState === "complete";
  if (loaded) queue();
  else window.addEventListener("load", queue, { once: true });

  return () => {
    if (!loaded) window.removeEventListener("load", queue);
    if (idle !== undefined) window.cancelIdleCallback(idle);
    if (timer !== undefined) clearTimeout(timer);
  };
}
