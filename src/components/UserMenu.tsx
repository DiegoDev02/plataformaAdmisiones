import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Settings, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ChangePasswordModal from './ChangePasswordModal';
import { useToast } from './ui/Toaster';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { user, signOut } = useAuth();
  const { addToast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <span className="text-white hidden md:inline-block">
          {user?.email}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg z-40 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100">
                <p className="text-sm text-gray-600">Conectado como</p>
                <p className="font-medium text-gray-900 truncate">{user?.email}</p>
              </div>
              
              <div className="py-2">
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-5 h-5 mr-3" />
                  Información de la cuenta
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowPasswordModal(true);
                  }}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-5 h-5 mr-3" />
                  Contraseña
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Cerrar sesión
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={() => {
          addToast('Contraseña actualizada exitosamente', 'success');
        }}
      />
    </div>
  );
}