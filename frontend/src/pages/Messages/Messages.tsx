import React, { useEffect, useRef } from "react";
import { MessageProvider, useMessageContext, ConversationList, ChatWindow } from "@/features/messages";
import { Nav } from "@/features/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useSearchParams } from "react-router-dom";
import "./Messages.css";

const MessagesContent: React.FC = () => {
  const { selectedUserId, conversations, selectedUserInfo, selectUser, loading } = useMessageContext();
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const hasInitialized = useRef(false);

  // Leer userId de query params solo en el montaje inicial
  useEffect(() => {
    if (!hasInitialized.current) {
      const userIdParam = searchParams.get("userId");
      if (userIdParam) {
        const userId = parseInt(userIdParam);
        if (!isNaN(userId)) {
          selectUser(userId);
        }
      }
      hasInitialized.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez en el montaje

  // Actualizar URL cuando se selecciona un usuario (desde panel o programáticamente)
  useEffect(() => {
    if (hasInitialized.current && selectedUserId) {
      const currentUserId = searchParams.get("userId");
      if (currentUserId !== selectedUserId.toString()) {
        setSearchParams({ userId: selectedUserId.toString() }, { replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserId]);

  // Buscar conversación existente o usar información del usuario seleccionado
  const selectedConversation = conversations.find(
    (conv) => conv.user_id === selectedUserId
  ) || selectedUserInfo;

  return (
    <div className="container_messages_page">
      <div className="sidebar">
        <Nav optionsAdmin={user?.rol === 3} />
      </div>
      <div className="messages-page">
        <div className="messages-container">
          <ConversationList />
          {selectedUserId && selectedConversation ? (
            <ChatWindow
              userId={selectedConversation.user_id}
              userName={`${selectedConversation.first_name} ${selectedConversation.last_name || ""}`.trim()}
              userImage={selectedConversation.image}
            />
          ) : selectedUserId && loading ? (
            <div className="messages-empty">
              <p>Cargando conversación...</p>
            </div>
          ) : selectedUserId ? (
            <div className="messages-empty">
              <p>Cargando información del usuario...</p>
            </div>
          ) : (
            <div className="messages-empty">
              <p>Selecciona una conversación para comenzar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Messages: React.FC = () => {
  return (
    <MessageProvider>
      <MessagesContent />
    </MessageProvider>
  );
};

