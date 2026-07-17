import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Set them in .env.local."
  );
}

/**
 * Anon-key client. Only used for public reads (RLS restricts writes to
 * authenticated users), so it's safe to share between server and browser code.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
