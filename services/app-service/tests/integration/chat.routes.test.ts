jest.mock('../../src/modules/chat/chat.service', () => ({
  chatService: {
    createMessage: jest.fn(),
    deleteMessage: jest.fn(),
    listMessages: jest.fn(),
    updateMessage: jest.fn(),
  },
}));

import request from 'supertest';
import { app } from '../../src/app';
import { signAccessToken } from '../../src/lib/token';
import { chatService } from '../../src/modules/chat/chat.service';

const mockedChatService = jest.mocked(chatService);

function getAccessToken(): string {
  return signAccessToken({
    sub: 'user-123',
  });
}

describe('chat routes', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('lists chat messages for authenticated users', async () => {
    mockedChatService.listMessages.mockResolvedValue([
      {
        id: 'chat-message-1',
        content: 'Hello everyone 👋',
        authorId: 'user-123',
        authorName: 'Community Admin',
        createdAt: '2026-03-20T10:00:00.000Z',
        updatedAt: '2026-03-20T10:00:00.000Z',
      },
    ]);

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

  it('creates a chat message', async () => {
    mockedChatService.createMessage.mockResolvedValue({
      id: 'chat-message-1',
      content: 'Hello everyone 👋',
      authorId: 'user-123',
      authorName: 'Community Admin',
      createdAt: '2026-03-20T10:00:00.000Z',
      updatedAt: '2026-03-20T10:00:00.000Z',
    });

    const response = await request(app)
      .post('/v1/chat/messages')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .send({
        content: 'Hello everyone 👋',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(mockedChatService.createMessage).toHaveBeenCalledWith('user-123', {
      content: 'Hello everyone 👋',
    });
  });

  it('updates a chat message', async () => {
    mockedChatService.updateMessage.mockResolvedValue({
      id: 'chat-message-1',
      content: 'Edited hello everyone 👋',
      authorId: 'user-123',
      authorName: 'Community Admin',
      createdAt: '2026-03-20T10:00:00.000Z',
      updatedAt: '2026-03-20T10:05:00.000Z',
    });

    const response = await request(app)
      .patch('/v1/chat/messages/chat-message-1')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .send({
        content: 'Edited hello everyone 👋',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(mockedChatService.updateMessage).toHaveBeenCalledWith('user-123', 'chat-message-1', {
      content: 'Edited hello everyone 👋',
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
  ])('requires access token for chat route %s %s', async (method, path) => {
    const response = await request(app)[method.toLowerCase() as 'get' | 'post' | 'patch' | 'delete'](path).send({
      content: 'Hello everyone 👋',
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
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('VALIDATION_ERROR');
  });
});
