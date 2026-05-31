import { z } from 'zod';
import {
  CHAT_AUDIO_MIME_TYPES,
  CHAT_ATTACHMENT_AUDIO_MAX_DURATION_MS,
  CHAT_ATTACHMENT_AUDIO_MAX_SIZE_BYTES,
  CHAT_ATTACHMENT_IMAGE_MAX_SIZE_BYTES,
  CHAT_ATTACHMENT_UPLOAD_MAX_FILE_SIZE_BYTES,
  CHAT_IMAGE_MIME_TYPES,
  CHAT_MESSAGE_DEFAULT_LIMIT,
  CHAT_MESSAGE_MAX_LIMIT,
} from './chat.constants';

const chatMessageContentSchema = z.string().max(2_000);

const nonEmptyChatMessageContentSchema = chatMessageContentSchema.refine((value) => value.trim().length > 0, {
  message: 'Message content is required',
});

const optionalPositiveIntegerSchema = z.preprocess(
  (value) => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }

    return value;
  },
  z.coerce.number().int().positive().optional(),
);

const chatAttachmentTypeSchema = z.enum(['image', 'audio']);
const chatMessageTypeSchema = z.enum(['text', 'image', 'audio']);

export const chatAttachmentSchema = z.object({
  id: z.string().trim().min(1).max(64),
  type: chatAttachmentTypeSchema,
  url: z.string().trim().min(1).max(512),
  mimeType: z.string().trim().min(1).max(191),
  fileName: z.string().trim().min(1).max(191),
  sizeBytes: z.number().int().positive().max(CHAT_ATTACHMENT_UPLOAD_MAX_FILE_SIZE_BYTES),
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
  durationMillis: z.number().int().positive().nullable(),
});

export const chatAttachmentUploadFieldsSchema = z
  .object({
    type: chatAttachmentTypeSchema,
    mimeType: z.string().trim().min(1).max(191),
    fileName: z.string().trim().min(1).max(191),
    sizeBytes: z.coerce.number().int().positive().max(CHAT_ATTACHMENT_UPLOAD_MAX_FILE_SIZE_BYTES),
    width: optionalPositiveIntegerSchema,
    height: optionalPositiveIntegerSchema,
    durationMillis: optionalPositiveIntegerSchema,
  })
  .superRefine((value, context) => {
    if (value.type === 'image') {
      if (!CHAT_IMAGE_MIME_TYPES.includes(value.mimeType as (typeof CHAT_IMAGE_MIME_TYPES)[number])) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['mimeType'],
          message: 'Unsupported image MIME type',
        });
      }

      if (value.sizeBytes > CHAT_ATTACHMENT_IMAGE_MAX_SIZE_BYTES) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['sizeBytes'],
          message: 'Image attachment exceeds the maximum size',
        });
      }

      return;
    }

    if (!CHAT_AUDIO_MIME_TYPES.includes(value.mimeType as (typeof CHAT_AUDIO_MIME_TYPES)[number])) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['mimeType'],
        message: 'Unsupported audio MIME type',
      });
    }

    if (!value.durationMillis) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['durationMillis'],
        message: 'Audio duration is required',
      });
    }

    if (value.durationMillis && value.durationMillis > CHAT_ATTACHMENT_AUDIO_MAX_DURATION_MS) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['durationMillis'],
        message: 'Audio attachment exceeds the maximum duration',
      });
    }

    if (value.sizeBytes > CHAT_ATTACHMENT_AUDIO_MAX_SIZE_BYTES) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['sizeBytes'],
        message: 'Audio attachment exceeds the maximum size',
      });
    }
  });

export const createChatMessageBodySchema = z
  .object({
    content: chatMessageContentSchema,
    type: chatMessageTypeSchema,
    attachments: z.array(chatAttachmentSchema).max(1).optional().default([]),
  })
  .superRefine((value, context) => {
    const trimmedContent = value.content.trim();

    if (value.type === 'text') {
      if (trimmedContent.length === 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['content'],
          message: 'Message content is required',
        });
      }

      if (value.attachments.length > 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['attachments'],
          message: 'Text messages cannot include attachments',
        });
      }

      return;
    }

    if (value.attachments.length !== 1) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['attachments'],
        message: 'Media messages require exactly one attachment',
      });
      return;
    }

    if (value.attachments[0]?.type !== value.type) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['attachments', 0, 'type'],
        message: 'Attachment type must match the message type',
      });
    }
  });

export const updateChatMessageBodySchema = z.object({
  content: nonEmptyChatMessageContentSchema,
});

export const listChatMessagesQuerySchema = z.object({
  before: z.string().trim().min(1).max(191).optional(),
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
