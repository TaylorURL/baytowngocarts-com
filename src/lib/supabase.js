const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client = null;
let building = null;
const waiting = new Set();

/**
 * Shared Supabase client, built on first use.
 *
 * The library is fetched at that point rather than imported at the top of the
 * file, because a static import puts it in the graph the first document
 * loads: every visitor to a page with no account, no cart and no staff panel
 * pays for it before anything paints. Reaching for it here keeps it in a chunk
 * of its own, asked for by the first call that needs a client.
 *
 * The build renders every route to markup in an environment that holds no
 * Supabase credentials, so connecting at import time would also fail the build
 * over pages that never talk to the database.
 *
 * @returns {Promise<object>} the client, once the library has landed
 */
export const supabaseClient = async () => {
  if (client) return client;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      `Missing Supabase environment variables. URL: ${supabaseUrl ? "Present" : "Missing"}, Key: ${supabaseAnonKey ? "Present" : "Missing"}`,
    );
  }
  if (!building) {
    building = import("@supabase/supabase-js").then(({ createClient }) => {
      client = createClient(supabaseUrl, supabaseAnonKey);
      building = null;
      const announce = [...waiting];
      waiting.clear();
      announce.forEach((then) => then(client));
      return client;
    });
  }
  return building;
};

/* What a session looks like arriving in a URL: the tokens the project's own
   redirect carries in the fragment, and the codes it carries instead when the
   link had expired or been used. */
const URL_SESSION = /(?:^|[#?&])(?:access_token|error_code|error_description)=/;

/**
 * Whether this browser is holding a session, or is being handed one.
 *
 * The library persists one in localStorage under a key it derives from the
 * project URL, and splits a long one across numbered siblings, so this asks
 * whether anything in that namespace is there rather than rebuilding the exact
 * name the library would have chosen. Nothing there means nobody signed in on
 * this browser, which is an answer worth having before the library is fetched
 * to give it: the header asks on every route, and the visitor it asks about is
 * usually somebody with no account reading the front page.
 *
 * Storage is not the only way a session arrives. Somebody following a link the
 * project mailed - a confirmation, a recovery, an invite - lands with the
 * tokens in the URL and nothing in storage yet, and the library reads them out
 * of the URL while it is being built, so they are read only if something asks
 * for a client to read them. That arrival is the one where storage gives the
 * wrong answer, so the URL is asked as well. The code half of the same
 * exchange needs no clause here: it leaves its verifier under a key the scan
 * below already matches, and a code with no verifier behind it is not a
 * session this browser can finish.
 *
 * @returns {boolean} whether a session could be waiting for the library
 */
export const hasStoredSession = () => {
  try {
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith("sb-") && key.includes("auth-token")) {
        return true;
      }
    }
  } catch {
    // Storage the browser will not open is storage the library could not have
    // written a session into either.
  }
  return (
    URL_SESSION.test(window.location.hash) ||
    URL_SESSION.test(window.location.search)
  );
};

/**
 * Hands over the client the moment one exists, however it came to.
 *
 * A hook that read no session out of storage and so never asked for a client
 * still has to notice the session a sign-in on this same page creates. The
 * sign-in runs in another component's copy of the hook and nothing about it
 * reaches a hook subscribed to nothing, so the client is what announces
 * itself.
 *
 * @param {Function} then - given the client when it is built
 * @returns {Function} stops waiting
 */
export const onSupabaseClient = (then) => {
  if (client) {
    then(client);
    return () => {};
  }
  waiting.add(then);
  return () => waiting.delete(then);
};
