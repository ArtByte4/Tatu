process.loadEnvFile();
export const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
  SECRET_JWT_KEY,
  REFRESH_JWT_KEY,
} = process.env;
