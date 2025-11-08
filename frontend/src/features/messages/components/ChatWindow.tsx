import React, { useState, useRef, useEffect } from "react";
import { useMessageContext } from "../context/MessageProvider";
import { useAuthStore } from "@/stores/authStore";
import { AiOutlineLoading } from "react-icons/ai";
import "./../styles/ChatWindow.css";

interface ChatWindowProps {
  userId: number;
  userName: string;
  userImage: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  userId,
  userName,
  userImage,
}) => {
  const {
    messages,
    typingUsers,
    sendMessage,
    startTyping,
    stopTyping,
    loading,
  } = useMessageContext();
  const { user } = useAuthStore();
  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Filtrar mensajes de esta conversación
  const conversationMessages = messages.filter(
    (msg) =>
      (msg.sender_id === userId && msg.receiver_id === user?.id) ||
      (msg.sender_id === user?.id && msg.receiver_id === userId)
  );

  // Scroll automático al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);

    // Indicador de escritura
    if (!isTyping) {
      setIsTyping(true);
      startTyping(userId);
    }

    // Limpiar timeout anterior
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Timeout para dejar de escribir
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      stopTyping(userId);
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const content = messageText.trim();
    setMessageText("");

    // Dejar de escribir
    if (isTyping) {
      setIsTyping(false);
      stopTyping(userId);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    await sendMessage(userId, content);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isOtherUserTyping = typingUsers[userId] || false;

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-user">
          <img
            src={userImage || "/img/userDefault.png"}
            alt={userName}
            className="chat-header-avatar"
          />
          <div className="chat-header-info">
            <span className="chat-header-name">{userName}</span>
            {isOtherUserTyping && (
              <span className="chat-header-typing">escribiendo...</span>
            )}
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {loading && conversationMessages.length === 0 ? (
          <div className="chat-loading">
            <AiOutlineLoading className="chat-loading-icon" />
            <p>Cargando mensajes...</p>
          </div>
        ) : conversationMessages.length === 0 ? (
          <div className="chat-empty">No hay mensajes aún. ¡Comienza la conversación!</div>
        ) : (
          conversationMessages.map((message) => {
            const isOwnMessage = message.sender_id === user?.id;
            return (
              <div
                key={message.messages_id}
                className={`chat-message ${isOwnMessage ? "own" : "other"}`}
              >
                {!isOwnMessage && (
                  <img
                    src={userImage || "/img/userDefault.png"}
                    alt={userName}
                    className="chat-message-avatar"
                  />
                )}
                <div className="chat-message-content">
                  <p>{message.content}</p>
                  <span className="chat-message-time">
                    {formatTime(message.sent_at)}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chat-input"
          placeholder="Escribe un mensaje..."
          value={messageText}
          onChange={handleInputChange}
        />
        <button type="submit" className="chat-send-button" disabled={!messageText.trim()}>
          Enviar
        </button>
      </form>
    </div>
  );
};

