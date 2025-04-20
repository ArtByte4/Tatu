import { instance } from "@/lib/axiosConfig";

export const updateProfile = async (user, url) => {
    try {
      const payload = { url, id: user.id };
      const response = await instance.put(`/api/users/profile/${user.username}/photo`, payload);
      return response;
    } catch (error) {
      console.error("Error al actualizar el perfil del usuario", error);
      throw error;
    }
  };
  