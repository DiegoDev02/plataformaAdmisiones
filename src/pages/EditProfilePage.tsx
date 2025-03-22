import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Camera, Mail, Phone, ArrowLeft } from 'lucide-react';
import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import SuccessModal from '../components/SuccessModal';
import { useEffect } from 'react';

export default function EditProfilePage() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      if (!user?.id) {
        setError('No se ha proporcionado ID de usuario');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, phone')
        .eq('id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        // Create new profile if none exists
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ 
            id: user.id,
            first_name: '',
            last_name: '',
            phone: ''
          }]);

        if (insertError) throw insertError;

        setFormData({ firstName: '', lastName: '', phone: '' });
        return;
      }

      setFormData({
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        phone: data.phone || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Error al cargar el perfil');
    }
  };
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updates = {
        id: user?.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user?.id);

      if (error) throw error;

      // Handle image upload if a new image was selected
      if (fileInputRef.current?.files?.length) {
        const file = fileInputRef.current.files[0];
        const fileExt = file.name.split('.').pop();
        const filePath = `${user?.id}/profile.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A0B2E] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/profile"
          className="inline-flex items-center text-white hover:text-gray-300 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver al perfil
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8">
          Información de la cuenta
        </h1>

        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#2D1B69] rounded-xl p-8 relative"
          >
            {error && (
              <div className="absolute top-4 right-4 bg-red-500/10 text-red-400 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="mb-8">
              <h2 className="text-white text-xl font-semibold mb-4">
                Imagen de perfil
              </h2>
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-24 h-24 bg-[#1A0B2E] rounded-full flex items-center justify-center overflow-hidden">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-white" />
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-[#6B20FF] rounded-full hover:bg-[#5910FF] transition-colors"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div className="ml-6">
                  <p className="text-gray-400 text-sm">
                    El formato debe ser JPEG o PNG y no puede superar los 10 MB
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-white mb-2">Nombre</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-[#1A0B2E] text-white rounded-lg border border-[#3D2B79] focus:border-[#6B20FF] focus:outline-none transition-colors"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Apellido</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-[#1A0B2E] text-white rounded-lg border border-[#3D2B79] focus:border-[#6B20FF] focus:outline-none transition-colors"
                  placeholder="Tu apellido"
                />
              </div>

              <div>
                <label className="block text-white mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full p-3 pl-10 bg-[#1A0B2E] text-white rounded-lg border border-[#3D2B79] opacity-50 cursor-not-allowed"
                  />
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                </div>
                <p className="text-gray-400 text-sm mt-1">
                  El correo electrónico no puede ser modificado
                </p>
              </div>

              <div>
                <label className="block text-white mb-2">
                  Número de teléfono
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 pl-10 bg-[#1A0B2E] text-white rounded-lg border border-[#3D2B79] focus:border-[#6B20FF] focus:outline-none transition-colors"
                    placeholder="Tu número de teléfono"
                  />
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-[#6B20FF] text-white rounded-lg hover:bg-[#5910FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </motion.div>
        </form>

        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            navigate('/profile');
          }}
          message="Tu perfil ha sido actualizado exitosamente"
        />
      </div>
    </div>
  );
}