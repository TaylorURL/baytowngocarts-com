import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
/**
 * Checks whether the current authenticated user has staff privileges
 * by querying the `staff` table in Supabase.
 * @returns {{ isAdmin: boolean, isStaff: boolean, loading: boolean, refetch: Function }}
 */
export function useAdmin() {
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    checkStaffStatus();
  }, []);
  const checkStaffStatus = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setIsStaff(false);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("staff")
        .select("id")
        .eq("user_id", user.id)
        .single();
      if (error) {
        if (error.code === "PGRST116") {
          setIsStaff(false);
        } else if (
          error.code === "42P01" ||
          error.message.includes("relation") ||
          error.message.includes("does not exist")
        ) {
          console.warn(
            "[useAdmin] Staff table does not exist yet. Please run the setup SQL.",
          );
          setIsStaff(false);
        } else if (error.message.includes("Load failed")) {
          console.warn(
            "[useAdmin] Network error checking staff status. Assuming not staff.",
          );
          setIsStaff(false);
        } else {
          console.error("[useAdmin] Error checking staff status:", error);
          setIsStaff(false);
        }
      } else {
        setIsStaff(!!data);
      }
    } catch (error) {
      console.error("[useAdmin] Error checking staff status:", error);
      setIsStaff(false);
    } finally {
      setLoading(false);
    }
  };
  return {
    isAdmin: isStaff,
    isStaff,
    loading,
    refetch: checkStaffStatus,
  };
}
