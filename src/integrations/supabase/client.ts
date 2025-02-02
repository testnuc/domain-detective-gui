import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://htmawspfxydhacnuplma.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0bWF3c3BmeHlkaGFjbnVwbG1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1MDg4NzksImV4cCI6MjA1NDA4NDg3OX0.APHbJrzRVg86cNMgEpz6YYpKqlf6WaM2h3Txo1DsTIE";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);