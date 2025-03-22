import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading, isAdmin, refreshSession } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  
  // Try to refresh session if no user is found
  useEffect(() => {
    const checkAuth = async () => {
      if (!loading && !user) {
        try {
          await refreshSession();
        } catch (err) {
          console.error('Session refresh failed in protected route:', err);
        }
      }
      setIsChecking(false);
    };
    
    checkAuth();
  }, [user, loading, refreshSession]);
  
  // Show loading state while checking authentication
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A0B2E]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6B20FF]" />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check admin requirement
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}