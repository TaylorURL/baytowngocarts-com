import { useEffect, useRef } from "react";

/**
 * Pulls its child toward the pointer while the pointer is near it.
 *
 * The offset is written straight onto the node's style. A pointer position
 * changes on every mouse event, and routing that through state would re-render
 * this subtree dozens of times a second.
 */
const Magnet = ({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  activeTransition = "transform var(--dur-slow) var(--ease-snap)",
  inactiveTransition = "transform var(--dur-slow) var(--ease-decel)",
  wrapperClassName = "",
  innerClassName = "",
  ...props
}) => {
  const magnetRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    if (disabled) {
      inner.style.transform = "translate3d(0px, 0px, 0)";
      inner.style.transition = inactiveTransition;
      return;
    }

    const handleMouseMove = (e) => {
      if (!magnetRef.current) return;

      const { left, top, width, height } =
        magnetRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const distX = Math.abs(centerX - e.clientX);
      const distY = Math.abs(centerY - e.clientY);
      const near = distX < width / 2 + padding && distY < height / 2 + padding;

      const offsetX = near ? (e.clientX - centerX) / magnetStrength : 0;
      const offsetY = near ? (e.clientY - centerY) / magnetStrength : 0;

      inner.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
      inner.style.transition = near ? activeTransition : inactiveTransition;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [padding, disabled, magnetStrength, activeTransition, inactiveTransition]);

  return (
    <div
      ref={magnetRef}
      className={wrapperClassName}
      style={{ position: "relative", display: "inline-block" }}
      {...props}
    >
      <div
        ref={innerRef}
        className={innerClassName}
        style={{
          transform: "translate3d(0px, 0px, 0)",
          transition: inactiveTransition,
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Magnet;
