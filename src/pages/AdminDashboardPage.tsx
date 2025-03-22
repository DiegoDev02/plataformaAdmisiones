import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { Users, BookOpen, CreditCard, BarChart2, Plus, Settings, Edit } from 'lucide-react';

interface DashboardStat {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

interface BootcampStat {
  bootcamp_id: string;
  bootcamp_name: string;
  total_enrollments: number;
  paid_enrollments: number;
  pending_enrollments: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [bootcampStats, setBootcampStats] = useState<BootcampStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtenemos estadísticas generales
      const [userCountResponse, bootcampCountResponse, enrollmentCountResponse, paymentResponse] = 
        await Promise.all([
          // Conteo de usuarios
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          
          // Conteo de bootcamps
          supabase.from('bootcamps').select('id', { count: 'exact', head: true }),
          
          // Conteo de inscripciones
          supabase.from('enrollments').select('id', { count: 'exact', head: true }),
          
          // Pagos completados
          supabase.from('payments').select('amount').eq('status', 'completed')
        ]);

      // Obtenemos estadísticas por bootcamp
      const bootcampStatsResponse = await supabase.rpc('get_enrollment_stats');

      // Verificamos errores
      if (userCountResponse.error) {
        console.error('Error al obtener conteo de usuarios:', userCountResponse.error);
        setError(userCountResponse.error.message);
        return;
      }

      if (bootcampCountResponse.error) {
        console.error('Error al obtener conteo de bootcamps:', bootcampCountResponse.error);
        setError(bootcampCountResponse.error.message);
        return;
      }

      if (enrollmentCountResponse.error) {
        console.error('Error al obtener conteo de inscripciones:', enrollmentCountResponse.error);
        setError(enrollmentCountResponse.error.message);
        return;
      }

      if (paymentResponse.error) {
        console.error('Error al obtener pagos:', paymentResponse.error);
        setError(paymentResponse.error.message);
        return;
      }

      if (bootcampStatsResponse.error) {
        console.error('Error al obtener estadísticas de bootcamps:', bootcampStatsResponse.error);
        setError(bootcampStatsResponse.error.message);
        return;
      }

      // Calculamos el total de pagos
      const totalRevenue = paymentResponse.data?.reduce((sum, payment) => 
        sum + (typeof payment.amount === 'number' ? payment.amount : 0), 0) || 0;

      // Formateamos las estadísticas principales
      setStats([
        {
          title: 'Usuarios',
          value: userCountResponse.count || 0,
          icon: <Users className="w-8 h-8" />,
          color: 'bg-blue-500/20 text-blue-400'
        },
        {
          title: 'Bootcamps',
          value: bootcampCountResponse.count || 0,
          icon: <BookOpen className="w-8 h-8" />,
          color: 'bg-purple-500/20 text-purple-400'
        },
        {
          title: 'Inscripciones',
          value: enrollmentCountResponse.count || 0,
          icon: <BarChart2 className="w-8 h-8" />,
          color: 'bg-green-500/20 text-green-400'
        },
        {
          title: 'Ingresos',
          value: `$${totalRevenue.toLocaleString()}`,
          icon: <CreditCard className="w-8 h-8" />,
          color: 'bg-yellow-500/20 text-yellow-400'
        }
      ]);

      // Establecemos las estadísticas por bootcamp
      setBootcampStats(bootcampStatsResponse.data || []);
    } catch (err) {
      console.error('Error inesperado al cargar datos:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A0B2E] text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
            Panel de Administración
          </h1>
          <Link 
            to="/admin/settings" 
            className="flex items-center p-2 rounded-lg bg-[#2D1B69]/50 hover:bg-[#2D1B69]/80 transition-colors text-sm"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configuración
          </Link>
        </header>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 text-red-300">
            <p className="font-medium">Error al cargar datos del dashboard</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-400"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="bg-[#2D1B69] rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-300 text-sm mb-1">{stat.title}</p>
                      <p className="text-white text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bootcamp Stats */}
            <div className="bg-[#2D1B69] rounded-xl p-6 shadow-lg mb-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Estadísticas por Bootcamp</h2>
                <Link 
                  to="/admin/bootcamps/new" 
                  className="flex items-center p-2 rounded-lg bg-[#8A42DB]/70 hover:bg-[#8A42DB] transition-colors text-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Bootcamp
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-indigo-800">
                      <th className="py-3 px-4 text-indigo-300">Bootcamp</th>
                      <th className="py-3 px-4 text-indigo-300">Total Inscripciones</th>
                      <th className="py-3 px-4 text-indigo-300">Pagadas</th>
                      <th className="py-3 px-4 text-indigo-300">Pendientes</th>
                      <th className="py-3 px-4 text-indigo-300">Conversión</th>
                      <th className="py-3 px-4 text-indigo-300">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bootcampStats.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-gray-400">
                          No hay datos de bootcamps disponibles
                        </td>
                      </tr>
                    ) : (
                      bootcampStats.map((stat) => (
                        <tr key={stat.bootcamp_id} className="border-b border-indigo-800/30 hover:bg-indigo-800/20">
                          <td className="py-3 px-4">{stat.bootcamp_name}</td>
                          <td className="py-3 px-4">{stat.total_enrollments}</td>
                          <td className="py-3 px-4 text-green-400">{stat.paid_enrollments}</td>
                          <td className="py-3 px-4 text-yellow-400">{stat.pending_enrollments}</td>
                          <td className="py-3 px-4">
                            {stat.total_enrollments ? 
                              `${Math.round((stat.paid_enrollments / stat.total_enrollments) * 100)}%` : 
                              '0%'
                            }
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-3">
                              <Link 
                                to={`/admin/bootcamps/${stat.bootcamp_id}`} 
                                className="text-indigo-400 hover:text-indigo-300"
                                title="Ver detalles"
                              >
                                <Edit className="w-5 h-5" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-[#2D1B69] rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link 
                  to="/admin/bootcamps"
                  className="flex items-center p-4 rounded-lg bg-indigo-900/50 hover:bg-indigo-800/50 transition"
                >
                  <BookOpen className="w-5 h-5 mr-2 text-indigo-400" />
                  <span>Gestionar Bootcamps</span>
                </Link>
                
                <Link 
                  to="/admin/users"
                  className="flex items-center p-4 rounded-lg bg-indigo-900/50 hover:bg-indigo-800/50 transition"
                >
                  <Users className="w-5 h-5 mr-2 text-indigo-400" />
                  <span>Gestionar Usuarios</span>
                </Link>
                
                <Link 
                  to="/admin/enrollments"
                  className="flex items-center p-4 rounded-lg bg-indigo-900/50 hover:bg-indigo-800/50 transition"
                >
                  <BarChart2 className="w-5 h-5 mr-2 text-indigo-400" />
                  <span>Gestionar Inscripciones</span>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
