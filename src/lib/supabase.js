const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client = null;
let building = null;
const waiting = new Set();

/*
 * How long an auth request is given before it is abandoned.
 *
 * The failure this exists for is not a request that is refused, it is one that
 * never finishes: the connection half-opens, nothing comes back, and fetch
 * neither resolves nor rejects. An in-app webview is where that happens -
 * the host app suspends the network under the page, or hands it a proxy that
 * accepts the connection and then stops - and the auth library sets no
 * deadline of its own, so the promise the form is waiting on simply never
 * settles. The submit button then reads "Creating account…" and stays
 * disabled for the rest of the visit with nothing said to the visitor.
 *
 * A bounded wait turns that into an ordinary failure: the form reports it, the
 * button comes back, and the typed values are still there to send again. Only
 * the auth endpoints are held to it, because they are a short exchange behind
 * a button somebody is waiting at - a file upload is neither.
 */
const AUTH_TIMEOUT_MS = 12000;
const AUTH_PATH = "/auth/v1/";

const timedFetch = (input, init = {}) => {
  const target = typeof input === "string" ? input : input?.url || "";
  // A caller carrying its own signal already has its own deadline, and
  // AbortController is not something to assume exists.
  if (
    target.indexOf(AUTH_PATH) === -1 ||
    init.signal ||
    typeof AbortController === "undefined"
  ) {
    return fetch(input, init);
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AUTH_TIMEOUT_MS);
  const settled = (value, failed) => {
    clearTimeout(timer);
    if (failed) throw value;
    return value;
  };
  return fetch(input, { ...init, signal: controller.signal }).then(
    (response) => settled(response, false),
    (error) => settled(error, true),
  );
};

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
    building = import("@supabase/supabase-js").then(
      ({ createClient }) => {
        client = createClient(supabaseUrl, supabaseAnonKey, {
          global: { fetch: timedFetch },
        });
        building = null;
        const announce = [...waiting];
        waiting.clear();
        announce.forEach((then) => then(client));
        return client;
      },
      (error) => {
        // A chunk that did not arrive must not be remembered as the answer.
        // Left in place, the rejected promise is what every later call on the
        // page is handed, so one lost request would take the library for the
        // rest of the visit and nothing could ever ask for it again - a second
        // press of the button has to be able to fetch it.
        building = null;
        throw error;
      },
    );
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
