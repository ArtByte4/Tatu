import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getDashborad } from '../features/auth/hooks/useGetDashboard';


export const ProtectedRouteAdmin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
  
    const verify = async () => {
      try {
        const response = await getDashborad();
        console.log(response.valid);
        setAutorizado(response.valid);
      } catch (error) {
        setAutorizado(false);
      } finally {
        setIsLoading(false);
      }
    };
    verify();
  }, []);

  if (isLoading) return <p>Cargando...</p>;

  return autorizado ? <Outlet /> : <Navigate to="/" />;
};
