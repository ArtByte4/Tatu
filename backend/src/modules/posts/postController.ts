import { Response } from "express";
import {
  createPost,
  getAllPosts,
  getPostsByUserId,
  getPostImages,
  getTattooStyles,
  getPostById,
} from "./postModel";
import { CustomRequest } from "../user/middlewares/validateToken";

// Crear un nuevo post
export const createPostHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as { id: number };
    if (!user || !user.id) {
      res.status(401).json({ error: "Usuario no autenticado" });
      return;
    }

    const { post_text, tattoo_styles_id, image_urls } = req.body;

    if (!post_text || !tattoo_styles_id) {
      res.status(400).json({ error: "post_text y tattoo_styles_id son requeridos" });
      return;
    }

    const postId = await createPost({
      user_id: user.id,
      post_text,
      tattoo_styles_id,
      image_urls: image_urls || [],
    });

    // Obtener el post creado con toda su información
    const post = await getPostById(postId);
    const images = await getPostImages(postId);

    res.status(201).json({
      ...post,
      images,
    });
  } catch (err) {
    console.error("Error al crear post:", err);
    res.status(500).json({ error: "Error al crear post" });
  }
};

// Obtener todos los posts (feed)
export const getAllPostsHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const posts = await getAllPosts();

    // Obtener imágenes para cada post
    const postsWithImages = await Promise.all(
      posts.map(async (post) => {
        const images = await getPostImages(post.post_id);
        return {
          ...post,
          images,
        };
      })
    );

    res.json(postsWithImages);
  } catch (err) {
    console.error("Error al obtener posts:", err);
    res.status(500).json({ error: "Error al obtener posts" });
  }
};

// Obtener posts de un usuario específico
export const getUserPostsHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      res.status(400).json({ error: "ID de usuario inválido" });
      return;
    }

    const posts = await getPostsByUserId(userId);

    // Obtener imágenes para cada post
    const postsWithImages = await Promise.all(
      posts.map(async (post) => {
        const images = await getPostImages(post.post_id);
        return {
          ...post,
          images,
        };
      })
    );

    res.json(postsWithImages);
  } catch (err) {
    console.error("Error al obtener posts del usuario:", err);
    res.status(500).json({ error: "Error al obtener posts del usuario" });
  }
};

// Obtener estilos de tatuaje
export const getTattooStylesHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const styles = await getTattooStyles();
    res.json(styles);
  } catch (err) {
    console.error("Error al obtener estilos de tatuaje:", err);
    res.status(500).json({ error: "Error al obtener estilos de tatuaje" });
  }
};



