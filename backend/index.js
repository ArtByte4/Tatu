import express from "express";
import { getUsers } from "./consulta.js";
import { addUser } from "./insertarDatos.js";
import cors from "cors";

import bodyParser from "body-parser";



const app = express();


const corsOptions = {
  // origin: "http://localhost:5173", // Permite solicitudes desde el frontend en localhost:3000
  origin: "*",
  methods: ["GET", "POST"], // Métodos permitidos
  allowedHeaders: ["Content-Type", "Authorization"], // Headers permitidos
};
app.use(cors(corsOptions)); // Habilitar CORS con las opciones configuradas

// Middleware para poder leer JSON
app.use(bodyParser.json());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Hola, Express con ESM!");
});
app.get("/consulta", (req, res) => {
  res.send("consulta");
});

// Se crea un servidor en el puerto 3000
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});

app.get("/users", (req, res) => {
  getUsers((err, users) => {
    if (err) {
      return res.status(500).json({ error: "Error al obtener usuarios" });
    }
    res.json(users);
  });
});

app.post("/insertarUser", (req, res) => {
  const {
    user_handle,
    email_address,
    first_name,
    last_name,
    phonenumber,
    password_hash,
    birth_day,
  } = req.body;

  if (
    !user_handle ||
    !email_address ||
    !first_name ||
    !last_name ||
    !password_hash ||
    !birth_day
  ) {
    return res.status(400).json({ message: "Todos los campos son necesarios" });
  }

  const role_id = 1;

  addUser(
    {
      user_handle,
      email_address,
      first_name,
      last_name,
      phonenumber,
      role_id,
      password_hash,
      birth_day,
    },
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error al registrar el usuario" });
      }
      res
        .status(201)
        .json({
          message: "Usuario registrado exitosamente",
          userId: results.insertId,
        });
    }
  );
});
