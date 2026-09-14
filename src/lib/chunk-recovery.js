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
 * chunk that is genuinely missing to become a loop. The chunk the reload was
 * spent on releases the allowance once it does arrive, so the next deploy
 * gets its own.
 *
 * Which chunk that was is written into the mark, because a document loads
 * more than one and only one of them is the one that failed. A route chunk
 * resolves at hydration and anything deferred is asked for seconds later, so
 * an allowance released on any success at all is the loader that worked
 * handing it back to the loader that did not: spend, reload, release, fail,
 * spend again, for as long as the visitor leaves the page open. A loader
 * takes the allowance back only when the mark is its own.
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

/* The wait before the second attempt: long enough for a connection that
   dropped mid-request to be back, short enough that a reader watching the
   thing it belongs to does not see a gap. */
const RETRY_MS = 400;

/* Named in index.html, where the reporter listens for it. */
const REFRESH_EVENT = "speedway146:build-refresh";

/* A store that cannot be read cannot gate anything, and an ungated reload over
   a chunk that will never arrive never stops, so an unreadable store counts as
   an allowance already spent. */
function reloadSpent() {
  try {
    return sessionStorage.getItem(RELOAD_MARK) !== null;
  } catch {
    return true;
  }
}

function spendReload(chunk) {
  try {
    sessionStorage.setItem(RELOAD_MARK, chunk);
  } catch {
    // Nothing to spend when the store is closed to us.
  }
}

function releaseReload(chunk) {
  try {
    if (sessionStorage.getItem(RELOAD_MARK) === chunk)
      sessionStorage.removeItem(RELOAD_MARK);
  } catch {
    // Nothing to release when the store is closed to us.
  }
}

/*
 * The built URL of the chunk a loader asks for, or an empty string where it
 * cannot be read.
 *
 * A bundled loader carries that filename in its own source, written relative
 * to the directory the built files sit in - which is the directory this module
 * was served from too, so its own URL resolves the name.
 */
function chunkUrl(source) {
  const match = /import\(\s*["']([^"']+)["']/.exec(source);
  if (!match) return "";
  try {
    return new URL(match[1], import.meta.url).href;
  } catch {
    return "";
  }
}

/*
 * Asks for the chunk a second time, past whatever recorded the first answer.
 *
 * A failed module fetch is remembered against its URL: the browser hands the
 * same rejection back to every later import of that URL, so calling the loader
 * again returns the first answer with no request going out. A distinct URL is
 * a distinct entry and the file behind it is the same file. Where the URL
 * cannot be read the plain loader is still worth the call, since a browser
 * that keeps no such record refetches.
 */
function retry(loader, url) {
  return new Promise((resolve) => {
    setTimeout(resolve, RETRY_MS);
  }).then(() => (url ? import(/* @vite-ignore */ `${url}?retry=1`) : loader()));
}

/**
 * Wraps a dynamic-import loader so a chunk the reader could not fetch is asked
 * for again, and one missing from the served build refreshes the page instead
 * of failing the render.
 *
 * @param {() => Promise<unknown>} loader Dynamic import of a route or component.
 * @returns {() => Promise<unknown>} The same loader, with the recovery attached.
 */
export function withBuildRefresh(loader) {
  /* A loader names itself by its own source, which carries the built filename
     of the chunk it asks for: different for every wrapped loader, and the same
     string in every document a build serves. */
  const chunk = String(loader);
  const arrived = (module) => {
    releaseReload(chunk);
    return module;
  };
  const refresh = (error) => {
    window.dispatchEvent(new Event(REFRESH_EVENT));
    if (reloadSpent()) throw error;
    spendReload(chunk);
    window.location.reload();
    /* The reload is already under way. Settling this promise either way
       would only put something on screen for the instant before it. */
    return new Promise(() => {});
  };
  /* A request that did not arrive is not a build that moved. An in-app browser
     suspends its page the moment the host app takes the screen back and drops
     what was in flight, and a phone changing cell does the same, so a first
     rejection says only that this one fetch did not finish. Reloading the
     document over that costs a reader the page they were already on. The
     second attempt is what tells the two apart, and only a chunk that fails
     twice is treated as one the host no longer has. */
  return () =>
    loader().then(arrived, (error) => {
      if (typeof window === "undefined") throw error;
      return retry(loader, chunkUrl(chunk)).then(arrived, () => refresh(error));
    });
}
