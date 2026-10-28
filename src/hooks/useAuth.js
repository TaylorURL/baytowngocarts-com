import { useEffect, useState } from "react";
import {
  hasStoredSession,
  onSupabaseClient,
  supabaseClient,
} from "../lib/supabase";

/*
 * What a visitor is told when the request never got an answer.
 *
 * WebKit calls it "Load failed" and Chromium calls it "Failed to fetch", and
 * the auth library passes that string along untouched, so the form used to put
 * the browser's own two words in front of somebody who had just pressed
 * Create account. Neither says what happened or what to do about it.
 */
const UNREACHABLE_MESSAGE =
  "We could not reach the server. Check your connection and try again.";

/* How long to wait before the second attempt. Long enough to be on the other
   side of what loses a single request on a phone - a handover between cells, a
   captive portal answering for a moment, an in-app webview that suspended the
   network while the page was backgrounded - and short enough to be inside the
   press that asked for it. */
const RETRY_DELAY_MS = 800;

/*
 * Whether the request got no answer at all.
 *
 * The auth library reports a fetch that never completed as a retryable error
 * carrying status 0, and that is the one failure that cannot have reached the
 * server: no request was answered, so nothing was created and asking again
 * cannot duplicate anything. Anything the server did answer - every 4xx, every
 * 5xx, a rejected password, an address already registered - has a status on it
 * and is reported exactly as it stands.
 */
const unreachable = (error) => Boolean(error) && error.status === 0;

const asUnreachable = (error) => {
  const reported = new Error(UNREACHABLE_MESSAGE);
  reported.name = error?.name || "Error";
  reported.status = 0;
  reported.cause = error;
  return reported;
};

/*
 * Makes one auth call, gives a request that got no answer a second chance, and
 * never rejects.
 *
 * A rejection out of here is what left the submit handler stuck: it threw
 * inside the await, so the line that re-enabled the button never ran and the
 * form sat disabled on "Creating account…" with nothing said. The library
 * chunk failing to arrive and the environment variables being absent both
 * throw rather than return, so both arrive here as an error the form can
 * report.
 */
const settle = async (call) => {
  try {
    let result = await call();
    if (unreachable(result.error)) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      result = await call();
    }
    if (unreachable(result.error)) {
      return { data: result.data ?? null, error: asUnreachable(result.error) };
    }
    return result;
  } catch (error) {
    return { data: null, error: asUnreachable(error) };
  }
};
/** @returns {{ user: object|null, loading: boolean, signIn: Function, signUp: Function, signOut: Function }} */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // The client arrives a tick later than the render that asked for it, so
    // the effect can be torn down before it lands and the subscription has to
    // be unsubscribed by whichever of the two happens second.
    let cancelled = false;
    let subscription = null;
    let stopWaiting = null;
    const attach = (client) => {
      if (cancelled) return;
      client.auth.getUser().then(({ data }) => {
        if (cancelled) return;
        setUser(data?.user ?? null);
        setLoading(false);
      });
      subscription = client.auth.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }).data.subscription;
      if (cancelled) subscription.unsubscribe();
    };
    // Asking for a client is asking for the auth library, and the header asks
    // on every route - so a front page with nobody signed in would pull a
    // library the size of the rest of its first screen to establish exactly
    // that. A browser with no session in storage cannot be signed in, and that
    // answer is already on the machine. The library is still fetched the
    // moment anybody signs in, here or anywhere else on the page, and this
    // attaches to the client that call builds.
    if (hasStoredSession()) {
      supabaseClient()
        .then(attach)
        .catch(() => {
          if (!cancelled) setLoading(false);
        });
    } else {
      setLoading(false);
      stopWaiting = onSupabaseClient(attach);
    }
    return () => {
      cancelled = true;
      if (stopWaiting) stopWaiting();
      if (subscription) subscription.unsubscribe();
    };
  }, []);
  const signIn = async (email, password) =>
    settle(async () =>
      (await supabaseClient()).auth.signInWithPassword({
        email,
        password,
      }),
    );
  // marketingOptIn lands in the user's metadata, where the trigger that makes
  // their email_preferences row reads it.
  const signUp = async (email, password, { marketingOptIn = true } = {}) =>
    settle(async () =>
      (await supabaseClient()).auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined,
          data: { marketing_opt_in: Boolean(marketingOptIn) },
        },
      }),
    );
  const signOut = async () => {
    const { error } = await settle(async () =>
      (await supabaseClient()).auth.signOut(),
    );
    return { error };
  };
  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
}
