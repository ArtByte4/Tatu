import { instance } from "@/lib/axiosConfig";
import { AxiosResponse } from "axios";
import { Post } from "@/features/posts/api/postApi";

// Obtener posts filtrados por estilo de tatuaje
export const getPostsByStyle = async (styleId?: number): Promise<Post[]> => {
  try {
    const url = styleId 
      ? `/api/posts?style=${styleId}`
      : `/api/posts`;
    
    const response: AxiosResponse<Post[]> = await instance.get(url);
    return response.data;
  } catch (error: unknown) {
    console.error("Error al obtener posts filtrados:", error);
    throw error;
  }
};

