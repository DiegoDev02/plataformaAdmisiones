import { useEffect, useState } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToasterProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export function Toaster({ position = 'bottom-right' }: ToasterProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setToasts((currentToasts) => currentToasts.slice(1));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  const typeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <div
      className={`fixed z-50 flex flex-col gap-2 ${positionClasses[position]}`}
      role="alert"
      aria-live="assertive"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${typeClasses[toast.type]} text-white px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const newToast: Toast = {
      id: Math.random().toString(36).substring(7),
      message,
      type,
    };
    setToasts((current) => [...current, newToast]);
  };

  return { addToast };
}