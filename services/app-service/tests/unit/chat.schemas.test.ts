import {
  createChatMessageBodySchema,
  listChatMessagesQuerySchema,
  updateChatMessageSocketSchema,
} from '../../src/modules/chat/chat.schemas';

function buildImageAttachment() {
  return {
    id: 'attachment-1',
    type: 'image' as const,
    url: '/uploads/chat/attachment-1.png',
    mimeType: 'image/png',
    fileName: 'chat-image.png',
    sizeBytes: 1234,
    width: 1080,
    height: 1080,
    durationMillis: null,
  };
}

describe('chat schemas', () => {
  it('accepts emoji text messages', () => {
    const value = createChatMessageBodySchema.parse({
      content: 'Hello everyone ðŸ˜Š',
      type: 'text',
    });

    expect(value.content).toBe('Hello everyone ðŸ˜Š');
  });

  it('allows empty captions on image messages', () => {
    const value = createChatMessageBodySchema.parse({
      content: '   ',
      type: 'image',
      attachments: [buildImageAttachment()],
    });

    expect(value.attachments).toHaveLength(1);
  });

  it('rejects whitespace-only text messages', () => {
    const result = createChatMessageBodySchema.safeParse({
      content: '   ',
      type: 'text',
    });

    expect(result.success).toBe(false);
  });

  it('rejects text messages with attachments', () => {
    const result = createChatMessageBodySchema.safeParse({
      content: 'Hello everyone',
      type: 'text',
      attachments: [buildImageAttachment()],
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
