import { useState, useEffect } from 'react';
import { getAdminStats, supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import { BarChart, DollarSign, Users, BookOpen, Database, X, CheckCircle } from 'lucide-react';

interface AdminStats {
  totalBootcamps: number;
  totalUsers: number;
  totalEnrollments: number;
  totalRevenue: number;
  enrollmentsByBootcamp: {
    bootcamp_id: string;
    bootcamp_name: string;
    total_enrollments: number;
    paid_enrollments: number;
    pending_enrollments: number;
  }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Verificar la conexión con Supabase
  useEffect(() => {
    async function checkConnection() {
      try {
        // Solo nos interesa el error, no necesitamos usar 'data'
        const { error } = await supabase.from('bootcamps').select('count').single();
        
        if (error) {
          console.error('Error de conexión con Supabase:', error);
          setConnectionStatus('error');
          setConnectionError(error.message);
          return;
        }
        
        setConnectionStatus('connected');
      } catch (err) {
        console.error('Error al verificar la conexión:', err);
        setConnectionStatus('error');
        setConnectionError(err instanceof Error ? err.message : 'Error desconocido');
      }
    }
    
    checkConnection();
  }, []);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const { data, error } = await getAdminStats();
        
        if (error) {
          setError(error);
          return;
        }
        
        setStats(data);
      } catch (err) {
        setError('Error al cargar las estadísticas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard de Administración</h1>

        {/* Estado de conexión con Supabase */}
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          connectionStatus === 'connected' ? 'bg-green-100' : 
          connectionStatus === 'error' ? 'bg-red-100' : 'bg-blue-100'
        }`}>
          <div className={`p-2 rounded-full mr-3 ${
            connectionStatus === 'connected' ? 'bg-green-200' : 
            connectionStatus === 'error' ? 'bg-red-200' : 'bg-blue-200'
          }`}>
            <Database className={`h-5 w-5 ${
              connectionStatus === 'connected' ? 'text-green-600' : 
              connectionStatus === 'error' ? 'text-red-600' : 'text-blue-600'
            }`} />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">
              {connectionStatus === 'connected' ? 'Conectado a Supabase' : 
               connectionStatus === 'error' ? 'Error de conexión con Supabase' : 'Verificando conexión...'}
            </h3>
            {connectionStatus === 'error' && connectionError && (
              <p className="text-sm text-red-700 mt-1">{connectionError}</p>
            )}
          </div>
          {connectionStatus === 'connected' && (
            <CheckCircle className="h-5 w-5 text-green-600" />
          )}
          {connectionStatus === 'error' && (
            <X className="h-5 w-5 text-red-600" />
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
            <p>{error}</p>
          </div>
        ) : stats ? (
          <>
            {/* Tarjetas de resumen */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
                <div className="p-3 bg-indigo-100 rounded-full mr-4">
                  <BookOpen className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Bootcamps</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalBootcamps}</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
                <div className="p-3 bg-green-100 rounded-full mr-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Usuarios</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
                <div className="p-3 bg-blue-100 rounded-full mr-4">
                  <BarChart className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Inscripciones</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalEnrollments}</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
                <div className="p-3 bg-amber-100 rounded-full mr-4">
                  <DollarSign className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Ingresos Totales</p>
                  <p className="text-2xl font-bold text-gray-800">${stats.totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Estadísticas por bootcamp */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4">Inscripciones por Bootcamp</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bootcamp
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Inscripciones
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pagadas
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pendientes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.enrollmentsByBootcamp.map((item) => (
                      <tr key={item.bootcamp_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.bootcamp_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.total_enrollments}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {item.paid_enrollments}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            {item.pending_enrollments}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Accesos rápidos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold mb-3">Gestión de Bootcamps</h3>
                <p className="text-gray-600 text-sm mb-4">Administra los bootcamps disponibles en la plataforma.</p>
                <a href="/admin/bootcamps" className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                  Ir a Bootcamps →
                </a>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold mb-3">Gestión de Inscripciones</h3>
                <p className="text-gray-600 text-sm mb-4">Revisa y administra las inscripciones de los estudiantes.</p>
                <a href="/admin/enrollments" className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                  Ir a Inscripciones →
                </a>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold mb-3">Gestión de Pagos</h3>
                <p className="text-gray-600 text-sm mb-4">Visualiza todos los pagos recibidos y su estado.</p>
                <a href="/admin/payments" className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                  Ir a Pagos →
                </a>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-md">
            <p>No se encontraron estadísticas disponibles.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}