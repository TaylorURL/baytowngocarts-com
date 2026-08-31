import { useEffect, useState } from "react";
import { supabaseClient } from "../lib/supabase";
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
    supabaseClient()
      .then((client) => {
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
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
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
  const signUp = async (email, password) => {
    const { data, error } = await (
      await supabaseClient()
    ).auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined,
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
