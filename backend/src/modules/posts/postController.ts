import { Response } from "express";
import {
  createPost,
  getAllPosts,
  getPostsByUserId,
  getPostImages,
  getTattooStyles,
  getPostById,
  deletePost,
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

    if (!image_urls || !Array.isArray(image_urls) || image_urls.length === 0) {
      res.status(400).json({ error: "El post debe tener al menos una imagen" });
      return;
    }

    const postId = await createPost({
      user_id: user.id,
      post_text,
      tattoo_styles_id,
      image_urls,
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
    // Leer query parameter opcional para filtrar por estilo
    const styleParam = req.query.style as string | undefined;
    const tattoo_style_id = styleParam ? parseInt(styleParam, 10) : undefined;

    // Validar que el style_id sea un número válido si se proporciona
    if (styleParam && (isNaN(tattoo_style_id!) || tattoo_style_id! <= 0)) {
      res.status(400).json({ error: "ID de estilo de tatuaje inválido" });
      return;
    }

    const posts = await getAllPosts(tattoo_style_id);

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

// Eliminar un post
export const deletePostHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as { id: number };
    if (!user || !user.id) {
      res.status(401).json({ error: "Usuario no autenticado" });
      return;
    }

    const postId = parseInt(req.params.postId);
    if (isNaN(postId)) {
      res.status(400).json({ error: "ID de post inválido" });
      return;
    }

    await deletePost(postId, user.id);
    res.status(200).json({ message: "Post eliminado correctamente" });
  } catch (err: any) {
    console.error("Error al eliminar post:", err);
    if (err.message === "Post no encontrado") {
      res.status(404).json({ error: "Post no encontrado" });
    } else if (err.message === "No tienes permiso para eliminar este post") {
      res.status(403).json({ error: "No tienes permiso para eliminar este post" });
    } else {
      res.status(500).json({ error: "Error al eliminar post" });
    }
  }
};



