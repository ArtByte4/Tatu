import { useState, useCallback } from "react";
import { createPost, CreatePostData, Post } from "../api/postApi";

interface UseCreatePostState {
  loading: boolean;
  error: string | null;
  createNewPost: (data: CreatePostData) => Promise<Post | null>;
}

export const useCreatePost = (): UseCreatePostState => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createNewPost = useCallback(async (data: CreatePostData): Promise<Post | null> => {
    setLoading(true);
    setError(null);
    try {
      const newPost = await createPost(data);
      return newPost;
    } catch (err) {
      console.error("Error al crear post:", err);
      setError("Error al crear el post");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createNewPost,
  };
};



