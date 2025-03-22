import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import UserMenu from './UserMenu';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <nav className={`${isAdminRoute ? 'bg-[#1A0B2E]' : 'bg-primary'} shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <img 
                src="/assets/LogoKodigo.png" 
                alt="Kodigo Logo" 
                className="h-8 w-auto" 
              />
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link 
              to="/" 
              className={`text-white hover:text-primary-light ${
                location.pathname === '/' ? 'font-semibold' : ''
              }`}
            >
              Inicio
            </Link>
            {user && (
              <Link 
                to="/bootcamps" 
                className={`text-white hover:text-primary-light ${
                  location.pathname.includes('/bootcamp') ? 'font-semibold' : ''
                }`}
              >
                Bootcamps
              </Link>
            )}
            {user ? (
              <div className="flex items-center space-x-6">
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className={`text-white hover:text-primary-light ${
                      isAdminRoute ? 'font-semibold' : ''
                    }`}
                  >
                  Dashboard
                  </Link>
                )}
                <UserMenu />
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-white hover:text-primary-light"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-primary px-4 py-2 rounded-md hover:bg-primary-light hover:text-white transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-primary-light"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-white hover:bg-primary-light rounded-md"
            >
              Inicio
            </Link>
            {user && (
              <Link
                to="/bootcamps"
                className="block px-3 py-2 text-white hover:bg-primary-light rounded-md"
              >
                Bootcamps
              </Link>
            )}
            <Link
              to="/register"
              className="block px-3 py-2 bg-white text-primary rounded-md hover:bg-primary-light hover:text-white transition-colors"
            >
              Registrarse
            </Link>
            {user ? (
              <>
                <Link
                  to="/admin"
                  className="block px-3 py-2 text-white hover:bg-primary-light rounded-md"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-3 py-2 text-white hover:bg-primary-light rounded-md"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 bg-white text-primary rounded-md hover:bg-primary-light hover:text-white transition-colors"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}