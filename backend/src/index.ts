import "dotenv/config";
import "reflect-metadata";

import App from "./app";
import router from "./routes";
import { SocketService } from "./modules/messages/socketService";
import { ORIGIN_URL, PORT } from "./config";

const app = new App({ port: PORT, routes: router });

// Inicializar Socket.io
const httpServer = app.getHttpServer();
new SocketService(httpServer, ORIGIN_URL);

app.start();
