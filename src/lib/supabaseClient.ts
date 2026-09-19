import { createClient } from "@supabase/supabase-js";

// Limpiamos espacios y eliminamos cualquier slash final accidental
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseUrl = rawUrl.trim().replace(/\/+$/, "");
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Faltan las credenciales de Supabase en .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);