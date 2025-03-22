import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cgkpekpkjwttlwusxltl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNna3Bla3Brand0dGx3dXN4bHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1Njk0ODcsImV4cCI6MjA1ODE0NTQ4N30.FjoQEM2WtVLgwW57Apgwr3XEnHjcCKGWeW9o8zYLZcI';

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

// Configure client with error handling and advanced options
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: 'kodigo-auth',
      storage: localStorage
    },
    global: {
      headers: {
        'x-client-info': 'kodigo-platform@1.0.0'
      }
    },
    db: {
      schema: 'public'
    },
    realtime: { enabled: false }
  }
);

// Enhanced error handling wrapper
export const safeQuery = async <T>(
  queryFn: () => Promise<{ data: T | null; error: any }>
): Promise<{ data: T | null; error: string | null }> => {
  try {
    const { data, error } = await queryFn();
    
    if (error) {
      console.error('Supabase query error:', error);
      return { 
        data: null, 
        error: error.message || 'Error en la operación de base de datos' 
      };
    }
    
    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error during Supabase query:', err);
    return { 
      data: null, 
      error: err instanceof Error ? err.message : 'Error inesperado en la comunicación con el servidor' 
    };
  }
};

// Helper for authentication operations with retry
export const authOperation = async <T>(
  operation: () => Promise<{ data: T | null; error: any }>,
  maxRetries = 1
): Promise<{ data: T | null; error: string | null }> => {
  let retries = 0;
  
  while (retries <= maxRetries) {
    try {
      const { data, error } = await operation();
      
      if (!error) {
        return { data, error: null };
      }
      
      // If session expired, try to refresh
      if (error.message?.includes('JWT expired')) {
        const { data: refreshData } = await supabase.auth.refreshSession();
        if (refreshData) {
          retries++;
          continue;
        }
      }
      
      return { 
        data: null, 
        error: error.message || 'Error en la autenticación' 
      };
    } catch (err) {
      return { 
        data: null, 
        error: err instanceof Error ? err.message : 'Error inesperado durante la autenticación' 
      };
    }
  }
  
  return { data: null, error: 'No se pudo completar la operación después de varios intentos' };
};

// Check if user is admin
export const isUserAdmin = async (): Promise<boolean> => {
  try {
    const { data } = await supabase.auth.getUser();
    if (!data?.user) return false;
    
    return data.user.app_metadata?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};