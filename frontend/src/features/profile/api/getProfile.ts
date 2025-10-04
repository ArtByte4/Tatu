import { instance } from '@/lib/axiosConfig';
import type { AxiosResponse } from 'axios';

interface UserProfile {
  user_id: number;
  user_handle: string;
  image: string;
  bio: string;
  first_name: string;
}

interface ErrorResponse {
  message: string;
  error: unknown;
}

/**
 * Obtiene el perfil de un usuario dado su nombre de usuario.
 * @param username - El nombre de usuario a consultar
 * @returns Perfil del usuario o un mensaje de error
 */

export const getProfile = async (
  username: string
): Promise<UserProfile | ErrorResponse> => {
  try {
    const response: AxiosResponse<UserProfile> = await instance.get(`/api/users/profile/${username}`);
    return response.data;
  } catch (error) {
    return { message: "Error al obtener perfil de usuario", error };
  }
};
