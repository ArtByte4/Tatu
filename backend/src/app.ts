import cors from "cors";
import { ORIGIN_URL } from "./config.js";
import cookieParser from "cookie-parser";
import express, { Application, Router } from "express";



interface AppParams {
  port?: number;
  routes: Router;
}


class App {
  port;
  app: Application = express()

  constructor({ port, routes }: AppParams) {
    this.port = port ?? 3000;
    this.app.use(
      cors({
        credentials: true,
        origin: ORIGIN_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
      })
    );
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(routes);
  }

  start(): void {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en puerto: ${this.port}`);
    });
  }
}

export default App;
