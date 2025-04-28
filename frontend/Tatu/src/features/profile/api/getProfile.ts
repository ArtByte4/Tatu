
import { instance } from '@/lib/axiosConfig';

export const getProfile = async (username) => {
    try{
        const response = await instance.get(`/api/users/profile/${username}`);
    return response
    }catch (error) {
        return {message: "Error al obtemer perfil de usuario", error}
    }
}