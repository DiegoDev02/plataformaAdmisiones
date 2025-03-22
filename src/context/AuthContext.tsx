import { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthError, Session } from '@supabase/supabase-js';
import { supabase, authOperation } from '../lib/supabase';

interface AuthUser extends User {
  role?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  isAdmin: boolean;
}

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  AUTH_USER: 'kodigo-auth-user',
  AUTH_SESSION: 'kodigo-auth-session'
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [refreshTimer, setRefreshTimer] = useState<NodeJS.Timeout | null>(null);

  // Load session from localStorage on initial load
  useEffect(() => {
    const loadCachedSession = () => {
      try {
        const cachedSession = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_SESSION);
        const cachedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER);
        
        if (cachedSession && cachedUser) {
          const sessionData = JSON.parse(cachedSession);
          const userData = JSON.parse(cachedUser);
          
          const expiryTime = new Date(sessionData.expires_at || 0).getTime();
          const now = new Date().getTime();
          
          // Only use cached session if it hasn't expired
          if (expiryTime > now) {
            setSession(sessionData);
            setUser(userData);
            setIsAdmin(userData.app_metadata?.role === 'admin');
          }
        }
      } catch (err) {
        console.error('Error loading cached session:', err);
        // Clear potentially corrupted cache
        localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_SESSION);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_USER);
      }
    };
    
    loadCachedSession();
  }, []);

  const refreshSession = async () => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        throw error;
      }
      
      if (data.session) {
        setSession(data.session);
        localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_SESSION, JSON.stringify(data.session));
        
        if (data.user) {
          const userData = {
            ...data.user,
            role: data.user.app_metadata?.role || 'user'
          };
          
          setUser(userData);
          setIsAdmin(userData.role === 'admin');
          localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify(userData));
        }
      }
    } catch (err) {
      console.error('Session refresh failed:', err);
      // If refresh fails, sign out
      await signOut();
    }
  };

  // Set up automatic session refresh
  useEffect(() => {
    if (session && !refreshTimer) {
      // Calculate time to refresh (5 minutes before expiry)
      const expiryTime = new Date(session.expires_at || 0).getTime();
      const now = new Date().getTime();
      const timeToRefresh = Math.max(0, expiryTime - now - 5 * 60 * 1000);
      
      const timer = setTimeout(refreshSession, timeToRefresh);
      setRefreshTimer(timer);
    }
    
    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
        setRefreshTimer(null);
      }
    };
  }, [session]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Get initial session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          const userData = {
            ...session.user,
            role: session.user.app_metadata?.role || 'user',
            ...profile
          };
            
          setUser(userData);
          setSession(session);
          setIsAdmin(userData.role === 'admin');
          
          // Cache in localStorage
          localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify(userData));
          localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err instanceof AuthError ? err.message : 'Error initializing auth');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            const userData = {
              ...session.user,
              role: session.user.app_metadata?.role || 'user',
              ...profile
            };
              
            setUser(userData);
            setSession(session);
            setIsAdmin(userData.role === 'admin');
            
            // Cache in localStorage
            localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify(userData));
            localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
          } catch (err) {
            console.error('Error fetching user profile:', err);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          setIsAdmin(false);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_USER);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_SESSION);
        } else if (event === 'SESSION_UPDATED' && session) {
          setSession(session);
          localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    session,
    loading,
    error,
    isAdmin,
    refreshSession,
    signIn: async (email: string, password: string): Promise<void> => {
      setError(null);
      setLoading(true);
      
      try {
        const { data, error } = await authOperation(() => 
          supabase.auth.signInWithPassword({ email, password })
        );
        
        if (error) {
          if (error.includes('Database error querying schema')) {
            throw new Error('Error de conexión. Por favor intenta de nuevo en unos minutos.');
          }
          throw new Error(error);
        }
        
        if (!data?.user) {
          throw new Error('No se recibieron datos del usuario');
        }
        
        // No need to fetch profile or set state as the onAuthStateChange will handle it
      } catch (error) {
        console.error('Sign in error:', error);
        setError(
          error instanceof Error
            ? error.message === 'Invalid login credentials'
              ? 'Credenciales inválidas'
              : error.message === 'Database error querying schema'
              ? 'Error de conexión. Por favor intenta de nuevo en unos minutos.'
              : error.message
            : 'Error al iniciar sesión'
        );
        setLoading(false);
        throw error;
      }
    },
    signUp: async (data: SignUpData): Promise<void> => {
      setLoading(true);
      try {
        const { error } = await authOperation(() => 
          supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
              data: {
                first_name: data.firstName,
                last_name: data.lastName,
                phone: data.phone,
                country: data.country,
                role: 'user' // Default role for new users
              }
            }
          })
        );

        if (error) {
          if (error.includes('User already registered')) {
            throw new Error('Este correo ya está registrado. Por favor inicia sesión o utiliza otro correo.');
          }
          throw new Error(error);
        }
        
        // Create profile handled by the trigger
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error al registrarse';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    signOut: async () => {
      try {
        const { error } = await supabase.auth.signOut();
        
        if (error) throw error;
        
        // Clear cached user data
        localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_USER);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_SESSION);
        
        setUser(null);
        setSession(null);
        setIsAdmin(false);
      } catch (error) {
        console.error('Error signing out:', error);
        // Force sign out on client side even if server-side fails
        localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_USER);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_SESSION);
        setUser(null);
        setSession(null);
        setIsAdmin(false);
      }
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}