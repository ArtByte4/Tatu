import { Response } from "express";
import {
  getMessagesByUsers,
  getConversations,
  createMessage,
  getMessageById,
  getUserInfo,
} from "./messageModel";
import { CustomRequest } from "../user/middlewares/validateToken";

// Obtener lista de conversaciones del usuario autenticado
export const getConversationsList = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as { id: number };
    if (!user || !user.id) {
      res.status(401).json({ error: "Usuario no autenticado" });
      return;
    }

    const conversations = await getConversations(user.id);
    res.json(conversations);
  } catch (err) {
    console.error("Error al obtener conversaciones:", err);
    res.status(500).json({ error: "Error al obtener conversaciones" });
  }
};

// Obtener mensajes con un usuario específico
export const getMessagesWithUser = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as { id: number };
    if (!user || !user.id) {
      res.status(401).json({ error: "Usuario no autenticado" });
      return;
    }

    const otherUserId = parseInt(req.params.userId);
    if (isNaN(otherUserId)) {
      res.status(400).json({ error: "ID de usuario inválido" });
      return;
    }

    const messages = await getMessagesByUsers(user.id, otherUserId);
    
    // Obtener información del otro usuario
    const otherUserInfo = await getUserInfo(otherUserId);
    
    // Formatear información del usuario como Conversation
    const otherUser = otherUserInfo ? {
      user_id: otherUserInfo.user_id,
      first_name: otherUserInfo.first_name,
      last_name: otherUserInfo.last_name,
      image: otherUserInfo.image,
      user_handle: "",
      last_message: "",
      last_message_time: "",
    } : null;
    
    res.json({
      messages,
      otherUser,
    });
  } catch (err) {
    console.error("Error al obtener mensajes:", err);
    res.status(500).json({ error: "Error al obtener mensajes" });
  }
};

// Enviar un mensaje
export const sendMessage = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as { id: number };
    if (!user || !user.id) {
      res.status(401).json({ error: "Usuario no autenticado" });
      return;
    }

    const { receiver_id, content } = req.body;

    if (!receiver_id || !content) {
      res.status(400).json({ error: "receiver_id y content son requeridos" });
      return;
    }

    if (user.id === receiver_id) {
      res.status(400).json({ error: "No puedes enviarte mensajes a ti mismo" });
      return;
    }

    const result = await createMessage({
      sender_id: user.id,
      receiver_id,
      content,
    });

    const messageId = (result as any).insertId;
    const message = await getMessageById(messageId);

    res.status(201).json(message);
  } catch (err) {
    console.error("Error al enviar mensaje:", err);
    res.status(500).json({ error: "Error al enviar mensaje" });
  }
};

