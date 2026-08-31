import { useCallback, useRef } from "react";
import { token } from "../../lib/tokens.js";

/**
 * Lights the card under the pointer.
 *
 * The pointer position drives two custom properties on the glow layer. It
 * changes on every mouse event, and routing that through state would cost the
 * card's whole subtree a render per frame.
 *
 * Whether the glow is lit is left to CSS, and the card's box is measured once
 * as the pointer arrives. Measuring inside the move handler reads layout and
 * then writes a style on every event, and each alternation makes the browser
 * lay the page out again.
 */
const SpotlightCard = ({ children, className = "", spotlightColor }) => {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const boxRef = useRef(null);

  const measure = useCallback(() => {
    if (cardRef.current)
      boxRef.current = cardRef.current.getBoundingClientRect();
  }, []);

  const handleMouseMove = useCallback((e) => {
    const box = boxRef.current;
    if (!box || !glowRef.current) return;
    glowRef.current.style.setProperty("--spot-x", `${e.clientX - box.left}px`);
    glowRef.current.style.setProperty("--spot-y", `${e.clientY - box.top}px`);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={measure}
      onFocus={measure}
      className={`group/spot relative overflow-hidden ${className}`}
    >
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-slow ease-decel group-hover/spot:opacity-60 group-focus-within/spot:opacity-60"
        style={{
          background: `radial-gradient(circle at var(--spot-x, 50%) var(--spot-y, 50%), ${
            spotlightColor || token("--spotlight-race")
          }, transparent 80%)`,
        }}
      />
      {children}
    </div>
  );
};

export default SpotlightCard;
