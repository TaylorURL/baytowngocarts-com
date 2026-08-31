/*
 * Fades a section in as it is scrolled to.
 *
 * The markup asks for it with `data-aos="fade"`, optionally with
 * `data-aos-delay` in milliseconds for a stagger. The styles that hide an
 * element before it arrives are gated behind a class this file sets, so a page
 * whose scripts never run shows everything rather than nothing.
 *
 * Each element is revealed once and then released.
 */

const SELECTOR = "[data-aos]";
const REVEALED = "aos-animate";
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
