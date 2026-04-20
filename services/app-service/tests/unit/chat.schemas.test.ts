import {
  createChatMessageBodySchema,
  listChatMessagesQuerySchema,
  updateChatMessageSocketSchema,
} from '../../src/modules/chat/chat.schemas';

describe('chat schemas', () => {
  it('accepts emoji messages', () => {
    const value = createChatMessageBodySchema.parse({
      content: 'Hello everyone 😊',
    });

    expect(value.content).toBe('Hello everyone 😊');
  });

  it('rejects whitespace-only messages', () => {
    const result = createChatMessageBodySchema.safeParse({
      content: '   ',
    });

    expect(result.success).toBe(false);
  });

  it('defaults the chat list limit', () => {
    const value = listChatMessagesQuerySchema.parse({});

    expect(value.limit).toBe(50);
  });

  it('requires a message id for socket updates', () => {
    const result = updateChatMessageSocketSchema.safeParse({
      content: 'Updated message',
    });

    expect(result.success).toBe(false);
  });
});
