const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client = null;
let building = null;

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
      return client;
    });
  }
  return building;
};
