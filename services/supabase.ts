import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://wrypzsfleikoxugqbxeb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyeXB6c2ZsZWlrb3h1Z3FieGViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NDAzMTMsImV4cCI6MjA3NjExNjMxM30.Yvi8qW9QV0nezOnbQVo9zCZWu8ZuBhssFe-1Uq3N4hc";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("A URL e a Chave Anônima do Supabase são obrigatórias.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);