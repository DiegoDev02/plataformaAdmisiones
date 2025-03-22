import { useState, useEffect } from 'react';
import { getPayments, getEnrollments, getBootcamps, getProfiles } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';

interface Payment {
  id: string;
  enrollment_id: string;
  amount: number;
  status: string;
  payment_method: string | null;
  transaction_id: string | null;
  payment_date: string | null;
  created_at: string;
  updated_at: string;
}

interface Enrollment {
  id: string;
  user_id: string;
  bootcamp_id: string;
}

interface Bootcamp {
  id: string;
  name: string;
}

interface Profile {
  id: string;
  email: string;
  full_name: string;
}

export default function PaymentsAdminPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [enrollments, setEnrollments] = useState<Record<string, Enrollment>>({});
  const [bootcamps, setBootcamps] = useState<Record<string, Bootcamp>>({});
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Cargar pagos, inscripciones, bootcamps y perfiles en paralelo
        const [paymentsRes, enrollmentsRes, bootcampsRes, profilesRes] = await Promise.all([
          getPayments(),
          getEnrollments(),
          getBootcamps(),
          getProfiles()
        ]);
        
        if (paymentsRes.error) {
          setError(paymentsRes.error);
          return;
        }
        
        // Crear mapas para búsqueda rápida por ID
        const enrollmentsMap: Record<string, Enrollment> = {};
        if (enrollmentsRes.data) {
          enrollmentsRes.data.forEach((enrollment: Enrollment) => {
            enrollmentsMap[enrollment.id] = enrollment;
          });
        }
        
        const bootcampsMap: Record<string, Bootcamp> = {};
        if (bootcampsRes.data) {
          bootcampsRes.data.forEach((bootcamp: Bootcamp) => {
            bootcampsMap[bootcamp.id] = bootcamp;
          });
        }
        
        const profilesMap: Record<string, Profile> = {};
        if (profilesRes.data) {
          profilesRes.data.forEach((profile: Profile) => {
            profilesMap[profile.id] = profile;
          });
        }
        
        setPayments(paymentsRes.data || []);
        setEnrollments(enrollmentsMap);
        setBootcamps(bootcampsMap);
        setProfiles(profilesMap);
      } catch (err) {
        setError('Error al cargar los datos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Función para renderizar el badge del estado del pago
  const renderPaymentStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-purple-100 text-purple-800'
    };
    
    const statusClass = (statusClasses as any)[status] || 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Función para renderizar el método de pago
  const renderPaymentMethod = (method: string | null) => {
    if (!method) return 'No especificado';
    
    const methodDisplayNames: Record<string, string> = {
      credit_card: 'Tarjeta de Crédito',
      debit_card: 'Tarjeta de Débito',
      paypal: 'PayPal',
      transfer: 'Transferencia Bancaria'
    };
    
    return methodDisplayNames[method] || method;
  };

  // Función para obtener información del estudiante a través de la inscripción
  const getStudentInfo = (payment: Payment) => {
    const enrollment = enrollments[payment.enrollment_id];
    if (!enrollment) return { name: 'Usuario desconocido', email: 'Email no disponible' };
    
    const profile = profiles[enrollment.user_id];
    if (!profile) return { name: 'Usuario desconocido', email: 'Email no disponible' };
    
    return { name: profile.full_name, email: profile.email };
  };

  // Función para obtener el nombre del bootcamp a través de la inscripción
  const getBootcampName = (payment: Payment) => {
    const enrollment = enrollments[payment.enrollment_id];
    if (!enrollment) return 'Bootcamp desconocido';
    
    const bootcamp = bootcamps[enrollment.bootcamp_id];
    if (!bootcamp) return 'Bootcamp desconocido';
    
    return bootcamp.name;
  };

  // Función para formatear fecha
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Pendiente';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Pagos</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
            <p>{error}</p>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID de Transacción
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiante
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bootcamp
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Método de Pago
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => {
                  const student = getStudentInfo(payment);
                  return (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {payment.transaction_id || 'Pendiente'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {getBootcampName(payment)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          ${payment.amount.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {renderPaymentMethod(payment.payment_method)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderPaymentStatusBadge(payment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(payment.payment_date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">Detalles</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {payments.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                      No hay pagos registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}