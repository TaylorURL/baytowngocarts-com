import { useEffect, useState } from "react";
import {
  hasStoredSession,
  onSupabaseClient,
  supabaseClient,
} from "../lib/supabase";
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
  const signIn = async (email, password) => {
    const { data, error } = await (
      await supabaseClient()
    ).auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };
  // marketingOptIn lands in the user's metadata, where the trigger that makes
  // their email_preferences row reads it.
  const signUp = async (email, password, { marketingOptIn = true } = {}) => {
    const { data, error } = await (
      await supabaseClient()
    ).auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined,
        data: { marketing_opt_in: Boolean(marketingOptIn) },
      },
    });
    return { data, error };
  };
  const signOut = async () => {
    const { error } = await (await supabaseClient()).auth.signOut();
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
