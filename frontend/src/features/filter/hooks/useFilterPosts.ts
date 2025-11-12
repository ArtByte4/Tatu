import { useState, useCallback } from "react";
import { getPostsByStyle, Post } from "../api/filterApi";
import { getTattooStyles, TattooStyle } from "@/features/posts/api/postApi";

interface UseFilterPostsState {
  posts: Post[];
  styles: TattooStyle[];
  selectedStyle: number | null;
  loading: boolean;
  error: string | null;
  fetchPosts: (styleId?: number) => Promise<void>;
  fetchStyles: () => Promise<void>;
  setSelectedStyle: (styleId: number | null) => void;
}

export const useFilterPosts = (): UseFilterPostsState => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [styles, setStyles] = useState<TattooStyle[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async (styleId?: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPostsByStyle(styleId);
      setPosts(data);
    } catch (err) {
      console.error("Error al obtener posts filtrados:", err);
      setError("Error al cargar los posts");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStyles = useCallback(async (): Promise<void> => {
    try {
      const data = await getTattooStyles();
      setStyles(data);
    } catch (err) {
      console.error("Error al obtener estilos:", err);
    }
  }, []);

  const handleSetSelectedStyle = useCallback((styleId: number | null) => {
    setSelectedStyle(styleId);
  }, []);

  return {
    posts,
    styles,
    selectedStyle,
    loading,
    error,
    fetchPosts,
    fetchStyles,
    setSelectedStyle: handleSetSelectedStyle,
  };
};

