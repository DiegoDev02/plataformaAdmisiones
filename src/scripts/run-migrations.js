// Script para ejecutar migraciones en Supabase
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Cargar variables de entorno
dotenv.config();

// Obtener __dirname equivalente en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear cliente Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Función para leer y ejecutar archivos SQL
async function runMigration(filePath) {
  try {
    console.log(`Ejecutando migración: ${path.basename(filePath)}`);
    
    // Leer el archivo SQL
    const sqlContent = fs.readFileSync(filePath, 'utf8');
    
    // Dividir el archivo en declaraciones separadas
    const statements = sqlContent
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    // Ejecutar cada declaración
    for (const statement of statements) {
      try {
        const { data, error } = await supabase.rpc('run_sql', { sql: statement + ';' });
        
        if (error) {
          console.error(`Error al ejecutar SQL: ${error.message}`);
          console.error(`Declaración: ${statement}`);
        } else {
          console.log(`Ejecutado con éxito: ${statement.substring(0, 60)}...`);
        }
      } catch (stmtError) {
        console.error(`Error inesperado al ejecutar declaración: ${stmtError.message}`);
      }
    }
    
    console.log(`Migración completada: ${path.basename(filePath)}`);
    return true;
  } catch (error) {
    console.error(`Error al ejecutar migración ${path.basename(filePath)}: ${error.message}`);
    return false;
  }
}

// Ejecutar todas las migraciones en la carpeta
async function runAllMigrations() {
  const migrationsDir = path.join(__dirname, '..', '..', 'migrations');
  
  // Verificar si la carpeta existe
  if (!fs.existsSync(migrationsDir)) {
    console.error(`La carpeta de migraciones no existe: ${migrationsDir}`);
    return;
  }
  
  // Obtener lista de archivos de migración
  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort(); // Ordenar alfabéticamente para asegurar orden correcto
  
  console.log(`Encontradas ${files.length} migraciones para ejecutar`);
  
  // Ejecutar migraciones en orden
  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const success = await runMigration(filePath);
    
    if (!success) {
      console.error(`La migración falló: ${file}. Deteniendo el proceso.`);
      break;
    }
  }
  
  console.log('Proceso de migración completado');
}

// Ejecutar migraciones
runAllMigrations().catch(error => {
  console.error('Error inesperado durante las migraciones:', error);
  process.exit(1);
});
