import type { ChatMessage } from '@community/contracts';

jest.mock('../../src/modules/chat/chat.service', () => ({
  chatService: {
    createMessage: jest.fn(),
    deleteMessage: jest.fn(),
    listMessages: jest.fn(),
    updateMessage: jest.fn(),
    uploadAttachment: jest.fn(),
  },
}));

import fs from 'node:fs/promises';
import path from 'node:path';
import request from 'supertest';
import { app } from '../../src/app';
import { signAccessToken } from '../../src/lib/token';
import { chatService } from '../../src/modules/chat/chat.service';

const mockedChatService = jest.mocked(chatService);
const pngImageBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);
const tempUploadsDir = path.resolve(__dirname, '../../uploads/tmp/chat');

async function removeTempUploads(): Promise<void> {
  let fileNames: string[];

  try {
    fileNames = await fs.readdir(tempUploadsDir);
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    if (nodeError.code === 'ENOENT') {
      return;
    }

    throw error;
  }

  await Promise.all(
    fileNames.map(async (fileName) => {
      try {
        await fs.unlink(path.join(tempUploadsDir, fileName));
      } catch (error) {
        const nodeError = error as NodeJS.ErrnoException;

        if (!['EBUSY', 'ENOENT', 'EPERM'].includes(nodeError.code ?? '')) {
          throw error;
        }
      }
    }),
  );
}

function getAccessToken(): string {
  return signAccessToken({
    sub: 'user-123',
  });
}

function buildChatMessage(overrides: Partial<ChatMessage> = {}): ChatMessage {
  return {
    id: 'chat-message-1',
    type: 'text',
    content: 'Hello everyone ðŸ‘‹',
    attachments: [],
    authorId: 'user-123',
    authorName: 'Community Admin',
    createdAt: '2026-03-20T10:00:00.000Z',
    updatedAt: '2026-03-20T10:00:00.000Z',
    ...overrides,
  };
}

describe('chat routes', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(async () => {
    await removeTempUploads();
  });

  it('lists chat messages for authenticated users', async () => {
    mockedChatService.listMessages.mockResolvedValue([buildChatMessage()]);

    const response = await request(app)
      .get('/v1/chat/messages?limit=25&before=2026-03-21T00:00:00.000Z')
      .set('Authorization', `Bearer ${getAccessToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(mockedChatService.listMessages).toHaveBeenCalledWith({
      before: '2026-03-21T00:00:00.000Z',
      limit: 25,
    });
  });

  it('uploads a chat attachment', async () => {
    mockedChatService.uploadAttachment.mockResolvedValue({
      id: 'attachment-1',
      type: 'image' as const,
      url: '/uploads/chat/attachment-1.png',
      mimeType: 'image/png',
      fileName: 'chat-image.png',
      sizeBytes: pngImageBuffer.length,
      width: 1080,
      height: 1080,
      durationMillis: null,
    });

    const response = await request(app)
      .post('/v1/chat/attachments')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .field('type', 'image')
      .field('mimeType', 'image/png')
      .field('fileName', 'chat-image.png')
      .field('sizeBytes', String(pngImageBuffer.length))
      .field('width', '1080')
      .field('height', '1080')
      .attach('file', pngImageBuffer, {
        filename: 'chat-image.png',
        contentType: 'image/png',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe('attachment-1');
    expect(mockedChatService.uploadAttachment).toHaveBeenCalledWith(
      'user-123',
      expect.objectContaining({
        fields: expect.objectContaining({
          fileName: 'chat-image.png',
          mimeType: 'image/png',
          type: 'image',
        }),
        file: expect.objectContaining({
          mimetype: 'image/png',
        }),
      }),
    );
  });

  it('creates a text chat message', async () => {
    mockedChatService.createMessage.mockResolvedValue(buildChatMessage());

    const response = await request(app)
      .post('/v1/chat/messages')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .send({
        content: 'Hello everyone ðŸ‘‹',
        type: 'text',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(mockedChatService.createMessage).toHaveBeenCalledWith('user-123', {
      attachments: [],
      content: 'Hello everyone ðŸ‘‹',
      type: 'text',
    });
  });

  it('updates a chat message', async () => {
    mockedChatService.updateMessage.mockResolvedValue(
      buildChatMessage({
        content: 'Edited hello everyone ðŸ‘‹',
        updatedAt: '2026-03-20T10:05:00.000Z',
      }),
    );

    const response = await request(app)
      .patch('/v1/chat/messages/chat-message-1')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .send({
        content: 'Edited hello everyone ðŸ‘‹',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(mockedChatService.updateMessage).toHaveBeenCalledWith('user-123', 'chat-message-1', {
      content: 'Edited hello everyone ðŸ‘‹',
    });
  });

  it('deletes a chat message', async () => {
    mockedChatService.deleteMessage.mockResolvedValue({
      id: 'chat-message-1',
      deletedAt: '2026-03-20T10:10:00.000Z',
    });

    const response = await request(app)
      .delete('/v1/chat/messages/chat-message-1')
      .set('Authorization', `Bearer ${getAccessToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe('chat-message-1');
    expect(mockedChatService.deleteMessage).toHaveBeenCalledWith('user-123', 'chat-message-1');
  });

  it.each([
    ['GET', '/v1/chat/messages'],
    ['POST', '/v1/chat/messages'],
    ['PATCH', '/v1/chat/messages/chat-message-1'],
    ['DELETE', '/v1/chat/messages/chat-message-1'],
  ])('requires access token for chat route %s %s', async (method, routePath) => {
    const response = await request(app)[method.toLowerCase() as 'get' | 'post' | 'patch' | 'delete'](
      routePath,
    ).send({
      content: 'Hello everyone ðŸ‘‹',
      type: 'text',
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('UNAUTHORIZED');
  });

  it('requires access token for chat attachment uploads', async () => {
    const response = await request(app)
      .post('/v1/chat/attachments')
      .field('type', 'image')
      .field('mimeType', 'image/png')
      .field('fileName', 'chat-image.png')
      .field('sizeBytes', String(pngImageBuffer.length))
      .attach('file', pngImageBuffer, {
        filename: 'chat-image.png',
        contentType: 'image/png',
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('UNAUTHORIZED');
  });

  it('returns validation errors for invalid chat payloads', async () => {
    const response = await request(app)
      .post('/v1/chat/messages')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .send({
        content: '   ',
        type: 'text',
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('VALIDATION_ERROR');
  });

  it('returns validation errors when a chat attachment file is missing', async () => {
    const response = await request(app)
      .post('/v1/chat/attachments')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .field('type', 'image')
      .field('mimeType', 'image/png')
      .field('fileName', 'chat-image.png')
      .field('sizeBytes', String(pngImageBuffer.length));

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('VALIDATION_ERROR');
    expect(mockedChatService.uploadAttachment).not.toHaveBeenCalled();
  });

  it('returns validation errors when chat attachment uploads are not multipart', async () => {
    const response = await request(app)
      .post('/v1/chat/attachments')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .send({
        type: 'image',
        mimeType: 'image/png',
        fileName: 'chat-image.png',
        sizeBytes: pngImageBuffer.length,
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('VALIDATION_ERROR');
    expect(mockedChatService.uploadAttachment).not.toHaveBeenCalled();
  });
});
