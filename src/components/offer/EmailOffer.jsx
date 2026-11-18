import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import ErrorBoundary from "../shell/ErrorBoundary.jsx";
import { withBuildRefresh } from "../../lib/chunk-recovery.js";
import { whenSettled } from "../../lib/idle.js";
import { hasStoredSession } from "../../lib/supabase.js";
import { useCart } from "../../hooks/useCart.js";

const EmailOfferDialog = lazy(
  withBuildRefresh(() => import("./EmailOfferDialog.jsx")),
);

/*
 * Decides when the sign-up offer is put in front of a visitor, and holds the
 * dialog's code back until then.
 *
 * Only this much ships with the shell. The dialog, its form and its copy are
 * a chunk of their own, asked for the moment it opens, so a visitor who never
 * sees it never downloads it. Nothing is read from the window or from storage
 * until the page has arrived, which also keeps the build's render and the
 * render that attaches to it drawing the same nothing.
 *
 * It opens two seconds after the page has settled, on the pages a new
 * visitor reads, and never on the cart, the account pages, the staff pages,
 * or anywhere a sign-in or a checkout is under way (those sit outside this
 * layout entirely). A visitor who signed up is never asked again, one who
 * closed it not for two weeks, and nobody who is signed in, already holds a
 * code, or is a crawler or a page-speed run is asked at all.
 */

const STORE_KEY = "speedway146:email-offer";
const SNOOZE_MS = 14 * 24 * 60 * 60 * 1000;
// The track wants it up as soon as the site opens; two seconds lets the hero land first.
const DELAY_MS = 2000;
const RETRY_MS = 4000;
const PAGES = new Set([
  "/",
  "/about",
  "/pricing",
  "/events",
  "/contact",
  "/faq",
]);
const NOT_A_READER = /bot\b|crawler|spider|slurp|headlesschrome|lighthouse/i;

const readChoice = () => {
  try {
    return JSON.parse(window.localStorage.getItem(STORE_KEY) || "null");
  } catch {
    return null;
  }
};

const remember = (state) => {
  try {
    window.localStorage.setItem(
      STORE_KEY,
      JSON.stringify({ state, at: Date.now() }),
    );
  } catch {
    // Storage the browser will not open forgets the answer. The worst that
    // costs is the offer again on a later visit.
  }
};

const wanted = () => {
  const choice = readChoice();
  if (choice?.state === "claimed") return false;
  if (choice?.state === "dismissed" && Date.now() - choice.at < SNOOZE_MS)
    return false;
  try {
    if (NOT_A_READER.test(navigator.userAgent || "")) return false;
    if (/[?&]psi=/.test(window.location.search)) return false;
  } catch {
    return false;
  }
  if (hasStoredSession()) return false;
  if (useCart.getState().promoCode) return false;
  return true;
};

/* Somebody typing into a form, or with a menu open, is not interrupted; the
   offer waits for them to finish. */
const busy = () => {
  const active = document.activeElement;
  if (
    active &&
    (active.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName))
  ) {
    return true;
  }
  return Boolean(
    document.querySelector(
      '[aria-controls="mobile-menu"][aria-expanded="true"], [data-nav-panel][data-state="open"]',
    ),
  );
};

const EmailOffer = () => {
  const { pathname } = useLocation();
  const onPage = PAGES.has(pathname.replace(/\/+$/, "") || "/");
  const [settled, setSettled] = useState(false);
  const [open, setOpen] = useState(false);
  const claimed = useRef(false);

  useEffect(() => whenSettled(() => setSettled(true)), []);

  useEffect(() => {
    if (!settled || open || !onPage || !wanted()) return undefined;
    let timer = setTimeout(function show() {
      if (busy()) {
        timer = setTimeout(show, RETRY_MS);
        return;
      }
      if (wanted()) setOpen(true);
    }, DELAY_MS);
    return () => clearTimeout(timer);
  }, [settled, open, onPage]);

  const close = useCallback(() => {
    setOpen(false);
    if (!claimed.current) remember("dismissed");
  }, []);

  const onClaimed = useCallback(() => {
    claimed.current = true;
    remember("claimed");
  }, []);

  // Leaving for a page it never opens on, by the back button say, closes it.
  useEffect(() => {
    if (open && !onPage) close();
  }, [open, onPage, close]);

  if (!open) return null;
  return (
    <ErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <EmailOfferDialog
          page={pathname}
          onClose={close}
          onClaimed={onClaimed}
        />
      </Suspense>
    </ErrorBoundary>
  );
};

export default EmailOffer;
