import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import { Database, CheckCircle, XCircle, Edit, UserCog, Mail, Search } from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
  last_sign_in_at: string | null;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  // Verificar la conexión con Supabase
  useEffect(() => {
    async function checkConnection() {
      try {
        const { error } = await supabase.from('profiles').select('count').single();
        
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

  // Cargar usuarios
  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        // Obtener usuarios desde la autenticación de Supabase
        // Junto con información de perfiles
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) {
          setError('Error al cargar los usuarios: ' + authError.message);
          return;
        }
        
        // Obtener datos adicionales de perfiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*');
          
        if (profilesError) {
          console.error('Error al cargar perfiles:', profilesError);
        }
        
        // Combinar datos de autenticación con perfiles
        const combinedUsers = authUsers?.users.map(user => {
          const profile = profilesData?.find(p => p.id === user.id);
          return {
            ...user,
            role: profile?.role || 'user'
          };
        }) || [];
        
        setUsers(combinedUsers);
      } catch (err) {
        setError('Error al cargar los usuarios');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
        
      if (error) throw error;
      
      // Actualizar la lista de usuarios localmente
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, role: newRole } 
          : user
      ));
      
    } catch (error) {
      console.error('Error al actualizar el rol:', error);
      setError('Error al actualizar el rol del usuario');
    }
  };

  // Filtrar usuarios según búsqueda y rol seleccionado
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.user_metadata?.full_name || '').toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
          <button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
            onClick={() => alert('Funcionalidad de invitar usuarios por implementar')}
          >
            <Mail className="h-5 w-5 mr-2" />
            Invitar Usuario
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
              {connectionStatus === 'connected' ? 'Conectado a Supabase - Gestión de Usuarios' : 
               connectionStatus === 'error' ? 'Error de conexión con Supabase' : 'Verificando conexión...'}
            </h3>
            {connectionStatus === 'error' && (
              <p className="text-sm text-red-700 mt-1">No se pudo conectar a la tabla de perfiles. Verifica la configuración de Supabase.</p>
            )}
          </div>
          {connectionStatus === 'connected' && (
            <CheckCircle className="h-5 w-5 text-green-600" />
          )}
          {connectionStatus === 'error' && (
            <XCircle className="h-5 w-5 text-red-600" />
          )}
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre o correo..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-shrink-0">
              <select
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md text-sm"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="all">Todos los roles</option>
                <option value="admin">Administradores</option>
                <option value="instructor">Instructores</option>
                <option value="user">Usuarios</option>
              </select>
            </div>
          </div>
        </div>

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
                      Usuario
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Registro
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Último Acceso
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className="h-10 w-10 rounded-full object-cover" 
                              src={user.user_metadata?.avatar_url || '/assets/placeholder-avatar.png'} 
                              alt={user.user_metadata?.full_name || user.email} 
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/assets/placeholder-avatar.png';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.user_metadata?.full_name || 'Usuario sin nombre'}
                            </div>
                            <div className="text-sm text-gray-500">ID: {user.id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                              user.role === 'instructor' ? 'bg-blue-100 text-blue-800' : 
                              'bg-green-100 text-green-800'}`}>
                            {user.role === 'admin' ? 'Administrador' : 
                             user.role === 'instructor' ? 'Instructor' : 'Usuario'}
                          </span>
                          <button 
                            className="ml-2 text-gray-400 hover:text-gray-600"
                            onClick={() => {
                              const newRole = prompt(
                                'Cambiar rol (escriba "admin", "instructor" o "user"):', 
                                user.role
                              );
                              if (newRole && ['admin', 'instructor', 'user'].includes(newRole)) {
                                handleRoleChange(user.id, newRole);
                              }
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.last_sign_in_at 
                          ? new Date(user.last_sign_in_at).toLocaleDateString() 
                          : 'Nunca'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          className="text-indigo-600 hover:text-indigo-900 flex items-center"
                          onClick={() => alert(`Gestión de usuario ${user.email} (funcionalidad por implementar)`)}
                        >
                          <UserCog className="h-4 w-4 mr-1" />
                          Gestionar
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        {users.length === 0 
                          ? 'No hay usuarios registrados' 
                          : 'No se encontraron usuarios con los filtros aplicados'}
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
