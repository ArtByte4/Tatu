import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MessageProvider } from '../context/MessageProvider';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';
import * as messageApi from '../api/messageApi';
import { useSocket } from '../hooks/useSocket';

vi.mock('../api/messageApi');
vi.mock('../hooks/useSocket');
vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({
    user: { id: 1, username: 'testuser' },
  }),
}));

const mockedGetConversations = vi.mocked(messageApi.getConversations);
const mockedGetMessages = vi.mocked(messageApi.getMessages);
const mockedSendMessage = vi.mocked(messageApi.sendMessage);
const mockedUseSocket = vi.mocked(useSocket);

const socketMock = {
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn(),
};

const renderMessagesApp = () => {
  return render(
    <MessageProvider>
      <div style={{ display: 'flex', gap: '16px' }}>
        <ConversationList />
        <ChatWindow userId={2} userName="Maria Gomez" userImage="https://example.com/maria.jpg" />
      </div>
    </MessageProvider>
  );
};

describe('Messages integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseSocket.mockReturnValue({
      socket: socketMock as any,
      isConnected: false,
      sendMessage: vi.fn(),
      joinConversation: vi.fn(),
      startTyping: vi.fn(),
      stopTyping: vi.fn(),
      onMessage: vi.fn(),
      onTyping: vi.fn(),
    });
  });

  it('carga conversaciones al montar y muestra la lista', async () => {
    const conversations = [
      {
        user_id: 2,
        user_handle: 'maria',
        first_name: 'Maria',
        last_name: 'Gomez',
        image: 'https://example.com/maria.jpg',
        last_message: 'Hola',
        last_message_time: '2026-04-08T12:00:00Z',
      },
    ];

    mockedGetConversations.mockResolvedValue(conversations);
    mockedGetMessages.mockResolvedValue({ messages: [], otherUser: null });

    renderMessagesApp();

    await waitFor(() => {
      expect(screen.getByText('Maria Gomez')).toBeInTheDocument();
    });

    expect(screen.getByText('Mensajes')).toBeInTheDocument();
    expect(screen.getByText('Hola')).toBeInTheDocument();
  });

  it('al seleccionar conversación carga mensajes y permite enviar uno nuevo', async () => {
    const conversations = [
      {
        user_id: 2,
        user_handle: 'maria',
        first_name: 'Maria',
        last_name: 'Gomez',
        image: 'https://example.com/maria.jpg',
        last_message: 'Hola',
        last_message_time: '2026-04-08T12:00:00Z',
      },
    ];

    const messages = [
      {
        messages_id: 1,
        sender_id: 2,
        receiver_id: 1,
        content: 'Hola, ¿cómo estás?',
        sent_at: '2026-04-08T12:01:00Z',
      },
    ];

    mockedGetConversations.mockResolvedValue(conversations);
    mockedGetMessages.mockResolvedValue({ messages, otherUser: conversations[0] });
    mockedSendMessage.mockResolvedValue({
      messages_id: 2,
      sender_id: 1,
      receiver_id: 2,
      content: 'Estoy bien, gracias',
      sent_at: '2026-04-08T12:05:00Z',
    });

    renderMessagesApp();
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText('Maria Gomez')).toBeInTheDocument();
    });

    // Hacer clic en el item de conversación (no en el header del chat)
    const conversationItem = screen.getAllByText('Maria Gomez')[0].closest('.conversation-item');
    if (conversationItem) {
      await user.click(conversationItem);
    }

    await waitFor(() => {
      expect(screen.getByText('Hola, ¿cómo estás?')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Escribe un mensaje...');
    await user.type(input, 'Estoy bien, gracias');
    await user.click(screen.getByRole('button', { name: /Enviar/i }));

    await waitFor(() => {
      expect(screen.getByText('Estoy bien, gracias')).toBeInTheDocument();
    });
  });
});
