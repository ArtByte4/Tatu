import express from "express";
import { getUsers } from "./consulta.js";
const app = express();

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
