import { useEffect, useState } from "react";
import { hasStoredSession, supabaseClient } from "../lib/supabase";
/** @returns {{ isStaff: boolean, loading: boolean, refetch: Function }} */
export function useAdmin() {
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // The same gate the auth hook keeps, for the same reason: this runs beside
    // it on every route through the header, and reaching for a client here
    // fetches the auth library whether or not the reader has an account.
    // Nobody is staff without being signed in first, so a browser holding no
    // session answers the question on its own. The check is a mount effect
    // either way, so signing in without leaving the page leaves the staff
    // links out of the header until the next load - and the panels that guard
    // on this hook mount their own copy of it, which reads the session the
    // sign-in stored.
    if (!hasStoredSession()) {
      setLoading(false);
      return;
    }
    checkStaffStatus();
  }, []);
  const checkStaffStatus = async () => {
    try {
      const {
        data: { user },
      } = await (await supabaseClient()).auth.getUser();
      if (!user) {
        setIsStaff(false);
        setLoading(false);
        return;
      }
      // Unfiltered, because the staff table's select policy only ever returns
      // the signed-in account's own row. A row coming back is the answer.
      const { data, error } = await (
        await supabaseClient()
      )
        .from("staff")
        .select("id")
        .single();
      if (error) {
        const msg = error.message || "";
        if (error.code === "PGRST116") {
          setIsStaff(false);
        } else if (
          error.code === "42P01" ||
          msg.includes("relation") ||
          msg.includes("does not exist")
        ) {
          console.warn(
            "[useAdmin] Staff table does not exist yet. Please run the setup SQL.",
          );
          setIsStaff(false);
        } else if (
          msg.includes("Load failed") ||
          msg.includes("Failed to fetch") ||
          msg.includes("cancelled") ||
          msg.includes("aborted") ||
          msg.includes("NetworkError") ||
          error.name === "AbortError" ||
          !msg
        ) {
          setIsStaff(false);
        } else {
          console.warn(
            "[useAdmin] Staff check returned an error:",
            msg || error,
          );
          setIsStaff(false);
        }
      } else {
        setIsStaff(!!data);
      }
    } catch (error) {
      const msg = error?.message || "";
      if (!(
        msg.includes("Load failed") ||
        msg.includes("Failed to fetch") ||
        msg.includes("cancelled") ||
        msg.includes("aborted") ||
        msg.includes("NetworkError") ||
        error?.name === "AbortError" ||
        !msg
      )) {
        console.warn("[useAdmin] Staff check threw:", msg || error);
      }
      setIsStaff(false);
    } finally {
      setLoading(false);
    }
  };
  return {
    isStaff,
    loading,
    refetch: checkStaffStatus,
  };
}
