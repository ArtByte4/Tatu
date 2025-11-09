import { instance } from "@/lib/axiosConfig";
import { AxiosResponse } from "axios";

export interface Comment {
  comment_id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
  user_handle?: string;
  first_name?: string;
  last_name?: string;
  image?: string;
}

export interface CreateCommentData {
  content: string;
}

// Obtener comentarios de un post
export const getCommentsByPostId = async (postId: number): Promise<Comment[]> => {
  try {
    const response: AxiosResponse<Comment[]> = await instance.get(
      `/api/posts/${postId}/comments`
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Error al obtener comentarios:", error);
    throw error;
  }
};

// Crear un comentario
export const createComment = async (
  postId: number,
  data: CreateCommentData
): Promise<Comment> => {
  try {
    const response: AxiosResponse<Comment> = await instance.post(
      `/api/posts/${postId}/comments`,
      data
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Error al crear comentario:", error);
    throw error;
  }
};

// Eliminar un comentario
export const deleteComment = async (commentId: number): Promise<void> => {
  try {
    await instance.delete(`/api/comments/${commentId}`);
  } catch (error: unknown) {
    console.error("Error al eliminar comentario:", error);
    throw error;
  }
};

