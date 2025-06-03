import cors from "cors";

import { ORIGIN_URL } from "./config.js";
import cookieParser from "cookie-parser";
import express from "express";

class App {
  port;
  app = express()

  constructor({port, routes}) {
    this.port = port || 3000;
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

  start() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en puerto: ${this.port}`);
    });
  }
}

export default App;
