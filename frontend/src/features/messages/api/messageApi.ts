import { instance } from "@/lib/axiosConfig";
import { AxiosResponse } from "axios";

export interface Message {
  messages_id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  sent_at: string;
}

export interface Conversation {
  user_id: number;
  user_handle: string;
  first_name: string;
  last_name: string;
  image: string;
  last_message: string;
  last_message_time: string;
  unread_count?: number;
}

export interface SendMessageData {
  receiver_id: number;
  content: string;
}

// Obtener lista de conversaciones
export const getConversations = async (): Promise<Conversation[]> => {
  try {
    const response: AxiosResponse<Conversation[]> = await instance.get(
      "/api/messages/conversations"
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Error al obtener conversaciones:", error);
    throw error;
  }
};

// Obtener mensajes con un usuario específico
export const getMessages = async (userId: number): Promise<{ messages: Message[]; otherUser: Conversation | null }> => {
  try {
    const response: AxiosResponse<{ messages: Message[]; otherUser: Conversation | null }> = await instance.get(
      `/api/messages/${userId}`
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Error al obtener mensajes:", error);
    throw error;
  }
};

// Enviar un mensaje
export const sendMessage = async (
  data: SendMessageData
): Promise<Message> => {
  try {
    const response: AxiosResponse<Message> = await instance.post(
      "/api/messages",
      data
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Error al enviar mensaje:", error);
    throw error;
  }
};

