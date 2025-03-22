import { useState, useEffect } from 'react';
import { getBootcamps, supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Edit, Trash2, CheckCircle, XCircle, Database } from 'lucide-react';

interface Bootcamp {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration_weeks: number;
  difficulty_level: string;
  cover_image_url: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

// Tipo para formulario de bootcamp
interface BootcampForm {
  name: string;
  description: string;
  category: string;
  price: number;
  duration_weeks: number;
  difficulty_level: string;
  cover_image_url: string;
  featured: boolean;
}

const defaultFormValues: BootcampForm = {
  name: '',
  description: '',
  category: 'desarrollo-web',
  price: 0,
  duration_weeks: 8,
  difficulty_level: 'intermedio',
  cover_image_url: '',
  featured: false
};

export default function BootcampsAdminPage() {
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<BootcampForm>(defaultFormValues);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Verificar la conexión con Supabase
  useEffect(() => {
    async function checkConnection() {
      try {
        const { error } = await supabase.from('bootcamps').select('count').single();
        
        if (error) {
          console.error('Error de conexión con Supabase:', error);
          setConnectionStatus('error');
          return;
        }
        
        setConnectionStatus('connected');
      } catch (err) {
        console.error('Error al verificar la conexión:', err);
        setConnectionStatus('error');
      }
    }
    
    checkConnection();
  }, []);

  useEffect(() => {
    async function fetchBootcamps() {
      try {
        setLoading(true);
        const { data, error } = await getBootcamps();
        
        if (error) {
          setError(error);
          return;
        }
        
        setBootcamps(data || []);
      } catch (err) {
        setError('Error al cargar los bootcamps');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchBootcamps();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : 
             type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
             value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (editingId) {
        // Actualizar bootcamp existente
        const { error } = await supabase
          .from('bootcamps')
          .update(formData)
          .eq('id', editingId);
          
        if (error) throw error;
      } else {
        // Crear nuevo bootcamp
        const { error } = await supabase
          .from('bootcamps')
          .insert([formData]);
          
        if (error) throw error;
      }
      
      // Recargar bootcamps
      const { data, error } = await getBootcamps();
      if (error) {
        setError(error);
      } else {
        setBootcamps(data || []);
      }
      
      // Resetear formulario
      setFormData(defaultFormValues);
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error al guardar bootcamp:', error);
      setError('Error al guardar el bootcamp');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (bootcamp: Bootcamp) => {
    setFormData({
      name: bootcamp.name,
      description: bootcamp.description,
      category: bootcamp.category,
      price: bootcamp.price,
      duration_weeks: bootcamp.duration_weeks,
      difficulty_level: bootcamp.difficulty_level,
      cover_image_url: bootcamp.cover_image_url || '',
      featured: bootcamp.featured
    });
    setEditingId(bootcamp.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este bootcamp?')) return;
    
    try {
      const { error } = await supabase
        .from('bootcamps')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Actualizar lista local
      setBootcamps(bootcamps.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error al eliminar bootcamp:', error);
      setError('Error al eliminar el bootcamp');
    }
  };

  const resetForm = () => {
    setFormData(defaultFormValues);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Bootcamps</h1>
          <button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? (
              <>
                <XCircle className="h-5 w-5 mr-2" />
                Cancelar
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 mr-2" />
                Crear Bootcamp
              </>
            )}
          </button>
        </div>

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
              {connectionStatus === 'connected' ? 'Conectado a Supabase - Tabla Bootcamps' : 
               connectionStatus === 'error' ? 'Error de conexión con Supabase' : 'Verificando conexión...'}
            </h3>
            {connectionStatus === 'error' && (
              <p className="text-sm text-red-700 mt-1">No se pudo conectar a la tabla bootcamps. Verifica la configuración de Supabase.</p>
            )}
          </div>
          {connectionStatus === 'connected' && (
            <CheckCircle className="h-5 w-5 text-green-600" />
          )}
          {connectionStatus === 'error' && (
            <XCircle className="h-5 w-5 text-red-600" />
          )}
        </div>

        {/* Formulario de bootcamp */}
        {showForm && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">{editingId ? 'Editar Bootcamp' : 'Crear Nuevo Bootcamp'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="desarrollo-web">Desarrollo Web</option>
                    <option value="desarrollo-movil">Desarrollo Móvil</option>
                    <option value="ciencia-datos">Ciencia de Datos</option>
                    <option value="diseno-ux">Diseño UX/UI</option>
                    <option value="devops">DevOps</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="0"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="duration_weeks" className="block text-sm font-medium text-gray-700 mb-1">Duración (semanas)</label>
                  <input
                    type="number"
                    id="duration_weeks"
                    name="duration_weeks"
                    min="1"
                    required
                    value={formData.duration_weeks}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="difficulty_level" className="block text-sm font-medium text-gray-700 mb-1">Nivel de Dificultad</label>
                  <select
                    id="difficulty_level"
                    name="difficulty_level"
                    value={formData.difficulty_level}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="principiante">Principiante</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="cover_image_url" className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
                  <input
                    type="url"
                    id="cover_image_url"
                    name="cover_image_url"
                    value={formData.cover_image_url}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  ></textarea>
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                      Marcar como destacado
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium flex items-center"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </>
                  ) : (
                    'Guardar Bootcamp'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bootcamp
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Destacado
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bootcamps.map((bootcamp) => (
                    <tr key={bootcamp.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className="h-10 w-10 rounded-full object-cover" 
                              src={bootcamp.cover_image_url || '/assets/placeholder-bootcamp.png'} 
                              alt={bootcamp.name}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/assets/placeholder-bootcamp.png';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{bootcamp.name}</div>
                            <div className="text-sm text-gray-500">{bootcamp.duration_weeks} semanas</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{bootcamp.category}</div>
                        <div className="text-sm text-gray-500">{bootcamp.difficulty_level}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${bootcamp.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bootcamp.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {bootcamp.featured ? 'Sí' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            className="text-indigo-600 hover:text-indigo-900 flex items-center"
                            onClick={() => handleEdit(bootcamp)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900 flex items-center"
                            onClick={() => handleDelete(bootcamp.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {bootcamps.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        No hay bootcamps registrados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}