import { instance } from "@/lib/axiosConfig";
import { AxiosResponse } from "axios";

export interface PostImage {
  image_id: number;
  src: string;
  content: string;
  created_at: string;
  user_id: number;
}

export interface Post {
  post_id: number;
  user_id: number;
  post_text: string;
  num_likes: number;
  num_comments: number;
  num_repost: number;
  tattoo_styles_id: number;
  created_at: string;
  user_handle?: string;
  first_name?: string;
  last_name?: string;
  image?: string;
  tattoo_style_name?: string;
  images?: PostImage[];
}

export interface TattooStyle {
  tattoo_styles_id: number;
  tattoo_styles_name: string;
}

export interface CreatePostData {
  post_text: string;
  tattoo_styles_id: number;
  image_urls?: string[];
}

// Crear un nuevo post
export const createPost = async (data: CreatePostData): Promise<Post> => {
  try {
    const response: AxiosResponse<Post> = await instance.post(
      "/api/posts",
      data
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Error al crear post:", error);
    throw error;
  }
};

// Obtener todos los posts (feed)
export const getAllPosts = async (): Promise<Post[]> => {
  try {
    // Logging para diagnóstico
    console.log("📡 Haciendo petición GET a /api/posts:", {
      baseURL: instance.defaults.baseURL,
      withCredentials: instance.defaults.withCredentials,
      hasCookies: document.cookie.length > 0,
      cookies: document.cookie.split(';').map(c => c.trim().split('=')[0]),
    });

    const response: AxiosResponse<Post[]> = await instance.get("/api/posts");
    console.log("✅ Posts obtenidos exitosamente:", response.data.length);
    return response.data;
  } catch (error: unknown) {
    console.error("❌ Error al obtener posts:", error);
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      console.error("Detalles del error:", {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        message: axiosError.message,
        cookiesEnviadas: document.cookie,
      });
    }
    throw error;
  }
};

// Obtener posts de un usuario específico
export const getUserPosts = async (userId: number): Promise<Post[]> => {
  try {
    const response: AxiosResponse<Post[]> = await instance.get(
      `/api/posts/user/${userId}`
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Error al obtener posts del usuario:", error);
    throw error;
  }
};

// Obtener estilos de tatuaje
export const getTattooStyles = async (): Promise<TattooStyle[]> => {
  try {
    const response: AxiosResponse<TattooStyle[]> = await instance.get(
      "/api/posts/styles"
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Error al obtener estilos de tatuaje:", error);
    throw error;
  }
};


