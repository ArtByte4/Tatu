import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { VITE_API_BASE_URL } from "@/lib/config";
import { Message } from "../api/messageApi";

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  sendMessage: (receiverId: number, content: string) => void;
  startTyping: (receiverId: number) => void;
  stopTyping: (receiverId: number) => void;
  onMessage: (callback: (message: Message) => void) => void;
  onTyping: (callback: (data: { userId: number; username: string; isTyping: boolean }) => void) => void;
  joinConversation: (otherUserId: number) => void;
}

export const useSocket = (): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const baseURL = VITE_API_BASE_URL || "http://localhost:3000";
    
    // Conectar Socket.io con credenciales (cookies se envían automáticamente)
    const newSocket = io(baseURL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("Conectado a Socket.io");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Desconectado de Socket.io");
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Error de conexión Socket.io:", error);
      setIsConnected(false);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.close();
      setSocket(null);
      setIsConnected(false);
    };
  }, []);

  const sendMessage = (receiverId: number, content: string) => {
    if (socket && isConnected) {
      socket.emit("send_message", { receiver_id: receiverId, content });
    }
  };

  const startTyping = (receiverId: number) => {
    if (socket && isConnected) {
      socket.emit("typing_start", { receiver_id: receiverId });
    }
  };

  const stopTyping = (receiverId: number) => {
    if (socket && isConnected) {
      socket.emit("typing_stop", { receiver_id: receiverId });
    }
  };

  const onMessage = (callback: (message: Message) => void) => {
    if (socket) {
      socket.on("new_message", callback);
      socket.on("message_sent", callback);
    }
  };

  const onTyping = (
    callback: (data: { userId: number; username: string; isTyping: boolean }) => void
  ) => {
    if (socket) {
      socket.on("user_typing", callback);
    }
  };

  const joinConversation = (otherUserId: number) => {
    if (socket && isConnected) {
      socket.emit("join_conversation", otherUserId);
    }
  };

  return {
    socket,
    isConnected,
    sendMessage,
    startTyping,
    stopTyping,
    onMessage,
    onTyping,
    joinConversation,
  };
};



