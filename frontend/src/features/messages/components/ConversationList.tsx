import React from "react";
import { useMessageContext } from "../context/MessageProvider";
import "./../styles/ConversationList.css";

export const ConversationList: React.FC = () => {
  const { conversations, selectedUserId, selectUser, loading } = useMessageContext();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Ahora";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="conversation-list">
        <div className="conversation-list-header">
          <h2>Mensajes</h2>
        </div>
        <div className="conversation-list-loading">Cargando conversaciones...</div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="conversation-list">
        <div className="conversation-list-header">
          <h2>Mensajes</h2>
        </div>
        <div className="conversation-list-empty">No tienes conversaciones aún</div>
      </div>
    );
  }

  return (
    <div className="conversation-list">
      <div className="conversation-list-header">
        <h2>Mensajes</h2>
      </div>
      <div className="conversation-list-items">
        {conversations.map((conversation) => (
          <div
            key={conversation.user_id}
            className={`conversation-item ${
              selectedUserId === conversation.user_id ? "active" : ""
            }`}
            onClick={() => selectUser(conversation.user_id)}
          >
            <div className="conversation-avatar">
              <img
                src={conversation.image || "/img/userDefault.png"}
                alt={conversation.user_handle}
              />
            </div>
            <div className="conversation-info">
              <div className="conversation-header-info">
                <span className="conversation-name">
                  {conversation.first_name} {conversation.last_name}
                </span>
                {conversation.last_message_time && (
                  <span className="conversation-time">
                    {formatTime(conversation.last_message_time)}
                  </span>
                )}
              </div>
              <div className="conversation-preview">
                {conversation.last_message || "Sin mensajes"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



