import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

// Componente LoadingSpinner interno para evitar dependencias
function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-[#1A0B2E] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6B20FF]" />
    </div>
  );
}

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Obtener los metadatos del usuario
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error al verificar el estado de administrador:', error);
          setIsAdmin(false);
          return;
        }
        
        // Verificar si el usuario tiene el rol de administrador
        const isUserAdmin = data.user?.app_metadata?.role === 'admin';
        setIsAdmin(isUserAdmin);
        
        if (isUserAdmin) {
          console.log('Usuario autenticado como administrador');
        }
      } catch (error) {
        console.error('Error inesperado al verificar el rol de administrador:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Si no es administrador, redirigir al inicio de sesión
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // Si es administrador, mostrar el contenido protegido
  return <>{children}</>;
}
