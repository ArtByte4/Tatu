
// components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
