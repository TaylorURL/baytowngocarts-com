import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Button from "../ui/Button.jsx";
import Icon from "../ui/Icon.jsx";
import Pill from "../ui/Pill.jsx";

/*
 * The sign-up offer itself: an address in, a code for 10% off out, mailed
 * rather than shown, because mailing it is what proves the address is real.
 *
 * It is a modal in the full sense. It is drawn outside the page's root, the
 * root is made inert while it is up so nothing behind it can be reached by
 * keyboard, pointer or screen reader, Tab cycles inside it, and Escape, the
 * close button, "No thanks" and a press on the dimmed page all close it.
 * Focus goes back where it was. On a phone it rises from the bottom as a
 * sheet, the reach a thumb has, and on anything wider it sits in the middle.
 *
 * The address field is focused on open only where there is a mouse. On a
 * phone that focus would raise the keyboard over a dialog the visitor has not
 * read yet, so the dialog itself takes focus there instead.
 */

const ENDPOINT = import.meta.env.VITE_SUPABASE_URL
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/email-offer`
  : "";
const REQUEST_TIMEOUT_MS = 15000;
const LOOKS_LIKE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FROM_ADDRESS = "hello@baytowngokarts.com";
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])';

async function requestCode(email, pitCrew, page) {
  if (!ENDPOINT) {
    return { error: "Sign-ups aren't available right now. Please try later." };
  }
  const controller =
    typeof AbortController === "undefined" ? null : new AbortController();
  const timer = controller
    ? setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
    : 0;
  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, pit_crew: pitCrew, page }),
      signal: controller?.signal,
    });
    const answer = await response.json().catch(() => ({}));
    if (
      response.ok &&
      (answer.status === "sent" || answer.status === "already")
    ) {
      return { status: answer.status };
    }
    return {
      error: answer.error || "That didn't go through. Please try again.",
    };
  } catch {
    return {
      error:
        "We couldn't reach the server. Check your connection and try again.",
    };
  } finally {
    clearTimeout(timer);
  }
}

const EmailOfferDialog = ({ page, onClose, onClaimed }) => {
  const titleId = useId();
  const descriptionId = useId();
  const inputId = useId();
  const errorId = useId();
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const doneRef = useRef(null);
  const [email, setEmail] = useState("");
  const [pitCrew, setPitCrew] = useState("");
  const [state, setState] = useState({ status: "ready" });

  useEffect(() => {
    const root = document.getElementById("root");
    const returnTo = document.activeElement;
    const html = document.documentElement;
    const before = {
      overflow: html.style.overflow,
      gutter: html.style.scrollbarGutter,
    };
    root?.setAttribute("inert", "");
    html.style.scrollbarGutter = "stable";
    html.style.overflow = "hidden";

    let mouse = false;
    try {
      mouse = window.matchMedia("(pointer: fine)").matches;
    } catch {
      // Without the query, the safe guess is a phone.
    }
    (mouse ? inputRef.current : panelRef.current)?.focus({
      preventScroll: true,
    });

    return () => {
      root?.removeAttribute("inert");
      html.style.overflow = before.overflow;
      html.style.scrollbarGutter = before.gutter;
      if (returnTo && document.contains(returnTo)) {
        returnTo.focus?.({ preventScroll: true });
      }
    };
  }, []);

  useEffect(() => {
    if (state.status === "sent" || state.status === "already") {
      doneRef.current?.focus({ preventScroll: true });
    }
  }, [state.status]);

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== "Tab" || !panelRef.current) return;
    const stops = [...panelRef.current.querySelectorAll(FOCUSABLE)].filter(
      (node) => node.offsetParent !== null,
    );
    if (!stops.length) return;
    const first = stops[0];
    const last = stops[stops.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (
      !event.shiftKey &&
      (document.activeElement === last ||
        document.activeElement === panelRef.current)
    ) {
      event.preventDefault();
      first.focus();
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    if (state.status === "sending") return;
    const address = email.trim();
    if (!LOOKS_LIKE_EMAIL.test(address)) {
      setState({
        status: "error",
        message: "Enter the email address you'd like the code sent to.",
      });
      inputRef.current?.focus();
      return;
    }
    setState({ status: "sending" });
    const result = await requestCode(address, pitCrew, page);
    if (result.status) {
      onClaimed();
      setState({ status: result.status, email: address });
      return;
    }
    setState({ status: "error", message: result.error });
    inputRef.current?.focus();
  };

  const done = state.status === "sent" || state.status === "already";
  const failed = state.status === "error";

  return createPortal(
    <div
      className="fixed inset-0 z-overlay flex items-end justify-center sm:items-center sm:p-6"
      onKeyDown={onKeyDown}
    >
      <div
        className="absolute inset-0 bg-asphalt-950/80 animate-fade-in"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="relative w-full max-h-[calc(100dvh-1rem)] overflow-y-auto overscroll-contain rounded-t-lg border border-white/10 bg-asphalt-900 text-chalk shadow-lift animate-slide-up focus:outline-none sm:max-w-md sm:rounded-lg"
      >
        <div className="h-2 caution-tape" aria-hidden="true" />
        <div
          className="absolute inset-0 top-2 pointer-events-none asphalt-grain opacity-40"
          aria-hidden="true"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-2 top-4 z-raised flex h-11 w-11 items-center justify-center rounded-md text-gray-400 transition-colors duration-base ease-snap hover:bg-asphalt-700/60 hover:text-chalk"
        >
          <Icon name="close" className="h-5 w-5" />
        </button>

        <div className="relative px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] pt-7 sm:px-8 sm:pb-8">
          {done ? (
            <div role="status">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-caution-500/10 ring-1 ring-caution-500/40">
                <Icon name="mail" className="h-7 w-7 text-caution-400" />
              </div>
              <h2
                id={titleId}
                ref={doneRef}
                tabIndex={-1}
                className="font-display text-5xl leading-[0.9] tracking-tight focus:outline-none"
              >
                {state.status === "sent" ? (
                  <>
                    Check your <span className="text-caution-500">inbox</span>
                  </>
                ) : (
                  <>
                    You're already <span className="text-caution-500">in</span>
                  </>
                )}
              </h2>
              <p
                id={descriptionId}
                className="mt-4 leading-relaxed text-chalk/85"
              >
                {state.status === "sent" ? (
                  <>
                    Your 10% off code is on its way to{" "}
                    <strong className="break-all text-chalk">
                      {state.email}
                    </strong>
                    . It comes from {FROM_ADDRESS}, so check spam or promotions
                    if it isn't there in a few minutes.
                  </>
                ) : (
                  <>
                    <strong className="break-all text-chalk">
                      {state.email}
                    </strong>{" "}
                    already has its code. Look for the email from {FROM_ADDRESS}
                    . Each address gets one code.
                  </>
                )}
              </p>
              <ul className="mt-5 border-t border-chalk/15 text-sm text-chalk/90">
                {[
                  "Tap the button in the email and the code goes on your cart, or type it in the promo code box.",
                  "At checkout, sign in or create an account with this same email address.",
                  "10% comes off race tickets and party packages.",
                ].map((step) => (
                  <li
                    key={step}
                    className="flex items-start gap-3 border-b border-chalk/15 py-3"
                  >
                    <Icon
                      name="check"
                      className="mt-0.5 h-4 w-4 shrink-0 text-caution-400"
                      strokeWidth={2.25}
                    />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                className="mt-6"
                onClick={onClose}
              >
                Back to the site
              </Button>
            </div>
          ) : (
            <>
              <Pill variant="caution" size="sm">
                <Icon name="ticket" className="h-3.5 w-3.5" />
                Email deal
              </Pill>
              <h2
                id={titleId}
                className="mt-4 pr-8 font-display text-5xl leading-[0.9] tracking-tight sm:text-6xl"
              >
                <span className="block text-caution-500">10% off</span>
                <span className="block text-chalk">your races</span>
              </h2>
              <p
                id={descriptionId}
                className="mt-4 leading-relaxed text-chalk/85"
              >
                Enter your email and we'll send you a code for 10% off race
                tickets and party packages. Use it at checkout when you book
                online.
              </p>

              <form onSubmit={submit} noValidate className="mt-6">
                <label
                  htmlFor={inputId}
                  className="mb-2 block font-display text-xs uppercase tracking-widest text-chalk/70"
                >
                  Email address
                </label>
                <input
                  ref={inputRef}
                  id={inputId}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-invalid={failed || undefined}
                  aria-describedby={failed ? errorId : undefined}
                  placeholder="you@example.com"
                  // The site's own field styles colour the border, and mark
                  // it from aria-invalid, as on every other form here.
                  className="w-full rounded-md border-2 px-4 py-3 text-base transition-colors duration-base ease-snap"
                />
                {/* Left empty by people, filled in by form-filling bots. The
                    name is one no browser's autofill has a value for. */}
                <div className="sr-only" aria-hidden="true">
                  <label>
                    Leave this field empty
                    <input
                      type="text"
                      name="pit_crew"
                      tabIndex={-1}
                      autoComplete="off"
                      value={pitCrew}
                      onChange={(event) => setPitCrew(event.target.value)}
                    />
                  </label>
                </div>
                {failed && (
                  <p
                    id={errorId}
                    role="alert"
                    className="mt-2 flex items-start gap-2 text-sm text-race-300"
                  >
                    <Icon
                      name="alert-circle"
                      className="mt-0.5 h-4 w-4 shrink-0"
                    />
                    <span>{state.message}</span>
                  </p>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  className="mt-4"
                  disabled={state.status === "sending"}
                >
                  {state.status === "sending" ? "Sending…" : "Email my code"}
                  {state.status !== "sending" && (
                    <Icon name="arrow-right" className="h-4 w-4" />
                  )}
                </Button>
              </form>

              <p className="mt-4 text-xs leading-relaxed text-chalk/60">
                By signing up you agree to get emails from Speedway 146 with
                deals and track news. You can unsubscribe anytime from the link
                in any email. One code per email address, for one online order;
                it doesn't stack with the group discount. See our{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener"
                  className="text-chalk/80 underline hover:text-chalk"
                >
                  privacy policy
                </a>
                .
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-chalk/70 underline-offset-4 transition-colors duration-base ease-snap hover:text-chalk hover:underline"
              >
                No thanks
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default EmailOfferDialog;
