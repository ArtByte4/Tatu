import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("Hola, Express con ESM!");
});

// Se crea un servidor en el puerto 3000
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
