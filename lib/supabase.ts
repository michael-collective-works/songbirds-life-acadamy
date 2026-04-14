import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let supabaseAdmin: SupabaseClient | null = null

export function hasSupabase() {
  return !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY
}

// Server-only admin client. Never expose service role to the browser.
export function getSupabaseAdmin(): SupabaseClient {
  if (!hasSupabase()) {
    throw new Error("Supabase env vars are not set")
  }
  if (!supabaseAdmin) {
    supabaseAdmin = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string,
      {
        db: { schema: "public" },
        auth: { persistSession: false, autoRefreshToken: false },
      }
    )
  }
  return supabaseAdmin
}
