/*
 * Fades a section in as it is scrolled to.
 *
 * The markup asks for it with `data-aos="fade"`, optionally with
 * `data-aos-delay` in milliseconds for a stagger. The styles that hide an
 * element before it arrives are gated behind a class this file sets, so a page
 * whose scripts never run shows everything rather than nothing.
 *
 * Each element is revealed once and then released. What is already on screen
 * arrives revealed: the document painted it before this file ran, and hiding
 * it to fade it back in blanks the part of the page a reader is looking at and
 * moves the largest paint to the end of the fade.
 */

const SELECTOR = "[data-aos]";
const REVEALED = "aos-animate";
/* The mark for what was on screen before any of this ran. It is an attribute
   rather than a class because it is written while React is still attaching to
   the prerendered markup, and hydration rewrites a `className` it did not
   render while leaving an attribute it never named alone. */
const SHOWN = "data-aos-shown";
/* Mirrors what the reveal reads as: a section is arriving once its top edge is
   a hundred points inside the viewport, not the moment its first pixel is. */
const MARGIN = "0px 0px -100px 0px";

export function startReveals() {
  const root = document.documentElement;

  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  /* Marked before the class that hides them lands, so an element on screen
     never spends a frame at zero. Every box is measured before the first mark
     is written, because a mark invalidates the styles the next measurement
     would otherwise have to stop and settle. */
  const viewport = window.innerHeight || root.clientHeight;
  const onScreen = [...document.querySelectorAll(SELECTOR)].filter((el) => {
    const box = el.getBoundingClientRect();
    return box.top < viewport && box.bottom > 0;
  });
  for (const el of onScreen) el.setAttribute(SHOWN, "");

  root.classList.add("js-reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const { delay } = entry.target.dataset.aosDelay
          ? { delay: `${entry.target.dataset.aosDelay}ms` }
          : { delay: "" };
        entry.target.style.transitionDelay = delay;
        entry.target.classList.add(REVEALED);
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: MARGIN },
  );

  /* An element carrying the mark is watched too. The mark is the cheap path
     and the observer is the floor under it: if anything takes the mark off
     again, the element still arrives rather than staying hidden. */
  const attach = () => {
    document.querySelectorAll(`${SELECTOR}:not(.${REVEALED})`).forEach((el) => {
      observer.observe(el);
    });
  };

  attach();
  /* Routes mount their own sections, so what is on the page changes without a
     reload. */
  const tree = new MutationObserver(attach);
  tree.observe(document.body, { childList: true, subtree: true });
}
