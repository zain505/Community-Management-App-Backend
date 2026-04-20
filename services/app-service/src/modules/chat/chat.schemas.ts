import { z } from 'zod';
import { CHAT_MESSAGE_DEFAULT_LIMIT, CHAT_MESSAGE_MAX_LIMIT } from './chat.constants';

const chatMessageContentSchema = z
  .string()
  .min(1)
  .max(2_000)
  .refine((value) => value.trim().length > 0, {
    message: 'Message content is required',
  });

const isoDateTimeStringSchema = z.string().trim().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: 'Expected a valid ISO datetime value',
});

export const createChatMessageBodySchema = z.object({
  content: chatMessageContentSchema,
});

export const updateChatMessageBodySchema = z.object({
  content: chatMessageContentSchema,
});

export const listChatMessagesQuerySchema = z.object({
  before: isoDateTimeStringSchema.optional(),
  limit: z.coerce.number().int().positive().max(CHAT_MESSAGE_MAX_LIMIT).default(CHAT_MESSAGE_DEFAULT_LIMIT),
});

export const chatMessageIdParamSchema = z.object({
  id: z.string().trim().min(1).max(64),
});

export const createChatMessageSocketSchema = createChatMessageBodySchema;

export const updateChatMessageSocketSchema = z.object({
  messageId: z.string().trim().min(1).max(64),
  content: chatMessageContentSchema,
});

export const deleteChatMessageSocketSchema = z.object({
  messageId: z.string().trim().min(1).max(64),
});
