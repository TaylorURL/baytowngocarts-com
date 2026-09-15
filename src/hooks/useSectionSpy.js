import { useEffect, useState } from "react";

/**
 * Which section of a long document is being read right now.
 *
 * A horizontal rail over a document has to answer that question every frame a
 * reader scrolls, and an IntersectionObserver on its own answers a different
 * one: it says which sections are on screen, which is three of them at once on
 * a tall display and none of them inside a section taller than the viewport.
 * So the sections are observed to know when to look, and the answer is read
 * off their positions against a line near the top of the readable area -- the
 * same line a reader's eye is on, below the header and the rail.
 *
 * Two edges the position alone gets wrong, both of them at the ends:
 *
 *   - Before the first section reaches the line, nothing is being read yet.
 *     That returns null rather than the first id, so the rail marks nothing
 *     rather than marking something the reader has not arrived at.
 *   - The last section is usually shorter than the distance left to scroll,
 *     so it can never bring its own top to the line. Once the document is
 *     scrolled to the bottom, the last section present is the answer.
 *
 * @param {string[]} ids - section element ids, in document order
 * @param {{current: Element|null}} lineRef - the chrome stuck to the top of
 *   the viewport, whose lower edge is the read line. Measured rather than
 *   given as a number because the header is four tiers at one breakpoint and
 *   two at another, and a constant is wrong at one of them.
 * @returns {string|null} the id being read, or null above the first section
 */
export default function useSectionSpy(ids, lineRef) {
  const [active, setActive] = useState(null);
  /* The ids are rebuilt on every render by whatever filters the document, so
     the effect keys off their identity rather than the array's. */
  const key = ids.join("|");

  useEffect(() => {
    const list = key ? key.split("|") : [];
    if (!list.length) {
      setActive(null);
      return;
    }

    let frame = 0;

    const read = () => {
      frame = 0;
      const scroller = document.documentElement;
      const atBottom =
        window.scrollY + window.innerHeight >= scroller.scrollHeight - 2;
      const offset = lineRef?.current?.getBoundingClientRect().bottom ?? 0;
      /* An anchor lands its section where the page's scroll padding plus the
         section's own scroll margin put it, which is a little under the line
         rather than on it. A section counts as read from there, or following
         its own link would leave the topic before it marked. */
      const padding =
        parseFloat(getComputedStyle(scroller).scrollPaddingTop) || 0;

      let found = null;
      for (const id of list) {
        const node = document.getElementById(id);
        if (!node) continue;
        const margin = parseFloat(getComputedStyle(node).scrollMarginTop) || 0;
        const line = Math.max(offset, padding + margin);
        if (node.getBoundingClientRect().top - line <= 1) found = id;
        else break;
      }

      if (atBottom) {
        const last = [...list]
          .reverse()
          .find((id) => document.getElementById(id));
        if (last) found = last;
      }

      setActive(found);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [key, lineRef]);

  return active;
}
