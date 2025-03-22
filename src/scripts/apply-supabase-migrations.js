// apply-supabase-migrations.js
// Script para aplicar migraciones directamente a Supabase usando su API REST

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Obtener __dirname equivalente en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Las credenciales se deben proporcionar como variables de entorno o directamente aquí
const SUPABASE_URL = 'https://cgkpekpkjwtlwusxltl.supabase.co'; // URL desde la configuración
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNna3Bla3Brand0dGx3dXN4bHRsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjU2OTQ4NywiZXhwIjoyMDU4MTQ1NDg3fQ.QfurBOBoDCVObgpmhfM9B0sNnCXm2EI0wvpJbttwR04'; // clave de servicio de supabase

/**
 * Ejecuta una consulta SQL en Supabase usando la API REST
 */
async function executeSql(sqlStatement) {
  try {
    // Asegurarse de que la declaración SQL termine con punto y coma
    if (!sqlStatement.trim().endsWith(';')) {
      sqlStatement += ';';
    }

    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/execute_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
      },
      body: JSON.stringify({
        query: sqlStatement
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Error al ejecutar SQL:', result);
      return { success: false, error: result };
    }
    
    return { success: true, data: result };
  } catch (error) {
    console.error('Error en la solicitud:', error);
    return { success: false, error };
  }
}

/**
 * Crea la función execute_sql en la base de datos si no existe
 */
async function setupExecuteSqlFunction() {
  const createFunctionSql = `
    CREATE OR REPLACE FUNCTION execute_sql(query text)
    RETURNS json
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    DECLARE
      result json;
    BEGIN
      EXECUTE query;
      RETURN '{"status": "success"}'::json;
    EXCEPTION WHEN OTHERS THEN
      RETURN json_build_object(
        'status', 'error',
        'message', SQLERRM,
        'detail', SQLSTATE
      );
    END;
    $$;
  `;

  console.log('Configurando función execute_sql...');
  const result = await executeSql(createFunctionSql);
  
  if (result.success) {
    console.log('Función execute_sql creada o actualizada correctamente');
  } else {
    console.error('Error al configurar la función execute_sql');
    process.exit(1);
  }
}

/**
 * Procesa un archivo SQL y lo ejecuta en Supabase
 */
async function processSqlFile(filePath) {
  try {
    console.log(`Procesando archivo: ${path.basename(filePath)}`);
    
    // Leer el contenido del archivo
    const sqlContent = fs.readFileSync(filePath, 'utf8');
    
    // Dividir el contenido en declaraciones individuales
    const statements = sqlContent.split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`Encontradas ${statements.length} declaraciones SQL para ejecutar`);
    
    // Ejecutar cada declaración individualmente
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Ejecutando declaración ${i + 1}/${statements.length}...`);
      
      const result = await executeSql(statement);
      
      if (!result.success) {
        console.error(`Error al ejecutar la declaración ${i + 1}:`, result.error);
        // Continuar a pesar de los errores para aplicar el mayor número posible de cambios
      } else {
        console.log(`Declaración ${i + 1} ejecutada correctamente`);
      }
    }
    
    console.log(`Archivo ${path.basename(filePath)} procesado completamente`);
    return true;
  } catch (error) {
    console.error(`Error al procesar el archivo ${path.basename(filePath)}:`, error);
    return false;
  }
}

/**
 * Función principal para ejecutar todas las migraciones
 */
async function applyMigrations() {
  try {
    // Configurar la función execute_sql primero
    await setupExecuteSqlFunction();
    
    // Ruta a la carpeta de migraciones
    const migrationsDir = path.join(__dirname, '..', '..', 'migrations');
    
    // Verificar que la carpeta existe
    if (!fs.existsSync(migrationsDir)) {
      console.error(`La carpeta de migraciones no existe: ${migrationsDir}`);
      return;
    }
    
    // Obtener todos los archivos SQL y ordenarlos
    const sqlFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Asegura el orden correcto de ejecución
    
    console.log(`Encontrados ${sqlFiles.length} archivos de migración`);
    
    // Procesar cada archivo
    for (const file of sqlFiles) {
      const fullPath = path.join(migrationsDir, file);
      const success = await processSqlFile(fullPath);
      
      if (!success) {
        console.error(`Hubo errores al procesar ${file}, pero continuamos con el siguiente`);
      }
    }
    
    console.log('Migraciones completadas');
  } catch (error) {
    console.error('Error en el proceso de migración:', error);
  }
}

// Ejecutar la función principal
applyMigrations();
