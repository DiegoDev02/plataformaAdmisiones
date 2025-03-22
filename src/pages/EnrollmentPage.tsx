import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UploadCloud as CloudUpload } from 'lucide-react';
import SuccessModal from '../components/SuccessModal';
import UpfrontEnrollmentForm from '../components/enrollment/UpfrontEnrollmentForm';
import AICEnrollmentForm from '../components/enrollment/AICEnrollmentForm';

const downloadCSV = (data: any[], filename: string) => {
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

interface GroupMember {
  id: string;
  fullName: string;
  position: string;
  email: string;
  phone: string;
  document: File | null;
}

export default function EnrollmentPage() {
  const { bootcampId } = useParams();
  const [step, setStep] = useState(1);
  const { register, handleSubmit, watch } = useForm();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'processing' | 'success'>('processing');
  const [formData, setFormData] = useState<any>(null);

  const paymentType = watch('paymentType', 'individual');

  const handleSaveInformation = () => {
    if (paymentType === 'group') {
      const csvData = groupMembers.map(member => ({
        'Nombre Completo': member.fullName,
        'Cargo': member.position,
        'Correo': member.email,
        'Teléfono': member.phone,
        'Documento': member.document ? member.document.name : ''
      }));
      downloadCSV(csvData, 'inscripcion-grupal.csv');
    } else {
      const formValues = watch();
      const csvData = [{
        'Nombre': formValues.firstName,
        'Apellido': formValues.lastName,
        'Género': formValues.gender,
        'Fecha de Nacimiento': formValues.birthDate,
        'Documento': formValues.documentId,
        'Nivel Educativo': formValues.educationLevel,
        'Última Carrera': formValues.lastDegree,
        'Trabajando': formValues.isWorking,
        'Referencia': formValues.referralSource,
        'Por qué Kodigo': formValues.whyKodigo
      }];
      downloadCSV(csvData, 'inscripcion-individual.csv');
    }
    setFormData(watch());
  };

  const onSubmit = (data: any) => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setModalType('processing');
      setShowModal(true);
      
      // Simulate API call
      setTimeout(() => {
        setModalType('success');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E0A2E] font-['Montserrat']">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Proceso de Admisión</h1>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className={`h-1 rounded-full ${
              step >= 1 
                ? 'bg-gradient-to-r from-[#6B20FF] via-[#FA04FF] to-[#6B20FF] bg-[length:200%_200%] animate-[progressGradient_3s_ease-in-out_infinite]' 
                : 'bg-gray-600'
            }`} />
            <div className={`h-1 rounded-full ${
              step >= 2 
                ? 'bg-gradient-to-r from-[#6B20FF] via-[#FA04FF] to-[#6B20FF] bg-[length:200%_200%] animate-[progressGradient_3s_ease-in-out_infinite]' 
                : 'bg-gray-600'
            }`} />
            <div className={`h-1 rounded-full ${
              step === 3 
                ? 'bg-gradient-to-r from-[#6B20FF] via-[#FA04FF] to-[#6B20FF] bg-[length:200%_200%] animate-[progressGradient_3s_ease-in-out_infinite]' 
                : 'bg-gray-600'
            }`} />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-white">Paso 1</p>
                {step > 1 && (
                  <svg className="w-4 h-4 text-[#31D071]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className={`text-white font-medium ${step >= 1 ? 'opacity-100' : 'opacity-50'}`}>
                Método de pago
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-white">Paso 2</p>
                {step > 2 && (
                  <svg className="w-4 h-4 text-[#31D071]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className={`text-white font-medium ${step >= 2 ? 'opacity-100' : 'opacity-50'}`}>
                Acerca de ti
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-white">Paso 3</p>
                {step > 3 && (
                  <svg className="w-4 h-4 text-[#31D071]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className={`text-white font-medium ${step === 3 ? 'opacity-100' : 'opacity-50'}`}>
                Completar inscripción
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#2D1B69] rounded-lg p-8 lg:p-12">
          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
              <div>
                <h2 className="text-xl text-white mb-6">Elige tu alternativa de pago</h2>
                <div className="space-y-6">
                  <label className="block p-6 border border-[#7127BA] rounded-lg cursor-pointer hover:border-[#9747FF] bg-[#1A0B2E]">
                    <input
                      type="radio"
                      value="individual"
                      {...register('paymentType')}
                      className="mr-3 accent-[#7127BA]"
                    />
                    <span className="text-white">Pago individual</span>
                    <p className="text-gray-400 text-sm mt-1">
                      Realiza el pago completo de $39.99 USD
                    </p>
                  </label>
                  <label className="block p-6 border border-[#7127BA] rounded-lg cursor-pointer hover:border-[#9747FF] bg-[#1A0B2E]">
                    <input
                      type="radio"
                      value="group"
                      {...register('paymentType')}
                      className="mr-3 accent-[#7127BA]"
                    />
                    <span className="text-white">Pago grupal</span>
                    <p className="text-gray-400 text-sm mt-1">
                      Recibe un increíble descuento del 10% off por usuario, aplica para grupos mayores de 10 personas
                    </p>
                  </label>
                </div>

                <p className="text-sm text-gray-400 mt-4">*Opciones de pago sujetas a cambio</p>

                {paymentType === 'group' && (
                  <div className="mt-6">
                    <p className="text-white mb-4">
                      Si deseas inscribirte con un grupo de MÁS de 10 personas comunícate con nuestros asesores
                    </p>
                    <button
                      type="button"
                      className="px-6 py-2 bg-[#2D1B69] text-white rounded-lg border border-[#7127BA] hover:bg-[#3D2B79]"
                    >
                      Escríbenos en WhatsApp
                    </button>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <>
                {paymentType === 'upfront' && (
                  <UpfrontEnrollmentForm
                    onSubmit={handleSubmit(onSubmit)}
                    onBack={() => setStep(step - 1)}
                  />
                )}
                {paymentType === 'aic' && (
                  <AICEnrollmentForm
                    onSubmit={handleSubmit(onSubmit)}
                    onBack={() => setStep(step - 1)}
                  />
                )}
              </>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-xl text-white mb-6">Completar inscripción</h2>
                <div className="flex flex-col items-center space-y-8">
                  <div className="w-full max-w-md">
                    <button
                      type="button"
                      className="w-full py-3 bg-[#31D071] text-white rounded-lg hover:bg-[#2BB562] transition-colors"
                    >
                      Realizar tu pago
                    </button>
                  </div>

                  <div className="w-full max-w-md">
                    <p className="text-white mb-4">Comprobante de pago*</p>
                    <div className="border-2 border-dashed border-[#7127BA] rounded-lg p-8 text-center">
                      <CloudUpload className="h-12 w-12 text-[#7127BA] mx-auto mb-4" />
                      <p className="text-gray-300 mb-4">
                        Selecciona o arrastra aquí para subir tu archivo
                      </p>
                      <input
                        type="file"
                        {...register('paymentProof')}
                        className="hidden"
                        id="payment-proof"
                        accept="image/*,.pdf"
                      />
                      <label
                        htmlFor="payment-proof"
                        className="px-6 py-2 bg-[#2D1B69] text-white rounded-lg border border-[#7127BA] hover:bg-[#3D2B79] cursor-pointer inline-block"
                      >
                        Subir archivo
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step !== 2 && (
              <div className="flex justify-between mt-8">
                {step > 1 && step !== 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-2 border border-[#7127BA] text-white rounded-lg hover:bg-[#2D1B69]"
                  >
                    Anterior
                  </button>
                )}
                <button
                  type="submit"
                  className={`px-6 py-2 ${
                    step === 3 ? 'bg-[#31D071] hover:bg-[#2BB562]' : 'bg-[#7127BA] hover:bg-[#9747FF]'
                  } text-white rounded-lg ml-auto`}
                >
                  {step === 3 ? 'Finalizar' : 'Siguiente'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type={modalType}
      />
    </div>
  );
}