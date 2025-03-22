import { useState } from 'react';
import { supabase } from '../lib/supabase';

const SupabaseTestSimple = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>('No probado');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Intenta una consulta simple sin funciones de agregación
      const { data, error } = await supabase.from('bootcamps').select('id').limit(1);
      
      if (error) {
        setConnectionStatus('Error');
        setError(error.message || 'Error desconocido al conectar con Supabase');
      } else {
        setConnectionStatus('Conectado correctamente');
      }
    } catch (err: any) {
      setConnectionStatus('Error');
      setError(err.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A0B2E] to-[#130824] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">
          Test Simple de Supabase
        </h1>
        
        <div className="bg-[#2D1B46] p-6 rounded-lg border border-[#3F2E57] mb-6">
          <h2 className="text-xl font-semibold mb-3">Estado de la conexión</h2>
          <p className="mb-4">
            {connectionStatus === 'No probado' ? (
              <span className="text-gray-400">No se ha probado la conexión</span>
            ) : connectionStatus === 'Conectado correctamente' ? (
              <span className="text-green-400">✓ Conexión establecida correctamente</span>
            ) : (
              <span className="text-red-400">✗ Error al conectar con Supabase</span>
            )}
          </p>
          
          {error && (
            <div className="bg-red-900/30 p-3 rounded-md mb-4">
              <p className="text-red-300">{error}</p>
            </div>
          )}
          
          <button 
            onClick={testConnection}
            disabled={loading}
            className="px-4 py-2 bg-[#6B20FF] hover:bg-[#5718CC] rounded-md font-medium disabled:opacity-50 transition-all"
          >
            {loading ? 'Probando...' : 'Probar conexión'}
          </button>
        </div>
        
        <div className="bg-[#2D1B46] p-6 rounded-lg border border-[#3F2E57]">
          <h2 className="text-xl font-semibold mb-3">Configuración de Supabase</h2>
          
          <div className="mb-4">
            <h3 className="text-sm text-gray-400">URL:</h3>
            <p className="font-mono text-xs bg-black/30 p-2 rounded">
              {import.meta.env.VITE_SUPABASE_URL || 'No disponible'}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm text-gray-400">Clave anónima:</h3>
            <p className="font-mono text-xs bg-black/30 p-2 rounded">
              {import.meta.env.VITE_SUPABASE_ANON_KEY ? 
                `${import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 10)}...` : 
                'No disponible'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseTestSimple; 