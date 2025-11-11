import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useSocket } from "../hooks/useSocket";
import { useMessages } from "../hooks/useMessages";
import { Message, Conversation } from "../api/messageApi";

interface MessageContextType {
  conversations: Conversation[];
  messages: Message[];
  selectedUserId: number | null;
  selectedUserInfo: Conversation | null;
  typingUsers: { [userId: number]: boolean };
  loading: boolean;
  error: string | null;
  selectUser: (userId: number) => void;
  sendMessage: (receiverId: number, content: string) => Promise<void>;
  startTyping: (receiverId: number) => void;
  stopTyping: (receiverId: number) => void;
  refreshConversations: () => Promise<void>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessageContext debe usarse dentro de MessageProvider");
  }
  return context;
};

interface MessageProviderProps {
  children: ReactNode;
}

export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  const {
    conversations,
    messages,
    selectedUserId,
    selectedUserInfo,
    loading,
    error,
    selectUser,
    sendMessageToUser,
    loadConversations,
  } = useMessages();

  const { startTyping: socketStartTyping, stopTyping: socketStopTyping, onTyping } = useSocket();
  const [typingUsers, setTypingUsers] = useState<{ [userId: number]: boolean }>({});

  // Manejar indicadores de escritura
  useEffect(() => {
    const handleTyping = (data: { userId: number; username: string; isTyping: boolean }) => {
      setTypingUsers((prev) => ({
        ...prev,
        [data.userId]: data.isTyping,
      }));

      // Limpiar después de 3 segundos si dejó de escribir
      if (!data.isTyping) {
        setTimeout(() => {
          setTypingUsers((prev) => {
            const updated = { ...prev };
            delete updated[data.userId];
            return updated;
          });
        }, 3000);
      }
    };

    onTyping(handleTyping);
  }, [onTyping]);

  const startTyping = useCallback(
    (receiverId: number) => {
      socketStartTyping(receiverId);
    },
    [socketStartTyping]
  );

  const stopTyping = useCallback(
    (receiverId: number) => {
      socketStopTyping(receiverId);
    },
    [socketStopTyping]
  );

  const sendMessage = useCallback(
    async (receiverId: number, content: string) => {
      await sendMessageToUser(receiverId, content);
    },
    [sendMessageToUser]
  );

  const refreshConversations = useCallback(async () => {
    await loadConversations();
  }, [loadConversations]);

  const value: MessageContextType = {
    conversations,
    messages,
    selectedUserId,
    selectedUserInfo,
    typingUsers,
    loading,
    error,
    selectUser,
    sendMessage,
    startTyping,
    stopTyping,
    refreshConversations,
  };

  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>;
};

