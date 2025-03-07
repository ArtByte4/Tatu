import dotenv from "dotenv";
import mysql from "mysql2";

dotenv.config();


const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });


  connection.connect((err) => {
    if (err) {
      console.error('Error al conectar a MySQL:', err);
      return;
    }
    console.log('Conexión exitosa a la base de datos MySQL ✅');
  });
  
  export default connection;

