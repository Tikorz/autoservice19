// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pixbaghzgolhfybhbaog.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpeGJhZ2h6Z29saGZ5YmhiYW9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3ODIzNTcsImV4cCI6MjA2ODM1ODM1N30.CF1pejuJktNQ2DIso_uvJdgYEN2bRT6ABjuwBA6EZfE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
