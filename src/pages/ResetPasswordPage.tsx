import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion'; 
import { Eye, EyeOff, ThumbsUp, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

export default function ResetPasswordPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const password = watch('password', '');

  const checkPasswordStrength = (value: string) => {
    let strength = 0;
    if (value.length >= 8) strength += 1;
    if (/[A-Z]/.test(value)) strength += 1;
    if (/[0-9]/.test(value)) strength += 1;
    if (/[^A-Za-z0-9]/.test(value)) strength += 1;
    setPasswordStrength(strength);
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-green-400';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getStrengthText = () => {
    switch (passwordStrength) {
      case 1: return 'Débil';
      case 2: return 'Regular';
      case 3: return 'Buena';
      case 4: return 'Fuerte';
      default: return 'Muy débil';
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setLoading(true);

    try {
      // First check if the email exists
      const { data: users, error: userError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (userError) throw userError;

      if (!users) {
        setEmailError('No existe una cuenta con este correo electrónico');
        return;
      }

      // Send password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setStep('reset');
    } catch (error) {
      console.error('Error:', error);
      setEmailError('Error al enviar el correo de recuperación');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      // Here you would call your password reset API
      console.log('Password reset data:', data);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6A13FF] to-[#00FFF0] flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className="bg-white rounded-3xl p-8 shadow-xl"
        >
          <div className="flex justify-center mb-8">
            <img src="/kodigo-logo.svg" alt="Kodigo" className="h-8" />
          </div>
          <h1 className="text-3xl font-bold text-[#6B20FF] mb-2 text-center">
            {step === 'email' ? 'Recuperar contraseña' : 'Reestablecer contraseña'}
          </h1>
          <p className="text-gray-500 text-center mb-8">
            {step === 'email' 
              ? 'Ingresa tu correo electrónico para recuperar tu cuenta'
              : 'Revisa tu correo y sigue las instrucciones para reestablecer tu contraseña'
            }
          </p>

          {step === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Correo electrónico"
                  className="w-full p-4 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#6B20FF]/20 transition-all pl-12"
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>

              {emailError && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                  {emailError}
                </div>
              )}

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-[#6B20FF] text-white rounded-xl py-4 font-medium hover:bg-[#5910FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    'Enviando...'
                  ) : (
                    <>
                      Continuar
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>

                <Link
                  to="/login"
                  className="block text-center text-[#6B20FF] hover:text-[#5910FF] transition-colors"
                >
                  Volver a iniciar sesión
                </Link>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="bg-blue-50 text-blue-600 p-4 rounded-lg mb-6">
                <p>Se ha enviado un correo a <strong>{email}</strong> con las instrucciones para reestablecer tu contraseña.</p>
              </div>
              <div className="flex justify-center">
                <Link
                  to="/login"
                  className="inline-flex items-center text-[#6B20FF] hover:text-[#5910FF] transition-colors"
                >
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Volver a iniciar sesión
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full text-center mx-4"
            >
              <div className="mb-6 text-[#31D071]">
                <ThumbsUp className="h-16 w-16 mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-[#6B20FF] mb-4">
                ¡Correo enviado!
              </h2>
              <p className="text-gray-600 mb-8">
                Revisa tu correo electrónico y sigue las instrucciones para reestablecer tu contraseña.
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="bg-[#6B20FF] text-white px-8 py-3 rounded-xl hover:bg-[#5910FF] transition-colors"
              >
                Entendido
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}