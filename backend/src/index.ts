import "reflect-metadata";

import App from "./app";
import router from "./routes";
import { SocketService } from "./modules/messages/socketService";
import { ORIGIN_URL } from "./config";

const app = new App({ port: 3000, routes: router });

// Inicializar Socket.io
const httpServer = app.getHttpServer();
new SocketService(httpServer, ORIGIN_URL);

app.start();
