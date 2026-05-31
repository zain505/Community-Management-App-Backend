jest.mock('../../src/modules/chat/chat.service', () => ({
  chatService: {
    listMessages: jest.fn(),
  },
}));

jest.mock('../../src/modules/chat/chat.presence', () => ({
  trackChatPresence: jest.fn(),
  untrackChatPresence: jest.fn(),
  resetChatPresence: jest.fn(),
}));

import { trackChatPresence } from '../../src/modules/chat/chat.presence';
import { CHAT_MESSAGE_DEFAULT_LIMIT } from '../../src/modules/chat/chat.constants';
import { bootstrapChatConnection } from '../../src/modules/chat/chat.socket';
import { chatService } from '../../src/modules/chat/chat.service';

const mockedChatService = jest.mocked(chatService);
const mockedTrackChatPresence = jest.mocked(trackChatPresence);

type TestSocket = {
  connected: boolean;
  data: {
    userId: string;
    userName: string;
    presenceTracked: boolean;
  };
  emit: jest.Mock;
  id: string;
};

type TestNamespace = {
  emit: jest.Mock;
};

function buildChatMessage() {
  return {
    id: 'chat-message-1',
    type: 'text' as const,
    content: 'Hello neighbors',
    attachments: [],
    authorId: 'user-123',
    authorName: 'Community Admin',
    createdAt: '2026-03-20T10:00:00.000Z',
    updatedAt: '2026-03-20T10:00:00.000Z',
  };
}

describe('chat socket bootstrap', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('loads the snapshot before announcing presence and chat:connected', async () => {
    const messages = [buildChatMessage()];
    const socket: TestSocket = {
      connected: true,
      data: {
        userId: 'user-123',
        userName: 'Community Admin',
        presenceTracked: false,
      },
      emit: jest.fn(),
      id: 'socket-1',
    };
    const chatNamespace: TestNamespace = {
      emit: jest.fn(),
    };

    mockedChatService.listMessages.mockResolvedValue(messages);
    mockedTrackChatPresence.mockReturnValue({
      onlineMembers: 3,
    });

    const isReady = await bootstrapChatConnection(socket, chatNamespace);

    expect(isReady).toBe(true);
    expect(mockedChatService.listMessages).toHaveBeenCalledWith({
      limit: CHAT_MESSAGE_DEFAULT_LIMIT,
    });
    expect(mockedTrackChatPresence).toHaveBeenCalledWith('user-123', 'socket-1');
    expect(chatNamespace.emit).toHaveBeenCalledWith('chat:presence', {
      onlineMembers: 3,
    });
    expect(socket.emit).toHaveBeenCalledWith('chat:connected', {
      messages,
      onlineMembers: 3,
    });
    expect(socket.data.presenceTracked).toBe(true);
    expect(mockedChatService.listMessages.mock.invocationCallOrder[0]).toBeLessThan(
      mockedTrackChatPresence.mock.invocationCallOrder[0],
    );
    expect(mockedTrackChatPresence.mock.invocationCallOrder[0]).toBeLessThan(
      chatNamespace.emit.mock.invocationCallOrder[0],
    );
    expect(chatNamespace.emit.mock.invocationCallOrder[0]).toBeLessThan(socket.emit.mock.invocationCallOrder[0]);
  });

  it('does not mark presence when the socket disconnects before bootstrap completes', async () => {
    const messages = [buildChatMessage()];
    const socket: TestSocket = {
      connected: true,
      data: {
        userId: 'user-123',
        userName: 'Community Admin',
        presenceTracked: false,
      },
      emit: jest.fn(),
      id: 'socket-1',
    };
    const chatNamespace: TestNamespace = {
      emit: jest.fn(),
    };

    mockedChatService.listMessages.mockImplementation(async () => {
      socket.connected = false;
      return messages;
    });

    const isReady = await bootstrapChatConnection(socket, chatNamespace);

    expect(isReady).toBe(false);
    expect(mockedTrackChatPresence).not.toHaveBeenCalled();
    expect(chatNamespace.emit).not.toHaveBeenCalled();
    expect(socket.emit).not.toHaveBeenCalled();
    expect(socket.data.presenceTracked).toBe(false);
  });
});
