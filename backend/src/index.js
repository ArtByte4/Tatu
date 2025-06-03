import App from "./app.js";
import router from "./routes.js";

const app = new App({ port: 3000, routes: router });

app.start();
