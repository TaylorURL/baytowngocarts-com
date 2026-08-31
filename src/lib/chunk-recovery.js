/*
 * Keeps a browser holding a build the host no longer serves off the error
 * screen.
 *
 * Every route is a dynamic import of a chunk whose filename carries a content
 * hash, and a deploy replaces those files with new names. A tab left open
 * across a deploy asks for a filename the host no longer has: the import
 * rejects, React.lazy turns the rejection into a render error, and the whole
 * page becomes the error boundary's fallback for a visitor whose only problem
 * is an old document.
 *
 * The document is what pins a build, so a reload settles it. One reload per
 * tab is allowed, which is enough for a chunk that moved and not enough for a
 * chunk that is genuinely missing to become a loop. A load that succeeds
 * afterwards releases the allowance, so the next deploy gets its own.
 *
 * The refresh is announced on every stale-chunk rejection, whether or not the
 * reload proceeds. The page reporter uses the event to drop the held asset
 * failure, and a browser that cannot spend its allowance -- session storage
 * closed on an iOS in-app browser, or the allowance already used -- is still
 * in the build-refresh situation the reporter is asking about. The visitor
 * sees whatever the error boundary shows either way; the ticket is noise the
 * site cannot fix.
 */

const RELOAD_MARK = "speedway146:build-refresh";

/* Named in index.html, where the reporter listens for it. */
const REFRESH_EVENT = "speedway146:build-refresh";

/* A store that cannot be read cannot gate anything, and an ungated reload over
   a chunk that will never arrive never stops, so an unreadable store counts as
   an allowance already spent. */
function reloadSpent() {
  try {
    return sessionStorage.getItem(RELOAD_MARK) === "1";
  } catch {
    return true;
  }
}

function spendReload() {
  try {
    sessionStorage.setItem(RELOAD_MARK, "1");
  } catch {
    // Nothing to spend when the store is closed to us.
  }
}

function releaseReload() {
  try {
    sessionStorage.removeItem(RELOAD_MARK);
  } catch {
    // Nothing to release when the store is closed to us.
  }
}

/**
 * Wraps a dynamic-import loader so a chunk missing from the served build
 * refreshes the page instead of failing the render.
 *
 * @param {() => Promise<unknown>} loader Dynamic import of a route or component.
 * @returns {() => Promise<unknown>} The same loader, with the refresh attached.
 */
export function withBuildRefresh(loader) {
  return () =>
    loader().then(
      (module) => {
        releaseReload();
        return module;
      },
      (error) => {
        if (typeof window === "undefined") throw error;
        window.dispatchEvent(new Event(REFRESH_EVENT));
        if (reloadSpent()) throw error;
        spendReload();
        window.location.reload();
        /* The reload is already under way. Settling this promise either way
           would only put something on screen for the instant before it. */
        return new Promise(() => {});
      },
    );
}
