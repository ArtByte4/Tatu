import mysql, {Pool} from "mysql2/promise";
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } from "./config";

const connection: Pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: Number(DB_PORT),
});

export default connection;
