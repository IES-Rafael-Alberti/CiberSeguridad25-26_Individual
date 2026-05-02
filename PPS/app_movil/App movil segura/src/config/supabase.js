import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

let supabase = null;

if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });
}

export function hasSupabase() {
  return Boolean(supabase);
}

export function getSupabase() {
  return supabase;
}
