import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ToastContext } from "../../hooks/useToast.js";
import Icon from "./Icon.jsx";

/*
 * Transient feedback, bottom right, gone on its own.
 *
 * Anything that reports the outcome of an action the visitor just took goes
 * through here rather than into the page. A banner pushed into a form moves
 * every field below it the moment it appears, stays until something else
 * clears it, and reads as part of the page rather than as an answer to the
 * click. A toast sits over the corner, says one thing, and leaves.
 *
 * The tones carry different urgency and therefore different lifetimes and
 * different live regions: a failure is read out at once and given longer to be
 * read, a success is announced politely and clears sooner.
 */

/* Long enough for the exit transition to finish before the row is removed. */
const EXIT_MS = 220;

const TONES = {
  success: {
    icon: "check",
    ground: "bg-asphalt-900",
    accent: "text-green-400",
    edge: "border-green-500/40",
    life: 4000,
    live: "polite",
    role: "status",
  },
  error: {
    icon: "alert-circle",
    ground: "bg-asphalt-900",
    accent: "text-race-400",
    edge: "border-race-500/50",
    life: 6500,
    live: "assertive",
    role: "alert",
  },
};

const ToastRow = ({ toast, onDone }) => {
  const tone = TONES[toast.tone] || TONES.success;
  const [leaving, setLeaving] = useState(false);
  // The row is on two clocks - when it starts leaving, and when it goes - so
  // a dismiss can reset either one without disturbing the other.
  const exitTimer = useRef(0);
  const removeTimer = useRef(0);

  useEffect(() => {
    // The entrance is a keyframe rather than a transition off a state flip,
    // so it runs on the frame the row is inserted instead of the one after
    // it, and the reduced-motion block collapses it with every other
    // animation on the page.
    exitTimer.current = setTimeout(() => setLeaving(true), tone.life);
    removeTimer.current = setTimeout(
      () => onDone(toast.id),
      tone.life + EXIT_MS,
    );
    return () => {
      clearTimeout(exitTimer.current);
      clearTimeout(removeTimer.current);
    };
  }, [toast.id, tone.life, onDone]);

  // Dismissing takes the same exit the row would have taken on its own: the
  // press paints the fade, and the stack is rebuilt after it rather than
  // inside the click.
  const leave = () => {
    clearTimeout(exitTimer.current);
    clearTimeout(removeTimer.current);
    setLeaving(true);
    removeTimer.current = setTimeout(() => onDone(toast.id), EXIT_MS);
  };

  return (
    <div
      role={tone.role}
      aria-live={tone.live}
      className={`pointer-events-auto flex items-start gap-3 rounded-md border ${tone.edge} ${tone.ground} px-4 py-3 shadow-lift transition-[transform,opacity] duration-base ease-snap motion-reduce:transition-none ${
        leaving
          ? "translate-y-2 opacity-0"
          : "translate-y-0 opacity-100 toast-in"
      }`}
    >
      <Icon
        name={tone.icon}
        className={`mt-0.5 h-5 w-5 flex-none ${tone.accent}`}
      />
      <p className="text-sm leading-snug text-chalk">{toast.text}</p>
      <button
        type="button"
        onClick={leave}
        aria-label="Dismiss"
        className="-mr-1 ml-1 flex-none rounded p-1 text-gray-500 transition-colors duration-base ease-snap hover:text-chalk"
      >
        <Icon name="close" className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const next = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((rows) => rows.filter((row) => row.id !== id));
  }, []);

  const notify = useCallback((text, tone = "success") => {
    const id = (next.current += 1);
    // Three is where a corner stack stops being readable, so the oldest goes.
    setToasts((rows) => [...rows, { id, text, tone }].slice(-3));
    return id;
  }, []);

  const value = useMemo(() => ({ notify, dismiss }), [notify, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] right-[calc(1rem+env(safe-area-inset-right,0px))] z-toast flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2"
        aria-live="off"
      >
        {toasts.map((toast) => (
          <ToastRow key={toast.id} toast={toast} onDone={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
