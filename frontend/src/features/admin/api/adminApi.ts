import { instance } from "@/lib/axiosConfig";
import { AxiosResponse } from "axios";

export interface AdminUser {
  user_id: number;
  user_handle: string;
  first_name: string;
  last_name: string;
  email_address: string;
  phonenumber: string;
  birth_day: string;
  role_id: number;
  created_at?: string;
  image?: string;
  bio?: string;
  gender?: string;
  follower_count?: number;
}

export interface CreateUserData {
  user_handle: string;
  email_address: string;
  first_name: string;
  last_name: string;
  phonenumber: string;
  password_hash: string;
  birth_day: string;
  role_id?: number;
}

export interface UpdateUserData {
  user_handle?: string;
  email_address?: string;
  first_name?: string;
  last_name?: string;
  phonenumber?: string;
  birth_day?: string;
  password_hash?: string;
  role_id?: number;
}

// Obtener todos los usuarios
export const fetchAllUsers = async (): Promise<AdminUser[]> => {
  try {
    const response: AxiosResponse<AdminUser[]> = await instance.get("/api/admin/users", {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};

// Obtener usuario por ID
export const fetchUserById = async (userId: number): Promise<AdminUser> => {
  try {
    const response: AxiosResponse<AdminUser> = await instance.get(`/api/admin/users/${userId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Error al obtener usuario:", error);
    throw error;
  }
};

// Crear usuario
export const createUser = async (userData: CreateUserData): Promise<{ message: string; userId: number }> => {
  try {
    const response: AxiosResponse<{ message: string; userId: number }> = await instance.post(
      "/api/admin/users",
      userData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
};

// Actualizar usuario
export const updateUser = async (userId: number, userData: UpdateUserData): Promise<{ message: string }> => {
  try {
    const response: AxiosResponse<{ message: string }> = await instance.put(
      `/api/admin/users/${userId}`,
      userData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error al actualizar usuario:", error);
    throw error;
  }
};

// Actualizar rol de usuario
export const updateUserRole = async (userId: number, roleId: number): Promise<{ message: string }> => {
  try {
    const response: AxiosResponse<{ message: string }> = await instance.put(
      `/api/admin/users/${userId}/role`,
      { role_id: roleId },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error al actualizar rol:", error);
    throw error;
  }
};

// Eliminar usuario
export const deleteUser = async (userId: number): Promise<{ mensaje: string }> => {
  try {
    const response: AxiosResponse<{ mensaje: string }> = await instance.delete(
      `/api/admin/users/${userId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error al eliminar usuario:", error);
    throw error;
  }
};

