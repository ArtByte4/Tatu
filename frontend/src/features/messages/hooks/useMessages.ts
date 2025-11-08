import { useState, useEffect, useCallback } from "react";
import { getConversations, getMessages, sendMessage, Message, Conversation } from "../api/messageApi";
import { useSocket } from "./useSocket";

interface UseMessagesReturn {
  conversations: Conversation[];
  messages: Message[];
  selectedUserId: number | null;
  selectedUserInfo: Conversation | null;
  loading: boolean;
  error: string | null;
  loadConversations: () => Promise<void>;
  loadMessages: (userId: number) => Promise<void>;
  sendMessageToUser: (receiverId: number, content: string) => Promise<void>;
  selectUser: (userId: number) => void;
}

export const useMessages = (): UseMessagesReturn => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserInfo, setSelectedUserInfo] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { socket, isConnected, sendMessage: socketSendMessage, joinConversation } = useSocket();

  // Cargar conversaciones
  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getConversations();
      setConversations(data);
    } catch (err) {
      setError("Error al cargar conversaciones");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar mensajes con un usuario
  const loadMessages = useCallback(async (userId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMessages(userId);
      setMessages(data.messages);
      
      // Guardar información del usuario seleccionado
      if (data.otherUser) {
        setSelectedUserInfo(data.otherUser);
        
        // Si no está en conversaciones, agregarlo
        setConversations(prev => {
          // Evitar duplicados
          if (prev.find(c => c.user_id === userId)) {
            return prev;
          }
          return [...prev, data.otherUser!];
        });
      }
      
      // Unirse a la conversación en Socket.io
      if (isConnected) {
        joinConversation(userId);
      }
    } catch (err) {
      setError("Error al cargar mensajes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [isConnected, joinConversation]);

  // Enviar mensaje
  const sendMessageToUser = useCallback(async (receiverId: number, content: string) => {
    try {
      // Enviar por Socket.io si está conectado
      if (isConnected) {
        socketSendMessage(receiverId, content);
      } else {
        // Fallback a REST API
        const newMessage = await sendMessage({ receiver_id: receiverId, content });
        setMessages((prev) => [...prev, newMessage]);
      }
    } catch (err) {
      setError("Error al enviar mensaje");
      console.error(err);
    }
  }, [isConnected, socketSendMessage]);

  // Seleccionar usuario
  const selectUser = useCallback((userId: number) => {
    setSelectedUserId(userId);
    // Limpiar información previa mientras carga
    setSelectedUserInfo(null);
    loadMessages(userId);
  }, [loadMessages]);

  // Escuchar nuevos mensajes de Socket.io
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      // Si el mensaje es para la conversación actual, agregarlo
      if (
        selectedUserId &&
        (message.sender_id === selectedUserId || message.receiver_id === selectedUserId)
      ) {
        setMessages((prev) => {
          // Evitar duplicados
          if (prev.some((m) => m.messages_id === message.messages_id)) {
            return prev;
          }
          return [...prev, message];
        });
      }

      // Actualizar conversaciones solo si es necesario (debounce)
      setConversations(prev => {
        // Verificar si el mensaje afecta alguna conversación existente
        const affectedConversation = prev.find(
          c => c.user_id === message.sender_id || c.user_id === message.receiver_id
        );
        
        if (affectedConversation) {
          // Actualizar la conversación existente con el nuevo mensaje
          return prev.map(c => 
            (c.user_id === message.sender_id || c.user_id === message.receiver_id)
              ? { ...c, last_message: message.content, last_message_time: message.sent_at }
              : c
          );
        }
        
        return prev;
      });
    };

    socket.on("new_message", handleNewMessage);
    socket.on("message_sent", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("message_sent", handleNewMessage);
    };
  }, [socket, selectedUserId]);

  // Cargar conversaciones al montar
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    messages,
    selectedUserId,
    selectedUserInfo,
    loading,
    error,
    loadConversations,
    loadMessages,
    sendMessageToUser,
    selectUser,
  };
};

