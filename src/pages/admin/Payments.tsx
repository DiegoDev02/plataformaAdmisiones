import { Download, Eye, Check, X } from 'lucide-react';

export default function AdminPayments() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Pagos</h1>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Pagos Pendientes</h3>
          <p className="text-3xl font-bold mt-2">12</p>
          <p className="text-sm text-gray-500 mt-1">Últimas 24 horas</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Pagos Confirmados</h3>
          <p className="text-3xl font-bold mt-2">45</p>
          <p className="text-sm text-gray-500 mt-1">Este mes</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Total Recaudado</h3>
          <p className="text-3xl font-bold mt-2">$1,799.55</p>
          <p className="text-sm text-gray-500 mt-1">Este mes</p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold">Pagos Recientes</h2>
            <div className="mt-3 sm:mt-0">
              <select className="px-4 py-2 border rounded-lg">
                <option>Todos los estados</option>
                <option>Pendientes</option>
                <option>Confirmados</option>
                <option>Rechazados</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estudiante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bootcamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3].map((_, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    #PAY-{1000 + index}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Carlos Ruiz
                        </div>
                        <div className="text-sm text-gray-500">
                          carlos@example.com
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Desarrollo Web Full Stack
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    $39.99
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    2024-03-15
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pendiente
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="p-1 hover:text-primary" title="Ver comprobante">
                        <Eye className="h-5 w-5" />
                      </button>
                      <button className="p-1 hover:text-primary" title="Descargar comprobante">
                        <Download className="h-5 w-5" />
                      </button>
                      <button className="p-1 hover:text-green-600" title="Aprobar pago">
                        <Check className="h-5 w-5" />
                      </button>
                      <button className="p-1 hover:text-red-600" title="Rechazar pago">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Mostrando 1-3 de 3 pagos
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