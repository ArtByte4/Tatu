import express from "express";
import cors from "cors";
import userRoutes from './routes/userRouters.js';
import followerdRoutes from './routes/followersRouters.js'
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
  credentials: true,
};
app.use(cors(corsOptions));


// Middleware para poder leer JSON
// app.use(bodyParser.json());
app.use(express.json());

app.use(cookieParser())


app.use('/api', userRoutes);
app.use('/api', followerdRoutes);



// Se crea un servidor en el puerto 3000
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
