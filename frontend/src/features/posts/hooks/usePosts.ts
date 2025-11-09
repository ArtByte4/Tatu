import { useState, useCallback } from "react";
import { getAllPosts, getUserPosts, Post } from "../api/postApi";

interface UsePostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  fetchUserPosts: (userId: number) => Promise<void>;
}

export const usePosts = (): UsePostsState => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllPosts();
      setPosts(data);
    } catch (err) {
      console.error("Error al obtener posts:", err);
      // Verificar si es un error de autenticación
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as any;
        if (axiosError.response?.status === 401) {
          setError("No estás autenticado. Por favor, inicia sesión.");
          console.error("🔐 Error 401: Usuario no autenticado. Verifica que hayas iniciado sesión.");
        } else {
          setError("Error al cargar los posts");
        }
      } else {
        setError("Error al cargar los posts");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserPosts = useCallback(async (userId: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserPosts(userId);
      setPosts(data);
    } catch (err) {
      console.error("Error al obtener posts del usuario:", err);
      setError("Error al cargar los posts del usuario");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    fetchUserPosts,
  };
};


