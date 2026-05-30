jest.mock('../../src/modules/chat/chat.repository', () => ({
  chatRepository: {
    create: jest.fn(),
    deleteById: jest.fn(),
    deleteOlderThan: jest.fn(),
    findById: jest.fn(),
    listRecent: jest.fn(),
    updateById: jest.fn(),
  },
}));

jest.mock('../../src/modules/auth/auth-client', () => ({
  authClient: {
    getUserStatus: jest.fn(),
  },
}));

import { authClient } from '../../src/modules/auth/auth-client';
import { chatRepository } from '../../src/modules/chat/chat.repository';
import { chatService } from '../../src/modules/chat/chat.service';

const mockedAuthClient = jest.mocked(authClient);
const mockedChatRepository = jest.mocked(chatRepository);

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function buildRecentDate(daysAgo = 1) {
  return new Date(Date.now() - daysAgo * DAY_IN_MS);
}

function buildChatRecord(overrides: Record<string, unknown> = {}) {
  const createdAt = buildRecentDate();

  return {
    id: 'chat-message-1',
    content: 'Hello everyone',
    authorName: 'Community Admin',
    createdAt,
    updatedAt: createdAt,
    createdByUserId: 'user-123',
    ...overrides,
  } as never;
}

function buildActiveUser() {
  return {
    id: 'user-123',
    mobileNumber: '+923001234567',
    name: 'Community Admin',
    profile: {
      image: null,
    },
    isActive: true,
    createdAt: '2026-03-15T09:00:00.000Z',
  };
}

describe('chat service', () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    mockedChatRepository.deleteOlderThan.mockResolvedValue(0);
    await chatService.cleanupExpiredMessages(true);
  });

  it('creates a chat message for an active user', async () => {
    mockedAuthClient.getUserStatus.mockResolvedValue(buildActiveUser());
    mockedChatRepository.create.mockResolvedValue(buildChatRecord());

    const result = await chatService.createMessage('user-123', {
      content: 'Hello neighbors 👋',
    });

    expect(mockedChatRepository.create).toHaveBeenCalledWith('user-123', 'Community Admin', 'Hello neighbors 👋');
    expect(result.authorName).toBe('Community Admin');
  });

  it('blocks vulgar chat messages', async () => {
    await expect(
      chatService.createMessage('user-123', {
        content: 'This is shit',
      }),
    ).rejects.toMatchObject({
      code: 'CHAT_MESSAGE_BLOCKED',
      statusCode: 422,
    });
  });

  it('returns messages in chronological order', async () => {
    mockedChatRepository.listRecent.mockResolvedValue([
      buildChatRecord({
        id: 'chat-message-2',
        content: 'Second',
        createdAt: buildRecentDate(1),
      }),
      buildChatRecord({
        id: 'chat-message-1',
        content: 'First',
        createdAt: buildRecentDate(2),
      }),
    ]);

    const messages = await chatService.listMessages({ limit: 2 });

    expect(messages.map((message) => message.content)).toEqual(['First', 'Second']);
  });

  it("prevents users from updating someone else's message", async () => {
    mockedAuthClient.getUserStatus.mockResolvedValue(buildActiveUser());
    mockedChatRepository.findById.mockResolvedValue(
      buildChatRecord({
        createdByUserId: 'another-user',
        authorName: 'Another User',
      }),
    );

    await expect(
      chatService.updateMessage('user-123', 'chat-message-1', {
        content: 'Updated message',
      }),
    ).rejects.toMatchObject({
      code: 'CHAT_MESSAGE_FORBIDDEN',
      statusCode: 403,
    });
  });

  it('treats expired messages as unavailable', async () => {
    mockedAuthClient.getUserStatus.mockResolvedValue(buildActiveUser());
    mockedChatRepository.findById.mockResolvedValue(
      buildChatRecord({
        createdAt: buildRecentDate(45),
      }),
    );

    await expect(chatService.deleteMessage('user-123', 'chat-message-1')).rejects.toMatchObject({
      code: 'CHAT_MESSAGE_NOT_FOUND',
      statusCode: 404,
    });
  });
});
