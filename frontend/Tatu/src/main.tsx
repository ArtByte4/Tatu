import { createRoot } from "react-dom/client";
import "../src/assets/styles/index.css";
import { AuthProvider } from "./features/auth/context/AuthProvider.jsx";
import App from "./App";

createRoot(document.getElementById("root") as HTMLElement).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
