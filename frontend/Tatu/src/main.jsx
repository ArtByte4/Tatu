import { createRoot } from "react-dom/client";
import "../src/assets/styles/index.css";
import { AuthProvider } from "./features/auth/context/AuthProvider.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
