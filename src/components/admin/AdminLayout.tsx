import { useState, useEffect, ReactNode } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, CreditCard, Menu, X, Shield, AlertTriangle, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface AdminLayoutProps {
  children?: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, isAdmin, loading, signOut } = useAuth();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cerrar sidebar en dispositivos móviles al inicio
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };
    
    // Ejecutar al inicio
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Short delay to ensure auth state is loaded
    const timer = setTimeout(() => {
      setIsAuthChecking(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: BookOpen, label: 'Bootcamps', path: '/admin/bootcamps' },
    { icon: Users, label: 'Inscripciones', path: '/admin/enrollments' },
    { icon: CreditCard, label: 'Pagos', path: '/admin/payments' }
  ];

  // Show loading while checking auth
  if (loading || isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A0B2E]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6B20FF]" />
      </div>
    );
  }

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Función para determinar qué elemento del menú está activo basado en la URL actual
  const isActivePath = (path: string) => {
    const currentPath = window.location.pathname;
    if (path === '/admin' && currentPath === '/admin') {
      return true;
    }
    if (path !== '/admin' && currentPath.startsWith(path)) {
      return true;
    }
    return false;
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#6B20FF] transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo y título */}
        <div className="flex items-center justify-between h-16 px-4 bg-[#1A0A33]">
          <Link to="/" className="flex items-center justify-center w-full">
            <img 
              src="/assets/LogoKodigo.png" 
              alt="Kodigo Logo" 
              className="h-8 w-auto" 
            />
          </Link>
          <button
            className="text-white hover:bg-[#5119B7] p-1 rounded absolute right-3 md:hidden"
            onClick={toggleSidebar}
            aria-label="Cerrar menú"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Admin Panel Label */}
        <div className="px-4 py-3 bg-[#1A0A33] border-t border-[#5119B7]/30">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-green-400 flex-shrink-0" />
            <span className="ml-2 text-sm font-medium text-white truncate">Admin Panel</span>
          </div>
        </div>
        
        {/* Navegación */}
        <nav className="mt-2 flex-1 overflow-y-auto">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center px-4 py-3 text-gray-100 hover:bg-[#5119B7] transition-colors ${
                isActivePath(item.path) ? 'bg-[#5119B7] border-l-4 border-[#00FFF0]' : ''
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="ml-3 truncate">{item.label}</span>
            </Link>
          ))}
        </nav>
        
        {/* Logout */}
        <div className="border-t border-[#5119B7]/30 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-2 text-white hover:bg-[#5119B7] rounded transition-colors"
            aria-label="Cerrar sesión"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span className="ml-3">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : ''}`}>
        {/* Top Bar */}
        <header className="bg-white h-16 flex items-center justify-between px-4 shadow-sm z-30 sticky top-0">
          <button
            className="p-2 rounded-md hover:bg-gray-100 text-gray-700 focus:outline-none"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? "Ocultar menú" : "Mostrar menú"}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-[#6B20FF] flex items-center justify-center text-white uppercase font-bold">
              {user?.email?.charAt(0) || 'A'}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:inline-block truncate max-w-[150px]">
              {user?.email || 'Admin'}
            </span>
          </div>
        </header>

        {/* Error message if any */}
        {error && (
          <div className="bg-red-50 text-red-700 p-3 mx-4 my-2 rounded-lg flex items-center text-sm">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="flex-1">{error}</span>
            <button 
              className="ml-auto text-red-500 hover:text-red-700 p-1"
              onClick={() => setError(null)}
              aria-label="Cerrar mensaje de error"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 overflow-auto bg-gray-50">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}