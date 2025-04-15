

import {instance} from "@/lib/axiosConfig";

export const loginUser = async (dataUser) => {
    try{
        const response = await instance.post("/api/users/auth/login", dataUser)
        return response.data;
    }
    catch (error) {
        console.error("Error al iniciar sesión:", error);
        throw error;
    }

}
