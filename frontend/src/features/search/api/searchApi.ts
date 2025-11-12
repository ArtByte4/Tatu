import { instance } from "@/lib/axiosConfig";
import { AxiosResponse } from "axios";

export interface SearchUser {
  user_id: number;
  user_handle: string;
  first_name: string;
  last_name: string;
  role_id: number;
  birth_day: string;
  gender: string;
  image: string;
  bio: string;
  follower_count: number;
}

// Buscar usuarios
export const searchUsers = async (query: string): Promise<SearchUser[]> => {
  try {
    const response: AxiosResponse<SearchUser[]> = await instance.get(
      `/api/users/search?q=${encodeURIComponent(query)}`
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Error al buscar usuarios:", error);
    throw error;
  }
};


