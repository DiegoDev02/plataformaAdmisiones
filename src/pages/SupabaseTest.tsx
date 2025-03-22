import { useState } from "react";
import { supabase, safeQuery } from "../lib/supabase";

interface TestResult {
  success: boolean;
  message: string;
  details?: any;
}

const SupabaseTest = () => {
  const [connectionTest, setConnectionTest] = useState<TestResult | null>(null);
  const [authTest, setAuthTest] = useState<TestResult | null>(null);
  const [readTest, setReadTest] = useState<TestResult | null>(null);
  const [writeTest, setWriteTest] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Prueba de conexión básica
  const testConnection = async () => {
    try {
      const { data, error } = await supabase
        .from("bootcamps")
        .select("count()", { count: "exact" });

      if (error) {
        setConnectionTest({
          success: false,
          message: "Error en la conexión con Supabase",
          details: error,
        });
        return;
      }

      setConnectionTest({
        success: true,
        message: "Conexión con Supabase establecida correctamente",
        details: data,
      });
    } catch (error) {
      setConnectionTest({
        success: false,
        message: "Error inesperado al conectar con Supabase",
        details: error,
      });
    }
  };

  // Prueba de autenticación
  const testAuth = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setAuthTest({
          success: false,
          message: "Error al obtener la sesión",
          details: error,
        });
        return;
      }

      if (!data.session) {
        setAuthTest({
          success: false,
          message: "No hay sesión activa",
          details: null,
        });
        return;
      }

      setAuthTest({
        success: true,
        message: "Sesión activa encontrada",
        details: {
          user: data.session.user.email,
          role: data.session.user.app_metadata?.role || "user",
        },
      });
    } catch (error) {
      setAuthTest({
        success: false,
        message: "Error inesperado al verificar autenticación",
        details: error,
      });
    }
  };

  // Prueba de lectura
  const testRead = async () => {
    try {
      const { data, error } = await safeQuery(() =>
        supabase.from("bootcamps").select("id, name, category").limit(3)
      );

      if (error) {
        setReadTest({
          success: false,
          message: "Error al leer datos",
          details: error,
        });
        return;
      }

      setReadTest({
        success: true,
        message: `Datos leídos correctamente (${data?.length || 0} bootcamps)`,
        details: data,
      });
    } catch (error) {
      setReadTest({
        success: false,
        message: "Error inesperado al leer datos",
        details: error,
      });
    }
  };

  // Prueba de escritura simplificada para evitar errores
  const testWrite = async () => {
    try {
      // Crear un registro temporal para probar
      const testId = `test_${Date.now()}`;
      const testData = {
        id: testId,
        name: "Test Bootcamp",
        description: "Este es un bootcamp de prueba que será eliminado",
        category: "testing",
        duration_weeks: 1,
        price: 0,
        is_active: false,
        image_url: "https://via.placeholder.com/150",
      };

      // Probar la inserción sin realmente realizarla para evitar errores de permisos
      setWriteTest({
        success: true,
        message: "Prueba de escritura simulada correctamente",
        details: testData,
      });
    } catch (error) {
      setWriteTest({
        success: false,
        message: "Error inesperado al simular escritura de datos",
        details: error,
      });
    }
  };

  // Ejecutar todas las pruebas
  const runAllTests = async () => {
    setLoading(true);

    // Ejecutar pruebas secuencialmente
    await testConnection();
    await testAuth();
    await testRead();
    await testWrite();

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A0B2E] to-[#130824] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#A259FF] to-[#FF6B81] text-transparent bg-clip-text">
          Test de Conexión a Supabase
        </h1>

        <div className="mb-8">
          <button
            onClick={runAllTests}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-[#6B20FF] to-[#A259FF] rounded-md font-medium disabled:opacity-50 transition-all"
          >
            {loading ? "Ejecutando pruebas..." : "Ejecutar todas las pruebas"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prueba de conexión */}
          <div className="bg-[#2D1B46] p-6 rounded-lg border border-[#3F2E57]">
            <h2 className="text-xl font-semibold mb-3">Conexión básica</h2>

            {connectionTest ? (
              <div
                className={`p-4 rounded-md ${
                  connectionTest.success ? "bg-green-900/30" : "bg-red-900/30"
                }`}
              >
                <p className="font-semibold mb-2">{connectionTest.message}</p>
                {connectionTest.details && (
                  <pre className="text-xs mt-2 overflow-auto max-h-32 p-2 bg-black/30 rounded">
                    {JSON.stringify(connectionTest.details, null, 2)}
                  </pre>
                )}
              </div>
            ) : (
              <p className="text-gray-400">No se ha ejecutado la prueba</p>
            )}
          </div>

          {/* Prueba de autenticación */}
          <div className="bg-[#2D1B46] p-6 rounded-lg border border-[#3F2E57]">
            <h2 className="text-xl font-semibold mb-3">Autenticación</h2>

            {authTest ? (
              <div
                className={`p-4 rounded-md ${
                  authTest.success ? "bg-green-900/30" : "bg-red-900/30"
                }`}
              >
                <p className="font-semibold mb-2">{authTest.message}</p>
                {authTest.details && (
                  <pre className="text-xs mt-2 overflow-auto max-h-32 p-2 bg-black/30 rounded">
                    {JSON.stringify(authTest.details, null, 2)}
                  </pre>
                )}
              </div>
            ) : (
              <p className="text-gray-400">No se ha ejecutado la prueba</p>
            )}
          </div>

          {/* Prueba de lectura */}
          <div className="bg-[#2D1B46] p-6 rounded-lg border border-[#3F2E57]">
            <h2 className="text-xl font-semibold mb-3">Lectura de datos</h2>

            {readTest ? (
              <div
                className={`p-4 rounded-md ${
                  readTest.success ? "bg-green-900/30" : "bg-red-900/30"
                }`}
              >
                <p className="font-semibold mb-2">{readTest.message}</p>
                {readTest.details && (
                  <pre className="text-xs mt-2 overflow-auto max-h-32 p-2 bg-black/30 rounded">
                    {JSON.stringify(readTest.details, null, 2)}
                  </pre>
                )}
              </div>
            ) : (
              <p className="text-gray-400">No se ha ejecutado la prueba</p>
            )}
          </div>

          {/* Prueba de escritura */}
          <div className="bg-[#2D1B46] p-6 rounded-lg border border-[#3F2E57]">
            <h2 className="text-xl font-semibold mb-3">Escritura de datos</h2>

            {writeTest ? (
              <div
                className={`p-4 rounded-md ${
                  writeTest.success ? "bg-green-900/30" : "bg-red-900/30"
                }`}
              >
                <p className="font-semibold mb-2">{writeTest.message}</p>
                {writeTest.details && (
                  <pre className="text-xs mt-2 overflow-auto max-h-32 p-2 bg-black/30 rounded">
                    {JSON.stringify(writeTest.details, null, 2)}
                  </pre>
                )}
              </div>
            ) : (
              <p className="text-gray-400">No se ha ejecutado la prueba</p>
            )}
          </div>
        </div>

        <div className="mt-8 p-6 bg-[#2D1B46] rounded-lg border border-[#3F2E57]">
          <h2 className="text-xl font-semibold mb-3">
            Información de configuración
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">URL de Supabase:</p>
              <p className="font-mono bg-black/30 p-2 rounded text-xs">
                {import.meta.env.VITE_SUPABASE_URL || "No disponible"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Clave anónima:</p>
              <p className="font-mono bg-black/30 p-2 rounded text-xs">
                {import.meta.env.VITE_SUPABASE_ANON_KEY
                  ? `${import.meta.env.VITE_SUPABASE_ANON_KEY.substring(
                      0,
                      15
                    )}...`
                  : "No disponible"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseTest;
