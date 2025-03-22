import { BarChart3, Users, BookOpen, CreditCard } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Inscripciones',
      value: '245',
      change: '+12.5%',
      icon: Users
    },
    {
      title: 'Bootcamps Activos',
      value: '8',
      change: '+2',
      icon: BookOpen
    },
    {
      title: 'Ingresos Mensuales',
      value: '$12,450',
      change: '+18.2%',
      icon: CreditCard
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-sm text-green-600 mt-2">{stat.change} vs mes anterior</p>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Inscripciones por Bootcamp</h2>
          <select className="p-2 border rounded-lg">
            <option>Último mes</option>
            <option>Últimos 3 meses</option>
            <option>Último año</option>
          </select>
        </div>
        <div className="h-64 flex items-center justify-center text-gray-400">
          <BarChart3 className="h-8 w-8" />
          <span className="ml-2">Gráfico de inscripciones</span>
        </div>
      </div>

      {/* Recent Enrollments */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Últimas Inscripciones</h2>
        </div>
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
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3].map((_, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Juan Pérez
                        </div>
                        <div className="text-sm text-gray-500">
                          juan@example.com
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Desarrollo Web Full Stack
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    2024-03-15
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Aprobado
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}