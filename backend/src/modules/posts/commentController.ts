import { Response } from "express";
import {
  getCommentsByPostId,
  createComment,
  deleteComment,
} from "./commentModel";
import { CustomRequest } from "../user/middlewares/validateToken";

// Obtener comentarios de un post
export const getCommentsHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const postId = parseInt(req.params.postId);
    if (isNaN(postId)) {
      res.status(400).json({ error: "ID de post inválido" });
      return;
    }

    const comments = await getCommentsByPostId(postId);
    res.json(comments);
  } catch (err) {
    console.error("Error al obtener comentarios:", err);
    res.status(500).json({ error: "Error al obtener comentarios" });
  }
};

// Crear un comentario
export const createCommentHandler = async (
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

    const { content } = req.body;
    if (!content || typeof content !== "string" || content.trim().length === 0) {
      res.status(400).json({ error: "El contenido del comentario es requerido" });
      return;
    }

    const commentId = await createComment(postId, user.id, content.trim());

    // Obtener el comentario creado con información del usuario
    const comments = await getCommentsByPostId(postId);
    const newComment = comments.find(c => c.comment_id === commentId);

    res.status(201).json(newComment);
  } catch (err) {
    console.error("Error al crear comentario:", err);
    res.status(500).json({ error: "Error al crear comentario" });
  }
};

// Eliminar un comentario
export const deleteCommentHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as { id: number };
    if (!user || !user.id) {
      res.status(401).json({ error: "Usuario no autenticado" });
      return;
    }

    const commentId = parseInt(req.params.commentId);
    if (isNaN(commentId)) {
      res.status(400).json({ error: "ID de comentario inválido" });
      return;
    }

    await deleteComment(commentId, user.id);
    res.status(200).json({ message: "Comentario eliminado correctamente" });
  } catch (err: any) {
    console.error("Error al eliminar comentario:", err);
    if (err.message === "Comentario no encontrado") {
      res.status(404).json({ error: "Comentario no encontrado" });
    } else if (err.message === "No tienes permiso para eliminar este comentario") {
      res.status(403).json({ error: "No tienes permiso para eliminar este comentario" });
    } else {
      res.status(500).json({ error: "Error al eliminar comentario" });
    }
  }
};

