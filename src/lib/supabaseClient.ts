// src/lib/supabaseClient.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Prüfe ob Supabase konfiguriert ist
export const isSupabaseConfigured = () => {
  return (
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "https://pixbaghzgolhfybhbaog.supabase.co" &&
    supabaseAnonKey !==
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpeGJhZ2h6Z29saGZ5YmhiYW9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3ODIzNTcsImV4cCI6MjA2ODM1ODM1N30.CF1pejuJktNQ2DIso_uvJdgYEN2bRT6ABjuwBA6EZfE"
  );
};

let supabase: SupabaseClient | null = null;

try {
  if (isSupabaseConfigured()) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } else {
    console.warn(
      "⚠️ Supabase nicht konfiguriert. Bitte .env.local mit echten Werten ausfüllen."
    );
  }
} catch (error) {
  console.error("Supabase Initialisierung fehlgeschlagen:", error);
}

export default supabase;
