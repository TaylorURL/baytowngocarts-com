import {createClient} from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isMissingConfig = !supabaseUrl || !supabaseAnonKey;

if (isMissingConfig) {
    console.warn('Supabase configuration missing. Some features may not work.');
}

export const supabase = isMissingConfig 
    ? null 
    : createClient(supabaseUrl, supabaseAnonKey);
