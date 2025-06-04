(process as any).loadEnvFile?.();

// Utilidad para asegurar que las variables no sean undefined
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable de entorno: ${name}`);
  }
  return value;
}

export const DB_HOST = requireEnv("DB_HOST");
export const DB_USER = requireEnv("DB_USER");
export const DB_PASSWORD = requireEnv("DB_PASSWORD");
export const DB_NAME = requireEnv("DB_NAME");
export const DB_PORT = requireEnv("DB_PORT");
export const SECRET_JWT_KEY = requireEnv("SECRET_JWT_KEY");
export const REFRESH_JWT_KEY = requireEnv("REFRESH_JWT_KEY");
export const ID_ROL_ADMIN = requireEnv("ID_ROL_ADMIN");
export const ORIGIN_URL = requireEnv("ORIGIN_URL");
