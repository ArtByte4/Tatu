interface UserProfile {
  user_id: number;
  user_handle: string;
  first_name: string;
  last_name: string;
  bio: string;
  birth_day: string; 
  follower_count: number;
  gender: string;
  image: string;
  role_id: number;
}

import { instance } from "@/lib/axiosConfig";
import { AxiosResponse } from "axios";

export const fetchUsers = async ():Promise<UserProfile[]> => {
  try {
    const response: AxiosResponse<UserProfile[]> = await instance.get("/api/users");
    return response.data;
  } catch (error: unknown) {
    console.error("Error al traer los usuarios:", error);
    throw error;
  }
};
