import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function AdminBootcamps() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Bootcamps</h1>
        <button className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Bootcamp
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold">Bootcamps</h2>
            <div className="mt-3 sm:mt-0">
              <input
                type="text"
                placeholder="Buscar bootcamp..."
                className="px-4 py-2 border rounded-lg w-full sm:w-auto"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duración
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded bg-gray-200" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Desarrollo Web Full Stack
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Web
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    12 semanas
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    $39.99
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Activo
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="p-1 hover:text-primary">
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button className="p-1 hover:text-red-600">
                        <Trash2 className="h-5 w-5" />
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
              Mostrando 1-3 de 3 bootcamps
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