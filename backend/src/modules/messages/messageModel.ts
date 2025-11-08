import connection from "../../db";

export interface Message {
  messages_id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  sent_at: Date;
}

export interface Conversation {
  user_id: number;
  user_handle: string;
  first_name: string;
  last_name: string;
  image: string;
  last_message: string;
  last_message_time: Date;
  unread_count?: number;
}

export interface NewMessageInput {
  sender_id: number;
  receiver_id: number;
  content: string;
}

// Obtener mensajes entre dos usuarios
export const getMessagesByUsers = async (
  userId1: number,
  userId2: number
): Promise<Message[]> => {
  const query = `
    SELECT 
      messages_id,
      sender_id,
      receiver_id,
      content,
      sent_at
    FROM messages
    WHERE (sender_id = ? AND receiver_id = ?) 
       OR (sender_id = ? AND receiver_id = ?)
    ORDER BY sent_at ASC
  `;

  try {
    const [rows] = await connection.query(query, [
      userId1,
      userId2,
      userId2,
      userId1,
    ]);
    return rows as Message[];
  } catch (err) {
    console.error("Error al obtener mensajes:", err);
    throw err;
  }
};

// Obtener lista de conversaciones para un usuario
export const getConversations = async (
  userId: number
): Promise<Conversation[]> => {
  const query = `
    SELECT DISTINCT
      u.user_id,
      u.user_handle,
      u.first_name,
      u.last_name,
      p.image,
      (
        SELECT m.content
        FROM messages m
        WHERE (m.sender_id = ? AND m.receiver_id = u.user_id)
           OR (m.sender_id = u.user_id AND m.receiver_id = ?)
        ORDER BY m.sent_at DESC
        LIMIT 1
      ) as last_message,
      (
        SELECT m.sent_at
        FROM messages m
        WHERE (m.sender_id = ? AND m.receiver_id = u.user_id)
           OR (m.sender_id = u.user_id AND m.receiver_id = ?)
        ORDER BY m.sent_at DESC
        LIMIT 1
      ) as last_message_time
    FROM users u
    JOIN profile p ON p.user_id = u.user_id
    WHERE u.user_id IN (
      SELECT DISTINCT sender_id FROM messages WHERE receiver_id = ?
      UNION
      SELECT DISTINCT receiver_id FROM messages WHERE sender_id = ?
    )
    AND u.user_id != ?
    ORDER BY last_message_time DESC
  `;

  try {
    const [rows] = await connection.query(query, [
      userId,
      userId,
      userId,
      userId,
      userId,
      userId,
      userId,
    ]);
    return rows as Conversation[];
  } catch (err) {
    console.error("Error al obtener conversaciones:", err);
    throw err;
  }
};

// Crear nuevo mensaje
export const createMessage = async (
  messageData: NewMessageInput
): Promise<any> => {
  const { sender_id, receiver_id, content } = messageData;

  const query = `
    INSERT INTO messages (sender_id, receiver_id, content)
    VALUES (?, ?, ?)
  `;

  try {
    const [result] = await connection.query(query, [
      sender_id,
      receiver_id,
      content,
    ]);
    return result;
  } catch (err) {
    console.error("Error al crear mensaje:", err);
    throw err;
  }
};

// Obtener un mensaje por ID
export const getMessageById = async (
  messageId: number
): Promise<Message | undefined> => {
  const query = `
    SELECT 
      messages_id,
      sender_id,
      receiver_id,
      content,
      sent_at
    FROM messages
    WHERE messages_id = ?
  `;

  try {
    const [rows] = await connection.query(query, [messageId]);
    const messages = rows as Message[];
    return messages[0];
  } catch (err) {
    console.error("Error al obtener mensaje:", err);
    throw err;
  }
};

// Obtener información básica de un usuario
export const getUserInfo = async (
  userId: number
): Promise<{ user_id: number; first_name: string; last_name: string; image: string } | undefined> => {
  const query = `
    SELECT 
      u.user_id,
      u.first_name,
      u.last_name,
      p.image
    FROM users u
    JOIN profile p ON p.user_id = u.user_id
    WHERE u.user_id = ?
  `;

  try {
    const [rows] = await connection.query(query, [userId]);
    const users = rows as Array<{ user_id: number; first_name: string; last_name: string; image: string }>;
    return users[0];
  } catch (err) {
    console.error("Error al obtener información del usuario:", err);
    throw err;
  }
};

