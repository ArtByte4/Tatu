import { instance } from "@/lib/axiosConfig";

interface LoginUserData {
  user_handle: string;
  password_hash: string;
}

interface LoginResponse {
  validation: boolean;
  message: string;
  user: string;
  id: number;
}

export const loginUser = async (dataUser: LoginUserData): Promise<LoginResponse> => {
  try {
    const response = await instance.post("/api/users/auth/login", dataUser);
    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};
