import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Code2, LayoutDashboard, BookOpen, Users, CreditCard, Menu, X, Shield, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, isAdmin, loading } = useAuth();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-primary transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-primary-dark">
          <Link to="/" className="flex items-center">
            <Code2 className="h-8 w-8 text-white" />
            <span className="ml-2 text-xl font-bold text-white">Kodigo</span>
          </Link>
          <button
            className="md:hidden text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="px-6 py-4 bg-primary-dark border-t border-primary-light/10">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-green-400" />
            <span className="ml-2 text-sm font-medium text-white">Admin Panel</span>
          </div>
        </div>
        <nav className="mt-8">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center px-6 py-3 text-gray-100 hover:bg-primary-dark"
            >
              <item.icon className="h-5 w-5" />
              <span className="ml-3">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`md:ml-64 min-h-screen`}>
        {/* Top Bar */}
        <div className="bg-white h-16 flex items-center justify-between px-6 shadow-sm">
          <button
            className="md:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 uppercase font-bold">
                {user?.email?.charAt(0) || 'A'}
              </div>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {user?.email || 'Admin'}
            </span>
          </div>
        </div>

        {/* Error message if any */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 m-6 rounded-lg flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            {error}
            <button 
              className="ml-auto text-red-500 hover:text-red-700"
              onClick={() => setError(null)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Page Content */}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}