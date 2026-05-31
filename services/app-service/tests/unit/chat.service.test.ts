import type { ChatAttachment, ManagedUserStatus, UserStatus, UserType } from '@community/contracts';

jest.mock('../../src/modules/chat/chat.repository', () => ({
  chatRepository: {
    createAttachmentUpload: jest.fn(),
    createMessage: jest.fn(),
    deleteById: jest.fn(),
    deleteOlderThan: jest.fn(),
    expireUnusedUploads: jest.fn(),
    findAttachmentsByIds: jest.fn(),
    findById: jest.fn(),
    findCursorById: jest.fn(),
    listRecent: jest.fn(),
    updateById: jest.fn(),
  },
}));

jest.mock('../../src/modules/auth/auth-client', () => ({
  authClient: {
    getManagedUserStatus: jest.fn(),
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

function buildAttachmentRecord(overrides: Record<string, unknown> = {}) {
  const createdAt = buildRecentDate();

  return {
    id: 'attachment-1',
    type: 'image' as const,
    url: '/uploads/chat/attachment-1.png',
    storagePath: 'E:\\Node Js\\Community-Management-App-Backend\\services\\app-service\\uploads\\chat\\attachment-1.png',
    mimeType: 'image/png',
    fileName: 'chat-image.png',
    sizeBytes: 824123,
    width: 1080,
    height: 1080,
    durationMillis: null,
    status: 'uploaded',
    expiresAt: new Date(Date.now() + DAY_IN_MS),
    consumedAt: null,
    createdAt,
    updatedAt: createdAt,
    createdByUserId: 'user-123',
    messageId: null,
    ...overrides,
  } as never;
}

function buildClientAttachment(overrides: Partial<ChatAttachment> = {}): ChatAttachment {
  return {
    id: 'attachment-1',
    type: 'image',
    url: '/uploads/chat/attachment-1.png',
    mimeType: 'image/png',
    fileName: 'chat-image.png',
    sizeBytes: 824123,
    width: 1080,
    height: 1080,
    durationMillis: null,
    ...overrides,
  };
}

function buildChatRecord(overrides: Record<string, unknown> = {}) {
  const createdAt = buildRecentDate();

  return {
    id: 'chat-message-1',
    type: 'text',
    content: 'Hello everyone',
    attachments: [],
    authorName: 'Community Admin',
    createdAt,
    updatedAt: createdAt,
    createdByUserId: 'user-123',
    ...overrides,
  } as never;
}

function buildActiveUser(overrides: Partial<UserStatus> = {}): UserStatus {
  return {
    id: 'user-123',
    mobileNumber: '+923001234567',
    name: 'Community Admin',
    profile: {
      image: null,
    },
    isActive: true,
    createdAt: '2026-03-15T09:00:00.000Z',
    ...overrides,
  };
}

function buildManagedUser(overrides: Partial<ManagedUserStatus> = {}): ManagedUserStatus {
  return {
    ...buildActiveUser(),
    usertype: 2 as UserType,
    ...overrides,
  };
}

describe('chat service', () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    mockedChatRepository.deleteOlderThan.mockResolvedValue({
      count: 0,
      attachments: [],
    });
    mockedChatRepository.expireUnusedUploads.mockResolvedValue([]);
    await chatService.cleanupExpiredMessages(true);
  });

  it('creates a text chat message for an active user', async () => {
    mockedAuthClient.getUserStatus.mockResolvedValue(buildActiveUser());
    mockedChatRepository.createMessage.mockResolvedValue(buildChatRecord());

    const result = await chatService.createMessage('user-123', {
      content: 'Hello neighbors ðŸ‘‹',
      type: 'text',
    });

    expect(mockedChatRepository.createMessage).toHaveBeenCalledWith({
      attachmentIds: [],
      authorName: 'Community Admin',
      content: 'Hello neighbors ðŸ‘‹',
      createdByUserId: 'user-123',
      type: 'text',
    });
    expect(result.authorName).toBe('Community Admin');
    expect(result.type).toBe('text');
    expect(result.attachments).toEqual([]);
  });

  it('creates an image chat message with an uploaded attachment', async () => {
    const uploadedAttachment = buildAttachmentRecord();
    const attachedMessage = buildChatRecord({
      type: 'image',
      content: '',
      attachments: [
        buildAttachmentRecord({
          status: 'attached',
          messageId: 'chat-message-1',
        }),
      ],
    });

    mockedAuthClient.getUserStatus.mockResolvedValue(buildActiveUser());
    mockedChatRepository.findAttachmentsByIds.mockResolvedValue([uploadedAttachment]);
    mockedChatRepository.createMessage.mockResolvedValue(attachedMessage);

    const result = await chatService.createMessage('user-123', {
      content: '   ',
      type: 'image',
      attachments: [buildClientAttachment()],
    });

    expect(mockedChatRepository.createMessage).toHaveBeenCalledWith({
      attachmentIds: ['attachment-1'],
      authorName: 'Community Admin',
      content: '',
      createdByUserId: 'user-123',
      type: 'image',
    });
    expect(result.type).toBe('image');
    expect(result.attachments).toHaveLength(1);
    expect(result.attachments[0]?.id).toBe('attachment-1');
  });

  it('rejects attachments that belong to another user', async () => {
    mockedAuthClient.getUserStatus.mockResolvedValue(buildActiveUser());
    mockedChatRepository.findAttachmentsByIds.mockResolvedValue([
      buildAttachmentRecord({
        createdByUserId: 'another-user',
      }),
    ]);

    await expect(
      chatService.createMessage('user-123', {
        content: '',
        type: 'image',
        attachments: [buildClientAttachment()],
      }),
    ).rejects.toMatchObject({
      code: 'CHAT_ATTACHMENT_OWNERSHIP_INVALID',
      statusCode: 403,
    });
  });

  it('blocks vulgar chat messages', async () => {
    await expect(
      chatService.createMessage('user-123', {
        content: 'This is shit',
        type: 'text',
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

  it('rejects editing media chat messages', async () => {
    mockedAuthClient.getUserStatus.mockResolvedValue(buildActiveUser());
    mockedChatRepository.findById.mockResolvedValue(
      buildChatRecord({
        type: 'image',
        attachments: [buildAttachmentRecord()],
      }),
    );

    await expect(
      chatService.updateMessage('user-123', 'chat-message-1', {
        content: 'Updated caption',
      }),
    ).rejects.toMatchObject({
      code: 'CHAT_MESSAGE_EDIT_NOT_ALLOWED',
      statusCode: 409,
    });
  });

  it('allows admins to delete other users chat messages', async () => {
    mockedAuthClient.getManagedUserStatus.mockResolvedValue(
      buildManagedUser({
        usertype: 1,
      }),
    );
    mockedChatRepository.findById.mockResolvedValue(
      buildChatRecord({
        createdByUserId: 'another-user',
        authorName: 'Another User',
      }),
    );
    mockedChatRepository.deleteById.mockResolvedValue(undefined);

    const result = await chatService.deleteMessage('user-123', 'chat-message-1');

    expect(mockedChatRepository.deleteById).toHaveBeenCalledWith('chat-message-1');
    expect(result.id).toBe('chat-message-1');
  });

  it('treats expired messages as unavailable', async () => {
    mockedAuthClient.getManagedUserStatus.mockResolvedValue(buildManagedUser());
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
