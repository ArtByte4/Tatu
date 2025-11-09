import { instance } from "@/lib/axiosConfig";

interface LoginResponse {
  validation: boolean;
  message: string;
  user: string;
  id: number;
  role: number;
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

// Refrescar token de acceso
export const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const response = await instance.post<{ message: string }>(
      "/api/users/auth/refresh"
    );
    console.log("✅ Token refrescado:", response.data.message);
    return true;
  } catch (error) {
    console.error("❌ Error al refrescar token:", error);
    return false;
  }
};
