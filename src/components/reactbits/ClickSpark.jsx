import { useRef, useEffect, useCallback } from "react";
import { token } from "../../lib/tokens.js";
import useFrameLoop from "../../hooks/useFrameLoop.js";

const NO_SPARKS = "(prefers-reduced-motion: reduce)";

// The canvas is a fixed, top-most viewport overlay and clicks are captured on
// `window`, so a spark lands above opaque page content wherever the click was.
const ClickSpark = ({
  sparkColor,
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = "snap",
  extraScale = 1.0,
  children,
}) => {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);
  const startTimeRef = useRef(null);
  // A frame loop that runs whether or not there is a spark to draw competes
  // with every interaction for the length of the visit, so the loop lives only
  // as long as the sparks do and `spawnSparks` starts it again.
  const frameRef = useRef(null);
  const drawRef = useRef(null);
  const onScreen = useFrameLoop(canvasRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let resizeTimeout;

    const resizeCanvas = () => {
      const { innerWidth: width, innerHeight: height } = window;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 100);
    };

    window.addEventListener("resize", handleResize);
    resizeCanvas();

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  const easeFunc = useCallback(
    (t) => {
      switch (easing) {
        case "linear":
          return t;
        case "decel":
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default:
          return t * (2 - t);
      }
    },
    [easing],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const stroke = sparkColor || token("--spark-primary");

    const draw = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) {
          return false;
        }

        const progress = elapsed / duration;
        const eased = easeFunc(progress);

        const distance = eased * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - eased);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = stroke;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      if (sparksRef.current.length === 0) {
        frameRef.current = null;
        startTimeRef.current = null;
        return;
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    drawRef.current = draw;
    if (sparksRef.current.length > 0 && frameRef.current === null) {
      frameRef.current = requestAnimationFrame(draw);
    }

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      drawRef.current = null;
    };
  }, [
    sparkColor,
    sparkSize,
    sparkRadius,
    sparkCount,
    duration,
    easeFunc,
    extraScale,
  ]);

  const spawnSparks = useCallback(
    (clientX, clientY) => {
      if (!onScreen || window.matchMedia(NO_SPARKS).matches) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      // The canvas is pinned to the viewport at the origin, so the click's own
      // viewport coordinates are already canvas coordinates. Measuring it here
      // would force a layout inside the click handler, and the delay a
      // visitor feels ends at the paint that layout is holding up.
      const x = clientX;
      const y = clientY;

      const now = performance.now();
      const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
        x,
        y,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now,
      }));

      sparksRef.current.push(...newSparks);
      if (frameRef.current === null && drawRef.current) {
        frameRef.current = requestAnimationFrame(drawRef.current);
      }
    },
    [sparkCount, onScreen],
  );

  useEffect(() => {
    const onClick = (e) => spawnSparks(e.clientX, e.clientY);
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [spawnSparks]);

  return (
    <>
      {children}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 z-overlay block h-dvh w-screen select-none pointer-events-none"
      />
    </>
  );
};

export default ClickSpark;
