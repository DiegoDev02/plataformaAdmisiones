import { useState, useEffect } from 'react';
import { getEnrollments, getBootcamps, getProfiles } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';

interface Enrollment {
  id: string;
  user_id: string;
  bootcamp_id: string;
  status: string;
  payment_status: string;
  technical_test_status: string;
  enrollment_date: string;
  completion_date: string | null;
  created_at: string;
  updated_at: string;
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

export default function EnrollmentsAdminPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [bootcamps, setBootcamps] = useState<Record<string, Bootcamp>>({});
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Cargar inscripciones, bootcamps y perfiles en paralelo
        const [enrollmentsRes, bootcampsRes, profilesRes] = await Promise.all([
          getEnrollments(),
          getBootcamps(),
          getProfiles()
        ]);
        
        if (enrollmentsRes.error) {
          setError(enrollmentsRes.error);
          return;
        }
        
        // Crear mapas para búsqueda rápida por ID
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
        
        setEnrollments(enrollmentsRes.data || []);
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

  // Función para renderizar el badge del estado de la inscripción
  const renderStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    const statusClass = (statusClasses as any)[status] || 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Función para renderizar el badge del estado de pago
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

  // Función para renderizar el badge del estado de prueba técnica
  const renderTestStatusBadge = (status: string) => {
    const statusClasses = {
      not_submitted: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    const statusClass = (statusClasses as any)[status] || 'bg-gray-100 text-gray-800';
    const displayStatus = status.replace('_', ' ');
    
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
        {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Inscripciones</h1>
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
                    Estudiante
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bootcamp
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pago
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prueba Técnica
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
                {enrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {profiles[enrollment.user_id]?.full_name || 'Usuario desconocido'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {profiles[enrollment.user_id]?.email || 'Email no disponible'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {bootcamps[enrollment.bootcamp_id]?.name || 'Bootcamp desconocido'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStatusBadge(enrollment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderPaymentStatusBadge(enrollment.payment_status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderTestStatusBadge(enrollment.technical_test_status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(enrollment.enrollment_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900">Editar</button>
                        <button className="text-red-600 hover:text-red-900">Cancelar</button>
                      </div>
                    </td>
                  </tr>
                ))}

                {enrollments.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      No hay inscripciones registradas
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