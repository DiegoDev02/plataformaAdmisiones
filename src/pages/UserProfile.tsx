import { motion } from 'framer-motion';
import { BookOpen, Clock, Calendar, CheckCircle, Shield, BadgeCheck, User, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import ChangePasswordModal from '../components/ChangePasswordModal';
import { useToast } from '../components/ui/Toaster';

export default function UserProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const isVerified = true; // This should come from your user data
  const userRole = user?.role || 'student'; // This should come from your user data
  const enrollments = [
    {
      id: 1,
      bootcamp: 'Full Stack Developer',
      status: 'En proceso',
      startDate: '15 Mar 2024',
      duration: '12 semanas',
      progress: 0,
      color: 'bg-blue-500'
    }
  ];

  return (
    <div className="min-h-screen bg-[#1A0B2E] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="bg-[#2D1B69] rounded-xl p-8 mb-12"
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-[#1A0B2E] rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  Juan Antonio
                  {user?.email_confirmed_at && (
                    <BadgeCheck className="w-6 h-6 text-[#31D071]" />
                  )}
                </h1>
                <div className="flex items-center mt-2 space-x-2">
                  <Shield className="w-4 h-4 text-[#FA04FF]" />
                  <span className="text-[#FA04FF] font-medium">
                    {user?.role === 'admin' ? 'Staff' : 'Estudiante'}
                  </span>
                </div>
                <p className="text-gray-400 mt-1">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center px-4 py-2 bg-[#1A0B2E] text-white rounded-lg hover:bg-[#2A1B4E] transition-colors"
              >
                <Lock className="w-4 h-4 mr-2" />
                Cambiar contraseña
              </button>
              <button 
                onClick={() => navigate('/profile/edit')}
                className="px-4 py-2 bg-[#1A0B2E] text-white rounded-lg hover:bg-[#2A1B4E] transition-colors"
              >
                Editar perfil
              </button>
            </div>
          </div>
        </motion.div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Bootcamps Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#2D1B69] rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-6">
              Tus Bootcamps
            </h2>
            
            <div className="space-y-6">
              {enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="bg-[#1A0B2E] rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white font-medium">
                        {enrollment.bootcamp}
                      </h3>
                      <span className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-300 text-sm rounded-full mt-2">
                        {enrollment.status}
                      </span>
                    </div>
                    <div className={`${enrollment.color} p-3 rounded-lg`}>
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-400">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span>Inicio: {enrollment.startDate}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Clock className="h-5 w-5 mr-2" />
                      <span>Duración: {enrollment.duration}</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                      <span>Progreso</span>
                      <span>{enrollment.progress}%</span>
                    </div>
                    <div className="h-2 bg-[#2D1B69] rounded-full">
                      <div
                        className="h-full bg-gradient-to-r from-[#6B20FF] to-[#FA04FF] rounded-full"
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Forms Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#2D1B69] rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-6">
              Formularios Enviados
            </h2>
            
            <div className="space-y-4">
              <div className="bg-[#1A0B2E] rounded-lg p-4 flex items-center">
                <div className="h-10 w-10 bg-green-500/20 rounded-lg flex items-center justify-center mr-4">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Inscripción Full Stack Developer</h3>
                  <p className="text-gray-400 text-sm">Enviado el 15 Mar 2024</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
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