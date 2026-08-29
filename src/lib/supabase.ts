import { createClient } from '@supabase/supabase-js';

const env = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://fcevysxmtmydscvworfu.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjZXZ5c3htdG15ZHNjdndvcmZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMjI2ODIsImV4cCI6MjEwMzU5ODY4Mn0.bKZE5MCP-9jvTp8xJU1glwA-EX7VTvMtbVR6dtrdIws';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') &&
  supabaseAnonKey.trim().length > 10
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  }
});

// Persistent local helper for offline/cached data features
export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(`kopargaon_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn(`Error reading key ${key} from storage:`, e);
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`kopargaon_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error saving key ${key} to storage:`, e);
  }
}
