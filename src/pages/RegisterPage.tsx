import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Globe } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useToast } from '../components/ui/Toaster';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { addToast } = useToast();

  const onSubmit = async (data: any) => {
    if (step === 1) {
      setStep(2);
      return;
    }

    try {
      setIsLoading(true);
      setLoginError('');
      await signUp({
        email: data.email,
        password: data.password,
        phone,
        country,
        firstName: data.firstName,
        lastName: data.lastName
      });
      navigate('/profile');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al registrarse';
      setLoginError(errorMessage);
      addToast('Error al registrarse', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Animated Background */}
      <div 
        className="relative hidden lg:flex flex-col justify-between p-12"
        style={{
          background: 'linear-gradient(135deg, #6B20FF 0%, #00FFF0 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite'
        }}
      >
        <div>
          <img src="/kodigo-logo.svg" alt="Kodigo" className="h-8" />
        </div>
        <div className="space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-7xl font-bold text-white"
          >
            ¡Hey!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl text-white/90"
          >
            Inicia tu carrera<br />con nosotros
          </motion.p>
        </div>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-cyan-400 border border-cyan-400 rounded-full px-8 py-3 w-fit hover:bg-cyan-400/10 transition-colors"
        >
          sign up
        </motion.button>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-8 bg-[#6B20FF]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white rounded-3xl p-8"
        >
          {/* Progress Indicator at the top */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <div className={`h-1 flex-1 rounded-full mx-1 ${
                step >= 1 ? 'bg-[#6B20FF]' : 'bg-gray-200'
              }`} />
              <div className={`h-1 flex-1 rounded-full mx-1 ${
                step >= 2 ? 'bg-[#6B20FF]' : 'bg-gray-200'
              }`} />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Información básica</span>
              <span>Seguridad y contacto</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-[#6B20FF] mb-8">Regístrate</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 ? (
              <>
                <div>
                  <input
                    type="text" 
                    placeholder="Nombre"
                    {...register('firstName', { required: true })}
                    className={`w-full p-4 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#6B20FF]/20 transition-all ${
                      errors.firstName ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.firstName && (
                    <span className="text-red-500 text-sm mt-1">Este campo es requerido</span>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Apellido"
                    {...register('lastName', { required: true })}
                    className={`w-full p-4 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#6B20FF]/20 transition-all ${
                      errors.lastName ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.lastName && (
                    <span className="text-red-500 text-sm mt-1">Este campo es requerido</span>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Correo"
                    {...register('email', {
                      required: true,
                      pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                    })}
                    className={`w-full p-4 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#6B20FF]/20 transition-all ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.email && (
                    <span className="text-red-500 text-sm mt-1">
                      Ingresa un correo electrónico válido
                    </span>
                  )}
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-gray-600 mb-2">Contraseña</label>
                  <input
                    type="password"
                    placeholder="Contraseña"
                    {...register('password', { required: true, minLength: 6 })}
                    className={`w-full p-4 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#6B20FF]/20 transition-all ${
                      errors.password ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.password && (
                    <span className="text-red-500 text-sm mt-1">
                      La contraseña debe tener al menos 6 caracteres
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-gray-600 mb-2">Confirmar contraseña</label>
                  <input
                    type="password"
                    placeholder="Confirmar contraseña"
                    {...register('confirmPassword', {
                      required: true,
                      validate: value => value === watch('password') || 'Las contraseñas no coinciden'
                    })}
                    className={`w-full p-4 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#6B20FF]/20 transition-all ${
                      errors.confirmPassword ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.confirmPassword && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword.message as string}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-gray-600 mb-2">País</label>
                  <div className="relative">
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full p-4 pl-12 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#6B20FF]/20 transition-all appearance-none"
                    >
                      <option value="">Selecciona tu país</option>
                      <option value="SV">El Salvador</option>
                      <option value="GT">Guatemala</option>
                      <option value="HN">Honduras</option>
                      <option value="NI">Nicaragua</option>
                      <option value="CR">Costa Rica</option>
                      <option value="PA">Panamá</option>
                    </select>
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-600 mb-2">Número de teléfono</label>
                  <PhoneInput
                    country={country.toLowerCase() || 'sv'}
                    value={phone}
                    onChange={(phone, data: any) => {
                      setPhone(phone);
                      setCountry(data.countryCode.toUpperCase());
                    }}
                    inputStyle={{
                      width: '100%',
                      height: '50px',
                      fontSize: '16px',
                      backgroundColor: '#f3f4f6',
                      border: 'none',
                      borderRadius: '12px',
                      paddingLeft: '48px'
                    }}
                    buttonStyle={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '12px 0 0 12px',
                      padding: '12px'
                    }}
                  />
                </div>
              </>
            )}

            {loginError && (
              <div className="bg-red-500/20 text-red-300 p-3 rounded-lg text-sm mb-6">
                {loginError}
              </div>
            )}

            <div className="flex justify-between items-center mt-8">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center text-[#6B20FF] hover:text-[#5910FF]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Anterior
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className={`flex items-center justify-center ${
                  step === 1 ? 'w-full' : 'px-8'
                } bg-[#6B20FF] text-white rounded-xl py-4 font-medium hover:bg-[#5910FF] transition-colors disabled:opacity-50`}
              >
                {isLoading ? 'Cargando...' : (
                  <>
                    {step === 1 ? 'Continuar' : 'Registrarse'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}