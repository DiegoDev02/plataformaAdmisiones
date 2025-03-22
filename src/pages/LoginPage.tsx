import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toaster';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const { addToast } = useToast();
  const from = location.state?.from?.pathname || '/profile';

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      setLoginError('');
      await signIn(data.email, data.password);
      navigate(from, { replace: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
      setLoginError(errorMessage);
      addToast('Error al iniciar sesión', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="bg-[#6B20FF] p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-5xl font-bold text-[#00FFF0] mb-4">
            Iniciar sesión
          </h1>
          <p className="text-white/80 mb-12">
            Ingresa tu información para iniciar sesión
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-white mb-2">Nombre de usuario</label>
              <input
                type="email"
                {...register('email', { required: true })}
                className="w-full p-4 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:border-[#00FFF0] transition-colors"
                placeholder="correo@ejemplo.com"
                autoComplete="email"
              />
              {errors.email && (
                <span className="text-red-300 text-sm mt-1 block">
                  El correo es requerido
                </span>
              )}
            </div>

            <div>
              <label className="block text-white mb-2">Contraseña</label>
              <input
                type="password"
                {...register('password', { required: true })}
                className="w-full p-4 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:border-[#00FFF0] transition-colors"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {errors.password && (
                <span className="text-red-300 text-sm mt-1 block">
                  La contraseña es requerida
                </span>
              )}
            </div>

            {loginError && (
              <div className="bg-red-500/20 text-red-300 p-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-white/10 text-[#00FFF0] focus:ring-[#00FFF0]"
                />
                <span className="ml-2 text-white">Recuérdame</span>
              </label>

              <Link
                to="/reset-password"
                className="text-[#00FFF0] hover:text-[#00FFF0]/80 transition-colors"
              >
                Olvidé mi contraseña
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1A0A33] text-white rounded-lg py-4 font-medium hover:bg-[#1A0A33]/80 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Cargando...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>

      {/* Right Side - Welcome Message */}
      <div 
        className="hidden lg:flex flex-col items-center justify-center p-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #6B20FF 0%, #00FFF0 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite'
        }}
      >
        <img src="/kodigo-logo.svg" alt="Kodigo" className="h-8 mb-12" />
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-6xl font-bold text-white mb-8"
        >
          ¡Bienvenido!
        </motion.h2>

        <div className="text-center">
          <p className="text-white/80 mb-2">¿Aún no tienes una cuenta?</p>
          <Link
            to="/register"
            className="text-[#6B20FF] font-medium hover:text-[#6B20FF] transition-all relative group"
          >
            <span className="relative z-10">crear cuenta</span>
            <span className="absolute inset-0 bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur-lg bg-[#6B20FF]" />
          </Link>
        </div>
      </div>
    </div>
  );
}