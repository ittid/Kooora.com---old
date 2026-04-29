import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Server-only client using the service role key — bypasses RLS.
// Only import from server code (route handlers, server actions, server components).
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
