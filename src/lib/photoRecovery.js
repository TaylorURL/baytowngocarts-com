/*
 * What a photograph does when its file does not arrive.
 *
 * A request for an image is lost for reasons that have nothing to do with the
 * file - a handover between cells, an in-app browser suspending the page
 * behind its host, a connection that drops a response mid-flight. Asked for
 * once, the element is left on its placeholder for the rest of the visit, and
 * because /images is served immutable for a year a browser that recorded the
 * broken response replays it from disk on every later visit too. So the second
 * request has to go past the answer the first one recorded, which means it has
 * to be a different URL.
 *
 * These two pieces are shared rather than owned by one component, because the
 * hero owning them is exactly how every other photograph on the site ended up
 * with no recovery at all.
 */

/** How many times a photograph is asked for before the page stops asking. */
export const PHOTO_ATTEMPTS = 2;

/** The same candidates, asked for past whatever answered the first time. */
export const retrySrcSet = (set, attempt) =>
  set.replace(/\.webp /g, `.webp?attempt=${attempt} `);

/*
 * A photograph that arrives on a later request is a photograph the reader saw,
 * so the first request's failure describes the recovery starting rather than
 * anything lost. The reporter holds that failure and waits for this to decide.
 *
 * The URL announced is the candidate that loaded, not the element's src: the
 * same photograph is mounted at different widths on different surfaces, and
 * the reporter holds each failure under the candidate that failed.
 */
export const announceRecovered = (url) => {
  try {
    window.dispatchEvent(
      new CustomEvent("speedway146:asset-recovered", { detail: { url } }),
    );
  } catch {
    /* Nothing to announce it with leaves the held failure to expire, which
       reports it - the same place this started. */
  }
};
