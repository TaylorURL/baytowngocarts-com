/*
 * Fades a section in as it is scrolled to.
 *
 * The markup asks for it with `data-aos="fade"`, optionally with
 * `data-aos-delay` in milliseconds for a stagger. The styles that hide an
 * element before it arrives are gated behind a class this file sets, so a page
 * whose scripts never run shows everything rather than nothing.
 *
 * The hidden state is borrowed against a promise to give it back, and every
 * way that promise breaks ends here with the class coming off. A tree replaced
 * underneath the observer, an observer that never delivers, a tab that was
 * never on screen to deliver to: each of them leaves a column of nothing under
 * the header, and a section that arrives without its fade is the smaller loss.
 */

const SELECTOR = "[data-aos]";
const REVEALED = "aos-animate";
/* The mark for what the first screen already showed. It is an attribute rather
   than a class because it is written while React is still attaching to the
   prerendered markup, and hydration rewrites a `className` it did not render
   while leaving an attribute it never named alone. */
const SHOWN = "data-aos-shown";
/* Mirrors what the reveal reads as: a section is arriving once its top edge is
   a hundred points inside the viewport, not the moment its first pixel is. */
const MARGIN = "0px 0px -100px 0px";
/* How long the reveal is given to prove it is working. Long enough for an
   observer to deliver its first batch on a slow phone, short enough that
   nobody sits in front of a blank column waiting on it. */
const PATIENCE_MS = 1500;

export function startReveals() {
  const root = document.documentElement;

  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  let observer = null;
  let tree = null;
  let fold = 0;
  let frame = 0;
  let timer = 0;
  let open = false;
  let handed = false;
  let delivered = false;

  const waiting = (el) =>
    !el.classList.contains(REVEALED) && !el.hasAttribute(SHOWN);

  const onScreen = (box) =>
    box.bottom > 0 && box.top < (window.innerHeight || root.clientHeight);

  /*
   * Everything the first screen showed is held at full opacity rather than
   * hidden and faded back in, which would blank the part of the page a reader
   * is looking at and move the largest paint to the end of the fade.
   *
   * Which elements those are is read off the document rather than remembered
   * per element, because the elements do not survive: a client render
   * replacing the prerendered tree hands back different nodes at the same
   * offsets, carrying none of the marks written on the ones it discarded.
   */
  const settle = () => {
    frame = 0;
    const pending = [...document.querySelectorAll(SELECTOR)].filter(waiting);
    /* Every box is measured before the first mark is written, because a mark
       invalidates the styles the next measurement would otherwise have to stop
       and settle. */
    const boxes = pending.map((el) => el.getBoundingClientRect());
    const scrolled = window.scrollY;
    pending.forEach((el, index) => {
      if (boxes[index].top + scrolled < fold) {
        el.setAttribute(SHOWN, "");
      } else {
        observer.observe(el);
        handed = true;
      }
    });
    arm();
  };

  const schedule = () => {
    if (open || frame) return;
    frame = requestAnimationFrame(settle);
  };

  const arm = () => {
    if (open || document.visibilityState === "hidden") return;
    if (timer) clearTimeout(timer);
    timer = setTimeout(audit, PATIENCE_MS);
  };

  /*
   * Two questions, because one of them is not enough on its own.
   *
   * An observer handed elements and heard from about none of them is broken,
   * and the sections it owes are hidden whether or not any of them happen to
   * be on screen while this runs - the reader meets them further down instead,
   * where nothing arrives to run this again. An observer that answered still
   * leaves anything standing on screen and hidden to account for.
   */
  const audit = () => {
    timer = 0;
    const dead = handed && !delivered;
    const stuck =
      dead ||
      [...document.querySelectorAll(SELECTOR)].some(
        (el) => waiting(el) && onScreen(el.getBoundingClientRect()),
      );
    if (stuck) release();
  };

  const release = () => {
    open = true;
    root.classList.remove("js-reveal");
    observer.disconnect();
    tree.disconnect();
    if (timer) clearTimeout(timer);
    timer = 0;
  };

  const begin = () => {
    fold = window.innerHeight || root.clientHeight;

    observer = new IntersectionObserver(
      (entries) => {
        delivered = true;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const { aosDelay } = entry.target.dataset;
          entry.target.style.transitionDelay = aosDelay ? `${aosDelay}ms` : "";
          entry.target.classList.add(REVEALED);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: MARGIN },
    );

    /* Marked before the class that hides them lands, so an element on screen
       never spends a frame at zero. */
    settle();
    root.classList.add("js-reveal");

    /* Routes mount their own sections, and a client render replaces the ones
       already on the page. Both arrive here as mutations, coalesced into one
       pass so a tree being rebuilt node by node is measured once rather than
       once per node. */
    tree = new MutationObserver(schedule);
    tree.observe(document.body, { childList: true, subtree: true });
  };

  /*
   * Transitions do not run and observer callbacks are not delivered while the
   * document is hidden, so a page opened in a background tab would be hidden
   * by a system with no way to show it again. Nothing is hidden until there is
   * somebody there to hide it from.
   */
  document.addEventListener("visibilitychange", () => {
    if (open || document.visibilityState === "hidden") {
      if (timer) clearTimeout(timer);
      timer = 0;
      return;
    }
    if (observer) schedule();
    else begin();
  });

  if (document.visibilityState !== "hidden") begin();
}
