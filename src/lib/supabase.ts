import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';
import * as mockData from './mock-admin';

export const USE_MOCK_DATA = false;

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cgkpekpkjwttlwusxltl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNna3Bla3Brand0dGx3dXN4bHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1Njk0ODcsImV4cCI6MjA1ODE0NTQ4N30.FjoQEM2WtVLgwW57Apgwr3XEnHjcCKGWeW9o8zYLZcI';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

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
    realtime: { 
      // Disable realtime subscriptions for this client
    }
  }
);

export const safeQuery = async <T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  mockFn?: () => Promise<{ data: any; error: any }>
): Promise<{ data: T | null; error: string | null }> => {
  if (USE_MOCK_DATA && mockFn) {
    try {
      const mockResult = await mockFn();
      console.log('Usando datos simulados:', mockResult);
      return mockResult as { data: T | null; error: string | null };
    } catch (mockErr) {
      console.error('Error al usar datos simulados:', mockErr);
    }
  }

  try {
    const { data, error } = await queryFn();
    
    if (error) {
      console.error('Supabase query error:', error);
      
      if (error.message?.includes('role "admin" does not exist')) {
        console.warn('Role admin does not exist in PostgreSQL. Usando verificación alternativa.');
        
        try {
          const { data: userData } = await supabase.auth.getUser();
          const isAdmin = userData?.user?.app_metadata?.role === 'admin';
          
          return isAdmin 
            ? { data: [] as any, error: null } 
            : { data: null, error: 'No tienes permisos para realizar esta acción.' };
        } catch (authError) {
          console.error('Error en verificación alternativa:', authError);
          return { 
            data: null, 
            error: 'Error de autenticación. Por favor, inicia sesión nuevamente.' 
          };
        }
      }
      
      return { 
        data: null, 
        error: error.message || 'Error en la operación de base de datos' 
      };
    }
    
    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error during Supabase query:', err);
    
    if (err instanceof Error && err.message.includes('role "admin" does not exist')) {
      console.warn('Role admin does not exist in PostgreSQL. Usando verificación alternativa.');
      
      try {
        const { data: userData } = await supabase.auth.getUser();
        const isAdmin = userData?.user?.app_metadata?.role === 'admin';
        
        return isAdmin 
          ? { data: [] as any, error: null } 
          : { data: null, error: 'No tienes permisos para realizar esta acción.' };
      } catch (authError) {
        console.error('Error en verificación alternativa:', authError);
        return { 
          data: null, 
          error: 'Error de autenticación. Por favor, inicia sesión nuevamente.' 
        };
      }
    }
    
    return { 
      data: null, 
      error: err instanceof Error ? err.message : 'Error inesperado en la comunicación con el servidor' 
    };
  }
};

export const authOperation = async <T>(
  operation: () => Promise<{ data: T | null; error: any }>,
  maxRetries = 1
): Promise<{ data: T | null; error: string | null }> => {
  let retries = 0;
  
  while (retries <= maxRetries) {
    try {
      const response = await operation();
      const { data, error } = response;
      
      if (!error) {
        return { data, error: null };
      }
      
      const errorMessage = error?.message || 
                         (error?.name === 'AuthApiError' ? error.message : null) ||
                         'Error en la autenticación';
      
      if (typeof error === 'object') {
        console.warn('Auth operation error details:', JSON.stringify(error));
      }
      
      if (errorMessage.includes('JWT expired')) {
        const { data: refreshData } = await supabase.auth.refreshSession();
        if (refreshData) {
          retries++;
          continue;
        }
      }
      
      if (error?.status === 429) {
        console.warn('Rate limit hit in auth operation');
        if (retries < maxRetries) {
          retries++;
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
          continue;
        }
      }
      
      return { 
        data: null, 
        error: errorMessage
      };
    } catch (err) {
      console.error('Unexpected error in auth operation:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err.message : 'Error inesperado durante la autenticación' 
      };
    }
  }
  
  return { data: null, error: 'No se pudo completar la operación después de varios intentos' };
};

export const isUserAdmin = async (): Promise<boolean> => {
  if (USE_MOCK_DATA) {
    console.log('Modo desarrollo: simulando ser administrador');
    return true;
  }
  
  try {
    const { data } = await supabase.auth.getUser();
    if (!data?.user) return false;
    
    return data.user.app_metadata?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

export const getBootcamps = async () => {
  return safeQuery(
    async () => {
      const result = await supabase.from('bootcamps').select('*');
      return { data: result.data, error: result.error };
    },
    mockData.mockGetBootcamps
  );
};

export const getProfiles = async () => {
  return safeQuery(
    async () => {
      const result = await supabase.from('profiles').select('*');
      return { data: result.data, error: result.error };
    },
    mockData.mockGetProfiles
  );
};

export const getEnrollments = async () => {
  return safeQuery(
    async () => {
      const result = await supabase.from('enrollments').select('*');
      return { data: result.data, error: result.error };
    },
    mockData.mockGetEnrollments
  );
};

export const getPayments = async () => {
  return safeQuery(
    async () => {
      const result = await supabase.from('payments').select('*');
      return { data: result.data, error: result.error };
    },
    mockData.mockGetPayments
  );
};

export const getAdminStats = async () => {
  return safeQuery(
    async () => {
      const result = await supabase.rpc('get_enrollment_stats');
      return { data: result.data, error: result.error };
    },
    mockData.mockGetAdminStats
  );
};