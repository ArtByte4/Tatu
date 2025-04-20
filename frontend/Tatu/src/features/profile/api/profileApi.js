
import { instance } from '@/lib/axiosConfig';

export const profileApi = async (username) => {
    try{
        const response = instance.get(`http://localhost:3000/api/users/profile/${username}`);
    return response
    }catch (error) {
        return {message: "Error al traer usuario", error}
    }
}