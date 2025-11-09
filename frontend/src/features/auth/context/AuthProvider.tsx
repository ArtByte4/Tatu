import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import {instance} from '@/lib/axiosConfig';

interface AuthProviderProps {
  children: React.ReactNode;
}

interface ProfileData {
  image: string;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { isAuthenticated, user, profileData, logout } = useAuthStore();

  // Verificar sincronización de estado con cookies al iniciar
  useEffect(() => {
    const checkAuthState = async () => {
      // Si el usuario está "autenticado" según el store, verificar si las cookies existen
      if (isAuthenticated && user) {
        try {
          // Intentar refrescar el token para verificar si las cookies HTTP-only existen
          // Si el refresh_token existe, obtendremos un nuevo access_token
          const refreshResponse = await instance.post('/api/users/auth/refresh');
          console.log("✅ Cookies de autenticación verificadas:", refreshResponse.data.message);
        } catch (err: any) {
          // Si falla con 401, significa que no hay refresh_token (cookies expiradas)
          if (err?.response?.status === 401 || err?.response?.status === 403) {
            console.warn("⚠️ Usuario autenticado en store pero cookies expiradas. Limpiando sesión.");
            logout();
            // Redirigir al login solo si estamos en una ruta protegida
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
          }
        }
      } else if (!isAuthenticated && user) {
        // Estado inconsistente: hay usuario pero no está autenticado
        console.warn("⚠️ Estado inconsistente detectado. Limpiando sesión.");
        logout();
      }
    };

    checkAuthState();
  }, []); // Solo al montar

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (isAuthenticated && user?.username) {
          const response = await instance.get<ProfileData>(`/api/users/profile/${user.username}`);
          profileData(response.data.image);
        }
      } catch (err) {
        console.error('Error cargando perfil:', err);
        // No hacer logout automático aquí, el interceptor manejará los 401
      }
    };

    fetchProfile();
  }, [isAuthenticated, user?.username]);

  return children;
};
