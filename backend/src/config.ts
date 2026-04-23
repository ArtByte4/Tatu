import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv(): void {
  const nativeLoadEnv = (process as any).loadEnvFile as
    | ((path?: string) => void)
    | undefined;

  // Node >=22: use native env loader when available.
  if (typeof nativeLoadEnv === "function") {
    nativeLoadEnv();
    return;
  }

  // Node 20 fallback: load backend/.env manually.
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;

  const envFile = readFileSync(envPath, "utf-8");
  for (const line of envFile.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const sepIndex = trimmed.indexOf("=");
    if (sepIndex === -1) continue;

    const key = trimmed.slice(0, sepIndex).trim();
    let value = trimmed.slice(sepIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnv();

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
export const PORT = Number(process.env.PORT ?? "3000");
