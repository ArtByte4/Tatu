import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

// Cargar variables de entorno desde .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, "..", ".env");

try {
  const envFile = readFileSync(envPath, "utf-8");
  envFile.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      if (key) {
        const value = valueParts.join("=").trim();
        // Remover comillas si existen
        const cleanValue = value.replace(/^["']|["']$/g, "");
        process.env[key.trim()] = cleanValue;
      }
    }
  });
} catch (error) {
  console.warn("⚠️  No se pudo cargar el archivo .env, usando variables de entorno del sistema");
}

// Cargar función loadEnvFile si existe (para compatibilidad con el proyecto)
(process as any).loadEnvFile?.();

// Crear conexión directamente
const getConnection = () => {
  const DB_HOST = process.env.DB_HOST || "localhost";
  const DB_USER = process.env.DB_USER || "root";
  const DB_PASSWORD = process.env.DB_PASSWORD || "";
  const DB_NAME = process.env.DB_NAME || "tatu_db";
  const DB_PORT = Number(process.env.DB_PORT) || 3306;

  return mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT,
  });
};

// Función para hashear contraseña
const encryptPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Script para crear un usuario administrador
 * 
 * Uso:
 * npx tsx scripts/createAdminUser.ts
 * 
 * O con valores personalizados:
 * ADMIN_USERNAME=admin ADMIN_EMAIL=admin@tatu.com ADMIN_PASSWORD=admin123 ADMIN_FIRSTNAME=Admin ADMIN_LASTNAME=User ADMIN_PHONE=1234567890 ADMIN_BIRTHDAY=1990-01-01 npx tsx scripts/createAdminUser.ts
 */

interface AdminUserData {
  user_handle: string;
  email_address: string;
  first_name: string;
  last_name: string;
  phonenumber: string;
  password_hash: string;
  birth_day: string;
  role_id: number;
}

const createAdminUser = async () => {
  let connection: mysql.Connection | null = null;
  
  try {
    // Valores por defecto o desde variables de entorno
    const userData: AdminUserData = {
      user_handle: process.env.ADMIN_USERNAME || "admin",
      email_address: process.env.ADMIN_EMAIL || "admin@tatu.com",
      first_name: process.env.ADMIN_FIRSTNAME || "Administrador",
      last_name: process.env.ADMIN_LASTNAME || "Sistema",
      phonenumber: process.env.ADMIN_PHONE || "1234567890",
      password_hash: "",
      birth_day: process.env.ADMIN_BIRTHDAY || "1990-01-01",
      role_id: 3, // 3 = administrador
    };

    const password = process.env.ADMIN_PASSWORD || "admin123";

    // Crear conexión
    console.log("🔌 Conectando a la base de datos...");
    connection = await getConnection();

    // Verificar que el usuario no exista
    const [existingUsers] = await connection.query(
      "SELECT user_id FROM users WHERE user_handle = ? OR email_address = ?",
      [userData.user_handle, userData.email_address]
    );

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      console.error("❌ Error: Ya existe un usuario con ese username o email");
      process.exit(1);
    }

    // Verificar que el rol administrador existe
    const [roles] = await connection.query("SELECT role_id FROM roles WHERE role_id = 3");
    if (!Array.isArray(roles) || roles.length === 0) {
      console.error("❌ Error: El rol administrador (role_id = 3) no existe en la base de datos");
      console.log("💡 Ejecuta primero: INSERT INTO roles (name) VALUES ('administrador');");
      process.exit(1);
    }

    // Hashear contraseña
    console.log("🔐 Generando hash de contraseña...");
    userData.password_hash = await encryptPassword(password);

    // Insertar usuario
    console.log("📝 Insertando usuario administrador...");
    const [result] = await connection.query(
      `INSERT INTO users (
        user_handle, 
        email_address, 
        first_name, 
        last_name, 
        phonenumber, 
        role_id, 
        password_hash, 
        birth_day
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userData.user_handle,
        userData.email_address,
        userData.first_name,
        userData.last_name,
        userData.phonenumber,
        userData.role_id,
        userData.password_hash,
        userData.birth_day,
      ]
    );

    const insertResult = result as any;
    console.log("✅ Usuario administrador creado exitosamente!");
    console.log("\n📋 Detalles del usuario:");
    console.log(`   ID: ${insertResult.insertId}`);
    console.log(`   Username: ${userData.user_handle}`);
    console.log(`   Email: ${userData.email_address}`);
    console.log(`   Nombre: ${userData.first_name} ${userData.last_name}`);
    console.log(`   Rol: Administrador (${userData.role_id})`);
    console.log(`   Contraseña: ${password} (¡Guárdala en un lugar seguro!)`);
    console.log("\n⚠️  IMPORTANTE: Cambia la contraseña después del primer inicio de sesión");

    // Cerrar conexión
    await connection.end();
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Error al crear usuario administrador:", error.message);
    if (error.code === "ER_DUP_ENTRY") {
      console.error("   El username o email ya está en uso");
    } else if (error.code === "ECONNREFUSED") {
      console.error("   No se pudo conectar a la base de datos. Verifica las credenciales en .env");
    } else if (error.code === "ER_BAD_DB_ERROR") {
      console.error("   La base de datos no existe. Verifica DB_NAME en .env");
    }
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
};

// Ejecutar script
createAdminUser();

