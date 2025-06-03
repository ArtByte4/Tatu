import "reflect-metadata";

import App from "./app";
import router from "./routes";

const app = new App({ port: 3000, routes: router });

app.start();
