import { instance } from "@/lib/axiosConfig";

interface LoginResponse {
  validation: boolean;
  message: string;
  user: string;
  id: number;
  rol: number;
}

export const loginUser = async (dataUser: {
  user_handle: string;
  password_hash: string;
}): Promise<LoginResponse> => {
  try {
    const response = await instance.post<LoginResponse>(
      "/api/users/auth/login",
      dataUser,
    );
    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};
