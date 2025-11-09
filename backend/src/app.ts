import cors from "cors";
import { ORIGIN_URL } from "./config.js";
import cookieParser from "cookie-parser";
import express, { Application, Router } from "express";
import { createServer, Server as HTTPServer } from "http";



interface AppParams {
  port?: number;
  routes: Router;
}


class App {
  port;
  app: Application = express();
  httpServer: HTTPServer;

  constructor({ port, routes }: AppParams) {
    this.port = port ?? 3000;
    this.httpServer = createServer(this.app);
    
    // Logging de configuración CORS para diagnóstico
    console.log("🌐 Configuración CORS:", {
      origin: ORIGIN_URL,
      credentials: true,
    });
    
    this.app.use(
      cors({
        credentials: true,
        origin: ORIGIN_URL,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: ["Content-Range", "X-Content-Range"],
        maxAge: 600
      })
    );
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(routes);
  }

  getHttpServer(): HTTPServer {
    return this.httpServer;
  }

  start(): void {
    this.httpServer.listen(this.port, () => {
      console.log(`Servidor corriendo en puerto: ${this.port}`);
    });
  }
}

export default App;
