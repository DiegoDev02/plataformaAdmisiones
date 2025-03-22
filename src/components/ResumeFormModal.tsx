import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ResumeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResume: () => void;
  savedStep: number;
  totalSteps: number;
}

export default function ResumeFormModal({
  isOpen,
  onClose,
  onResume,
  savedStep,
  totalSteps
}: ResumeFormModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#6B20FF]">
                ¡Hola de nuevo!
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-8">
              <div className="flex justify-between mb-2">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 flex-1 mx-1 rounded-full ${
                      index + 1 <= savedStep
                        ? 'bg-[#31D071]'
                        : index + 1 === savedStep + 1
                        ? 'bg-[#6B20FF]'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <div key={index} className="px-1">
                    PASO {index + 1}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-center text-lg mb-8">
              ¿Te gustaría reanudar tu proceso?
            </p>

            <div className="space-y-4">
              <button
                onClick={onResume}
                className="w-full py-3 bg-[#6B20FF] text-white rounded-lg hover:bg-[#5910FF] transition-colors"
              >
                Reanudar
              </button>
              <button
                onClick={onClose}
                className="w-full py-3 border border-[#6B20FF] text-[#6B20FF] rounded-lg hover:bg-[#6B20FF]/5 transition-colors"
              >
                No reanudar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}