import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAdmin() {
  const [permissions, setPermissions] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminPermissions();
  }, []);

  const fetchAdminPermissions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('[useAdmin] No user logged in');
        setPermissions([]);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      console.log('[useAdmin] Checking permissions for user:', user.id);

      const { data, error } = await supabase
        .from('administrators')
        .select('permissions')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.log('[useAdmin] Error fetching permissions:', error.message);
        if (error.code === 'PGRST116') {
          console.log('[useAdmin] User is not an administrator');
        }
        setPermissions([]);
        setIsAdmin(false);
      } else {
        console.log('[useAdmin] User permissions:', data?.permissions);
        setPermissions(data?.permissions || []);
        setIsAdmin(data?.permissions?.length > 0);
      }
    } catch (error) {
      console.error('[useAdmin] Error fetching admin permissions:', error);
      setPermissions([]);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission) => {
    const result = permissions.includes(permission);
    console.log(`[useAdmin] Checking permission "${permission}":`, result);
    return result;
  };

  return {
    permissions,
    isAdmin,
    loading,
    hasPermission,
    refetch: fetchAdminPermissions
  };
}
