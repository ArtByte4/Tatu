import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useMessages } from './useMessages';
import * as messageApi from '../api/messageApi';
import { useSocket } from './useSocket';

vi.mock('../api/messageApi');
vi.mock('./useSocket');

const mockedUseSocket = vi.mocked(useSocket);
const mockedGetConversations = vi.mocked(messageApi.getConversations);
const mockedGetMessages = vi.mocked(messageApi.getMessages);
const mockedSendMessage = vi.mocked(messageApi.sendMessage);

const socketMock = {
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn(),
};

describe('useMessages hook', () => {
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

  it('should load conversations on mount and update state', async () => {
    const conversations = [
      {
        user_id: 1,
        user_handle: 'juan',
        first_name: 'Juan',
        last_name: 'Perez',
        image: 'https://example.com/avatar.jpg',
        last_message: 'Hola',
        last_message_time: '2026-04-08T12:00:00Z',
      },
    ];

    mockedGetConversations.mockResolvedValue(conversations);

    const { result } = renderHook(() => useMessages());

    await waitFor(() => {
      expect(result.current.conversations).toEqual(conversations);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it('should load messages and select user info when loadMessages is called', async () => {
    const otherUser = {
      user_id: 2,
      user_handle: 'maria',
      first_name: 'Maria',
      last_name: 'Gomez',
      image: 'https://example.com/avatar2.jpg',
      last_message: 'Adios',
      last_message_time: '2026-04-08T12:10:00Z',
    };

    const messages = [
      {
        messages_id: 10,
        sender_id: 2,
        receiver_id: 1,
        content: 'Hola Maria',
        sent_at: '2026-04-08T12:05:00Z',
      },
    ];

    mockedGetConversations.mockResolvedValue([]);
    mockedGetMessages.mockResolvedValue({ messages, otherUser });
    mockedUseSocket.mockReturnValue({
      socket: socketMock as any,
      isConnected: true,
      sendMessage: vi.fn(),
      joinConversation: vi.fn(),
      startTyping: vi.fn(),
      stopTyping: vi.fn(),
      onMessage: vi.fn(),
      onTyping: vi.fn(),
    });

    const { result } = renderHook(() => useMessages());

    await act(async () => {
      await result.current.loadMessages(2);
    });

    await waitFor(() => {
      expect(result.current.messages).toEqual(messages);
      expect(result.current.selectedUserInfo).toEqual(otherUser);
      expect(result.current.conversations).toContainEqual(otherUser);
    });
  });

  it('should send message via REST fallback when socket is disconnected', async () => {
    const newMessage = {
      messages_id: 20,
      sender_id: 1,
      receiver_id: 3,
      content: 'Hola de prueba',
      sent_at: '2026-04-08T12:20:00Z',
    };

    mockedGetConversations.mockResolvedValue([]);
    mockedSendMessage.mockResolvedValue(newMessage);
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

    const { result } = renderHook(() => useMessages());

    await act(async () => {
      await result.current.sendMessageToUser(3, 'Hola de prueba');
    });

    expect(result.current.messages).toContainEqual(newMessage);
  });
});
