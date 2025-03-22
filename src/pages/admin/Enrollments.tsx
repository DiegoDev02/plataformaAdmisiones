import { Search, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const { data, error } = await supabase
        .from('enrollment_progress')
        .select(`
          *,
          user:user_id (
            profiles (
              first_name,
              last_name,
              email
            )
          ),
          bootcamp:bootcamp_id (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEnrollments(data || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Inscripciones</h1>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nombre o email..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bootcamp
            </label>
            <select className="w-full p-2 border rounded-lg">
              <option>Todos los bootcamps</option>
              <option>Desarrollo Web</option>
              <option>Data Science</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select className="w-full p-2 border rounded-lg">
              
              <option>Todos los estados</option>
              <option>Pendiente</option>
              <option>Aprobado</option>
              <option>Rechazado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estudiante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bootcamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último acceso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progreso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enrollments.map((enrollment) => (
                <tr key={enrollment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {enrollment.user.profiles.first_name} {enrollment.user.profiles.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {enrollment.user.profiles.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {enrollment.bootcamp.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(enrollment.last_updated), 'PPp', { locale: es })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#31D071]"
                          style={{ width: `${(enrollment.current_step / 4) * 100}%` }}
                        />
                      </div>
                      <span className="ml-2 text-sm text-gray-500">
                        Paso {enrollment.current_step}/4
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      enrollment.completed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {enrollment.completed ? 'Completado' : 'En progreso'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Mostrando {enrollments.length} inscripciones
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border rounded hover:bg-gray-50" disabled>
                Anterior
              </button>
              <button className="px-3 py-1 border rounded hover:bg-gray-50" disabled>
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}