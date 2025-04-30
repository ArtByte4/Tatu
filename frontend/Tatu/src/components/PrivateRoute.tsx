
// components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
