import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import PhoneInput from 'react-phone-input-2';
import { Globe } from 'lucide-react';
import 'react-phone-input-2/lib/style.css';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  idDocument: FileList;
  techExperience: string;
  interestedInTechJob: string;
  isWorking: string;
  jobTitle?: string;
  careerGoals: string;
  linkedinProfile?: string;
  recommendationLetter?: FileList;
}

interface AICEnrollmentFormProps {
  onSubmit: (data: FormData) => void;
  onBack: () => void;
}

export default function AICEnrollmentForm({ onSubmit, onBack }: AICEnrollmentFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const isWorking = watch('isWorking');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-white mb-2">Nombres*</label>
          <input
            type="text"
            {...register('firstName', { required: true })}
            className="w-full p-3 bg-[#1A0B2E] text-white rounded-lg border border-[#3D2B79] focus:border-[#6B20FF] focus:outline-none"
            placeholder="Ingresa tus nombres"
          />
          {errors.firstName && (
            <span className="text-red-400 text-sm mt-1">Este campo es requerido</span>
          )}
        </div>

        <div>
          <label className="block text-white mb-2">Apellidos*</label>
          <input
            type="text"
            {...register('lastName', { required: true })}
            className="w-full p-3 bg-[#1A0B2E] text-white rounded-lg border border-[#3D2B79] focus:border-[#6B20FF] focus:outline-none"
            placeholder="Ingresa tus apellidos"
          />
          {errors.lastName && (
            <span className="text-red-400 text-sm mt-1">Este campo es requerido</span>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-white mb-2">Correo electrónico*</label>
          <input
            type="email"
            {...register('email', {
              required: true,
              pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
            })}
            className="w-full p-3 bg-[#1A0B2E] text-white rounded-lg border border-[#3D2B79] focus:border-[#6B20FF] focus:outline-none"
            placeholder="correo@ejemplo.com"
          />
          {errors.email && (
            <span className="text-red-400 text-sm mt-1">
              Ingresa un correo electrónico válido
            </span>
          )}
        </div>

        <div>
          <label className="block text-white mb-2">Número de teléfono*</label>
          <PhoneInput
            country={'sv'}
            inputStyle={{
              width: '100%',
              height: '48px',
              fontSize: '16px',
              backgroundColor: '#1A0B2E',
              border: '1px solid #3D2B79',
              borderRadius: '0.5rem',
              color: 'white',
              paddingLeft: '48px'
            }}
            buttonStyle={{
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '0.5rem 0 0 0.5rem',
              padding: '12px'
            }}
            dropdownStyle={{
              backgroundColor: '#1A0B2E',
              color: 'white'
            }}
          />
        </div>
      </div>

      {/* Location and Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-white mb-2">País*</label>
          <div className="relative">
            <select
              {...register('country', { required: true })}
              className="w-full p-3 pl-10 bg-[#1A0B2E] text-white rounded-lg border border-[#3D2B79] focus:border-[#6B20FF] focus:outline-none appearance-none"
            >
              <option value="">Selecciona tu país</option>
              <option value="SV">El Salvador</option>
            </select>
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
          {errors.country && (
            <span className="text-red-400 text-sm mt-1">Este campo es requerido</span>
          )}
        </div>

        <div>
          <label className="block text-white mb-2">Documento de identidad*</label>
          <div className="border-2 border-dashed border-[#3D2B79] rounded-lg p-3 text-center">
            <input
              type="file"
              {...register('idDocument', { required: true })}
              className="hidden"
              id="id-document"
              accept="image/*,.pdf"
            />
            <label
              htmlFor="id-document"
              className="cursor-pointer flex items-center justify-center"
            >
              <span className="text-[#6B20FF]">Seleccionar archivo</span>
            </label>
          </div>
          {errors.idDocument && (
            <span className="text-red-400 text-sm mt-1">Este campo es requerido</span>
          )}
        </div>
      </div>

      {/* Education and Experience */}
      <div>
        <label className="block text-white mb-2">¿Tienes experiencia laboral tecnológica?*</label>
        <select
          {...register('techExperience', { required: true })}
          className="w-full p-3 bg-[#1A0B2E] text-white rounded-lg border border-[#3D2B79] focus:border-[#6B20FF] focus:outline-none"
        >
          <option value="">Selecciona una opción</option>
          <option value="yes">Sí</option>
          <option value="no">No</option>
        </select>
      </div>

      <div>
        <label className="block text-white mb-2">¿Estás interesado en emplearte en el ámbito tech al graduarte del bootcamp?*</label>
        <select
          {...register('interestedInTechJob', { required: true })}
          className="w-full p-3 bg-[#1A0B2E] text-white rounded-lg border border-[#3D2B79] focus:border-[#6B20FF] focus:outline-none"
        >
          <option value="">Selecciona una opción</option>
          <option value="yes">Sí</option>
          <option value="no">No</option>
        </select>
      </div>

      <div>
        <label className="block text-white mb-2">¿Actualmente te encuentras trabajando?*</label>
        <div className="space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              {...register('isWorking', { required: true })}
              value="yes"
              className="form-radio text-[#6B20FF] bg-[#1A0B2E] border-[#3D2B79]"
            />
            <span className="ml-2 text-white">Sí</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              {...register('isWorking', { required: true })}
              value="no"
              className="form-radio text-[#6B20FF] bg-[#1A0B2E] border-[#3D2B79]"
            />
            <span className="ml-2 text-white">No</span>
          </label>
        </div>
      </div>

      {isWorking === 'yes' && (
        <div>
          <label className="block text-white mb-2">¿Qué tipo de cargo desempeñas?*</label>
          <input
            type="text"
            {...register('jobTitle', { required: isWorking === 'yes' })}
            className="w-full p-3 bg-[#1A0B2E] text-white rounded-lg border border-[#3D2B79] focus:border-[#6B20FF] focus:outline-none"
            placeholder="Ej: Desarrollador Frontend"
          />
        </div>
      )}

      <div>
        <label className="block text-white mb-2">¿Cuáles son tus metas y aspiraciones laborales a corto y largo plazo en el ámbito de la tecnología?*</label>
        <textarea
          {...register('careerGoals', { required: true })}
          className="w-full p-3 bg-[#1A0B2E] text-white rounded-lg border border-[#3D2B79] focus:border-[#6B20FF] focus:outline-none h-32"
          placeholder="Describe tus objetivos profesionales..."
        />
      </div>

      <div>
        <label className="block text-white mb-2">¿Tienes perfil de LinkedIn?</label>
        <input
          type="url"
          {...register('linkedinProfile')}
          className="w-full p-3 bg-[#1A0B2E] text-white rounded-lg border border-[#3D2B79] focus:border-[#6B20FF] focus:outline-none"
          placeholder="https://linkedin.com/in/tu-perfil"
        />
      </div>

      <div>
        <h3 className="text-white text-lg font-medium mb-4">
          Adjunta una carta de recomendación de un familiar que contenga sus datos de contacto
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Esta recomendación es opcional, pero entregarla aumenta considerablemente las probabilidades de obtener el beneficio del Acuerdo de Ingresos Compartidos.
        </p>
        <div className="border-2 border-dashed border-[#3D2B79] rounded-lg p-6 text-center">
          <input
            type="file"
            className="hidden"
            id="recommendation-letter"
            accept=".pdf,.doc,.docx"
          />
          <label
            htmlFor="recommendation-letter"
            className="cursor-pointer flex flex-col items-center"
          >
            <div className="p-3 bg-[#3D2B79] rounded-full mb-3">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <p className="text-white mb-2">Arrastra y suelta tu archivo aquí o</p>
            <span className="text-[#6B20FF]">Selecciona un archivo</span>
            <p className="text-gray-400 text-sm mt-2">PDF o Word (máx. 5MB)</p>
          </label>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 text-white border border-[#3D2B79] rounded-lg hover:bg-[#3D2B79]/50 transition-colors"
        >
          Atrás
        </button>
        <button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          className="px-6 py-2 bg-[#6B20FF] text-white rounded-lg hover:bg-[#5910FF] transition-colors"
        >
          Continuar
        </button>
      </div>
    </motion.div>
  );
}