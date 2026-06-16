import { createClient } from '@supabase/supabase-js';

// Retrieve the environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if the variables are defined to prevent runtime errors
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables are missing. Please check your .env file.");
}

// Initialize and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);