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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (isAuthenticated && user?.username) {
          const res = await instance.get<ProfileData>(`/api/users/profile/${user.username}`);
          profileData(res.data.image);
        }
      } catch (err) {
        console.error('Error cargando perfil:', err);
        logout(); // Si hay error, mejor limpiar sesión
      }
    };

    fetchProfile();
  }, [isAuthenticated, user?.username]);

  return children;
};
