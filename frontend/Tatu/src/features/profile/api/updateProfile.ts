import { instance } from "@/lib/axiosConfig";
import type { AxiosResponse } from "axios";

interface User {
  username: string;
  id: number;
}

interface UpdateProfileResponse {
  success: boolean;
  message: string;
}

/**
 * Actualiza la foto de perfil del usuario.
 * 
 * @param user - Objeto con ID y nombre de usuario del usuario.
 * @param url - URL de la nueva imagen de perfil.
 * @returns Respuesta del servidor con el estado de la actualización.
 */

export const updateProfile = async (
  user: User, url: string
): Promise<AxiosResponse<UpdateProfileResponse>> => {
  try {
    const payload = { url, id: user.id };
    const response: AxiosResponse<UpdateProfileResponse> = await instance.put(`/api/users/profile/${user.username}/photo`, payload);
    return response;
  } catch (error) {
    console.error("Error al actualizar el perfil del usuario", error);
    throw error;
  }
};
