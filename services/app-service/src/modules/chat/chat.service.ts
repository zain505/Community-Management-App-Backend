import fs from 'node:fs/promises';
import path from 'node:path';
import type {
  ChatAttachment,
  ChatMessage,
  ChatMessageDeleted,
  CreateChatMessageRequest,
  ManagedUserStatus,
  UpdateChatMessageRequest,
  UserStatus,
} from '@community/contracts';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { AppError } from '../../shared/app-error';
import { authClient } from '../auth/auth-client';
import {
  buildChatAttachmentDownloadPath,
  buildChatAttachmentPublicPath,
  buildStoredChatAttachmentFilename,
  chatAttachmentUploadDir,
  deleteFileIfPresent,
  ensureChatAttachmentUploadDirs,
} from './chat-attachment-storage';
import {
  CHAT_ATTACHMENT_AUDIO_MAX_DURATION_MS,
  CHAT_ATTACHMENT_AUDIO_MAX_SIZE_BYTES,
  CHAT_ATTACHMENT_IMAGE_MAX_SIZE_BYTES,
  CHAT_AUDIO_MIME_TYPES,
  CHAT_IMAGE_MIME_TYPES,
  CHAT_MESSAGE_CLEANUP_INTERVAL_MS,
  CHAT_MESSAGE_DEFAULT_LIMIT,
  getChatAttachmentExpiryDate,
  getChatRetentionCutoff,
  hasBlockedLanguage,
} from './chat.constants';
import {
  chatRepository,
  type ChatAttachmentCleanupRecord,
  type ChatAttachmentRecord,
  type ChatMessageCursorRecord,
  type ChatMessageRecord,
} from './chat.repository';
import { chatAttachmentUploadFieldsSchema } from './chat.schemas';

function toChatAttachment(attachment: ChatAttachmentRecord): ChatAttachment {
  return {
    id: attachment.id,
    type: attachment.type,
    url: attachment.url,
    downloadUrl: buildChatAttachmentDownloadPath(attachment.id),
    mimeType: attachment.mimeType,
    fileName: attachment.fileName,
    sizeBytes: attachment.sizeBytes,
    width: attachment.width,
    height: attachment.height,
    durationMillis: attachment.durationMillis,
  };
}

function toChatMessage(message: ChatMessageRecord): ChatMessage {
  return {
    id: message.id,
    type: message.type,
    content: message.content,
    attachments: message.attachments.map(toChatAttachment),
    authorId: message.createdByUserId,
    authorName: message.authorName,
    createdAt: message.createdAt.toISOString(),
    updatedAt: message.updatedAt.toISOString(),
  };
}

function throwChatMessageNotFound(): never {
  throw new AppError('Chat message not found', {
    statusCode: StatusCodes.NOT_FOUND,
    code: 'CHAT_MESSAGE_NOT_FOUND',
  });
}

function throwChatMessageForbidden(): never {
  throw new AppError('You can only manage your own chat messages', {
    statusCode: StatusCodes.FORBIDDEN,
    code: 'CHAT_MESSAGE_FORBIDDEN',
  });
}

function throwBlockedChatMessage(): never {
  throw new AppError('Message was removed because it violates community guidelines', {
    statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
    code: 'CHAT_MESSAGE_BLOCKED',
  });
}

function throwAttachmentInvalidType(message = 'Attachment type is not supported'): never {
  throw new AppError(message, {
    statusCode: StatusCodes.BAD_REQUEST,
    code: 'CHAT_ATTACHMENT_INVALID_TYPE',
  });
}

function throwAttachmentTooLarge(): never {
  throw new AppError('Attachment exceeds the maximum allowed size', {
    statusCode: StatusCodes.REQUEST_TOO_LONG,
    code: 'CHAT_ATTACHMENT_TOO_LARGE',
  });
}

function throwAudioTooLong(): never {
  throw new AppError('Audio attachment exceeds the maximum duration', {
    statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
    code: 'CHAT_AUDIO_TOO_LONG',
  });
}

function throwAttachmentNotFound(): never {
  throw new AppError('Attachment not found', {
    statusCode: StatusCodes.NOT_FOUND,
    code: 'CHAT_ATTACHMENT_NOT_FOUND',
  });
}

function throwAttachmentOwnershipInvalid(): never {
  throw new AppError('Attachment does not belong to the current user', {
    statusCode: StatusCodes.FORBIDDEN,
    code: 'CHAT_ATTACHMENT_OWNERSHIP_INVALID',
  });
}

function isPathInsideDirectory(filePath: string, directory: string): boolean {
  const relativePath = path.relative(directory, filePath);
  return relativePath.length === 0 || (!relativePath.startsWith('..') && !path.isAbsolute(relativePath));
}

function throwChatMessageEditNotAllowed(): never {
  throw new AppError('This chat message cannot be edited', {
    statusCode: StatusCodes.CONFLICT,
    code: 'CHAT_MESSAGE_EDIT_NOT_ALLOWED',
  });
}

function toValidationError(error: ZodError): AppError {
  return new AppError('Request validation failed', {
    statusCode: StatusCodes.BAD_REQUEST,
    code: 'VALIDATION_ERROR',
    details: error.flatten(),
  });
}

async function getActiveUser(userId: string): Promise<UserStatus> {
  const user = await authClient.getUserStatus(userId);

  if (!user || !user.isActive) {
    throw new AppError('User is not active', {
      statusCode: StatusCodes.UNAUTHORIZED,
      code: 'USER_INACTIVE',
    });
  }

  return user;
}

async function getManagedActiveUser(userId: string): Promise<ManagedUserStatus> {
  const user = await authClient.getManagedUserStatus(userId);

  if (!user || !user.isActive) {
    throw new AppError('User is not active', {
      statusCode: StatusCodes.UNAUTHORIZED,
      code: 'USER_INACTIVE',
    });
  }

  return user;
}

function assertAllowedChatMessage(content: string): void {
  if (content.length > 0 && hasBlockedLanguage(content)) {
    throwBlockedChatMessage();
  }
}

function assertEditableChatMessage(message: ChatMessageRecord): void {
  if (message.type !== 'text' || message.attachments.length > 0) {
    throwChatMessageEditNotAllowed();
  }
}

function normalizeChatMessageContent(content: string): string {
  return content.trim();
}

function isExpiredChatMessage(message: ChatMessageRecord | ChatMessageCursorRecord): boolean {
  return message.createdAt.getTime() < getChatRetentionCutoff().getTime();
}

function isExpiredAttachment(attachment: ChatAttachmentRecord): boolean {
  return attachment.expiresAt !== null && attachment.expiresAt.getTime() <= Date.now();
}

function isPrivilegedChatModerator(user: ManagedUserStatus): boolean {
  return user.usertype !== 2;
}

function normalizeAttachmentFileName(fileName: string): string {
  const sanitized = path.basename(fileName).replace(/[\r\n]/g, '').trim();
  return sanitized.length > 0 ? sanitized : 'attachment';
}

async function deleteAttachmentFiles(attachments: ChatAttachmentCleanupRecord[]): Promise<void> {
  const uniqueStoragePaths = [...new Set(attachments.map((attachment) => attachment.storagePath))];
  await Promise.all(uniqueStoragePaths.map((storagePath) => deleteFileIfPresent(storagePath)));
}

async function resolveBeforeCursor(before?: string): Promise<Date | undefined> {
  if (!before) {
    return undefined;
  }

  const parsedDate = new Date(before);

  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate;
  }

  const cursorMessage = await chatRepository.findCursorById(before);

  if (!cursorMessage || isExpiredChatMessage(cursorMessage)) {
    throw new AppError('Chat cursor is invalid', {
      statusCode: StatusCodes.BAD_REQUEST,
      code: 'VALIDATION_ERROR',
    });
  }

  return cursorMessage.createdAt;
}

async function resolveRequestedAttachments(
  userId: string,
  payload: CreateChatMessageRequest,
): Promise<ChatAttachmentRecord[]> {
  const requestedAttachments = payload.attachments ?? [];

  if (payload.type === 'text') {
    return [];
  }

  const attachmentIds = requestedAttachments.map((attachment) => attachment.id);
  const uniqueAttachmentIds = [...new Set(attachmentIds)];

  const storedAttachments = await chatRepository.findAttachmentsByIds(uniqueAttachmentIds);

  if (storedAttachments.length !== uniqueAttachmentIds.length) {
    throwAttachmentNotFound();
  }

  const attachmentsById = new Map(storedAttachments.map((attachment) => [attachment.id, attachment]));

  return attachmentIds.map((attachmentId) => {
    const attachment = attachmentsById.get(attachmentId);

    if (!attachment) {
      throwAttachmentNotFound();
    }

    if (attachment.createdByUserId !== userId) {
      throwAttachmentOwnershipInvalid();
    }

    if (attachment.status !== 'uploaded' || attachment.messageId !== null || isExpiredAttachment(attachment)) {
      throwAttachmentNotFound();
    }

    if (attachment.type !== payload.type) {
      throwAttachmentInvalidType('Attachment type must match the message type');
    }

    return attachment;
  });
}

let lastCleanupAt = 0;
let cleanupPromise: Promise<number> | null = null;

async function performCleanup(force = false): Promise<number> {
  const now = Date.now();

  if (!force && now - lastCleanupAt < CHAT_MESSAGE_CLEANUP_INTERVAL_MS) {
    return 0;
  }

  if (cleanupPromise) {
    return cleanupPromise;
  }

  cleanupPromise = (async () => {
    const [expiredUploads, expiredMessages] = await Promise.all([
      chatRepository.expireUnusedUploads(new Date()),
      chatRepository.deleteOlderThan(getChatRetentionCutoff()),
    ]);

    await Promise.all([
      deleteAttachmentFiles(expiredUploads),
      deleteAttachmentFiles(expiredMessages.attachments),
    ]);

    return expiredUploads.length + expiredMessages.count;
  })().finally(() => {
    lastCleanupAt = Date.now();
    cleanupPromise = null;
  });

  return cleanupPromise;
}

export const chatService = {
  async listMessages(options?: { before?: string; limit?: number }): Promise<ChatMessage[]> {
    await performCleanup();

    const beforeDate = await resolveBeforeCursor(options?.before);
    const messages = await chatRepository.listRecent({
      before: beforeDate,
      cutoff: getChatRetentionCutoff(),
      limit: options?.limit ?? CHAT_MESSAGE_DEFAULT_LIMIT,
    });

    return messages.reverse().map(toChatMessage);
  },

  async uploadAttachment(
    userId: string,
    upload: Express.UploadedChatAttachment,
  ): Promise<ChatAttachment> {
    await performCleanup();
    await getActiveUser(userId);

    const { file } = upload;
    let finalFilePath: string | null = null;

    try {
      const parsedFields = chatAttachmentUploadFieldsSchema.parse(upload.fields);
      const mimeType = file.mimetype?.trim() || parsedFields.mimeType;

      if (mimeType !== parsedFields.mimeType) {
        throwAttachmentInvalidType('Attachment MIME type does not match the uploaded file');
      }

      if (file.size <= 0) {
        throw new AppError('Attachment file is required', {
          statusCode: StatusCodes.BAD_REQUEST,
          code: 'VALIDATION_ERROR',
        });
      }

      if (parsedFields.type === 'image') {
        if (!CHAT_IMAGE_MIME_TYPES.includes(mimeType as (typeof CHAT_IMAGE_MIME_TYPES)[number])) {
          throwAttachmentInvalidType();
        }

        if (file.size > CHAT_ATTACHMENT_IMAGE_MAX_SIZE_BYTES) {
          throwAttachmentTooLarge();
        }
      } else {
        if (!CHAT_AUDIO_MIME_TYPES.includes(mimeType as (typeof CHAT_AUDIO_MIME_TYPES)[number])) {
          throwAttachmentInvalidType();
        }

        if (!parsedFields.durationMillis) {
          throw new AppError('Audio duration is required', {
            statusCode: StatusCodes.BAD_REQUEST,
            code: 'VALIDATION_ERROR',
          });
        }

        if (parsedFields.durationMillis > CHAT_ATTACHMENT_AUDIO_MAX_DURATION_MS) {
          throwAudioTooLong();
        }

        if (file.size > CHAT_ATTACHMENT_AUDIO_MAX_SIZE_BYTES) {
          throwAttachmentTooLarge();
        }
      }

      await ensureChatAttachmentUploadDirs();

      const storedFilename = buildStoredChatAttachmentFilename(parsedFields.type, mimeType);
      finalFilePath = path.join(chatAttachmentUploadDir, storedFilename);
      await fs.rename(file.filepath, finalFilePath);

      const attachment = await chatRepository.createAttachmentUpload({
        createdByUserId: userId,
        durationMillis: parsedFields.type === 'audio' ? parsedFields.durationMillis ?? null : null,
        expiresAt: getChatAttachmentExpiryDate(),
        fileName: normalizeAttachmentFileName(parsedFields.fileName),
        height: parsedFields.type === 'image' ? parsedFields.height ?? null : null,
        mimeType,
        sizeBytes: file.size,
        storagePath: finalFilePath,
        type: parsedFields.type,
        url: buildChatAttachmentPublicPath(storedFilename),
        width: parsedFields.type === 'image' ? parsedFields.width ?? null : null,
      });

      return toChatAttachment(attachment);
    } catch (error) {
      await Promise.all([
        deleteFileIfPresent(file.filepath),
        deleteFileIfPresent(finalFilePath),
      ]);

      if (error instanceof ZodError) {
        throw toValidationError(error);
      }

      throw error;
    }
  },

  async createMessage(userId: string, payload: CreateChatMessageRequest): Promise<ChatMessage> {
    await performCleanup();

    const normalizedContent = normalizeChatMessageContent(payload.content);
    assertAllowedChatMessage(normalizedContent);

    const [user, attachments] = await Promise.all([
      getActiveUser(userId),
      resolveRequestedAttachments(userId, payload),
    ]);

    const message = await chatRepository.createMessage({
      attachmentIds: attachments.map((attachment) => attachment.id),
      authorName: user.name,
      content: normalizedContent,
      createdByUserId: userId,
      type: payload.type,
    });

    return toChatMessage(message);
  },

  async getAttachmentDownload(
    userId: string,
    attachmentId: string,
  ): Promise<{ fileName: string; mimeType: string; storagePath: string; sizeBytes: number }> {
    await performCleanup();
    await getActiveUser(userId);

    const attachment = await chatRepository.findAttachmentById(attachmentId);

    if (!attachment || attachment.status === 'deleted' || attachment.status === 'expired') {
      throwAttachmentNotFound();
    }

    if (attachment.status === 'uploaded') {
      if (attachment.createdByUserId !== userId || attachment.messageId !== null || isExpiredAttachment(attachment)) {
        throwAttachmentNotFound();
      }
    } else if (attachment.status !== 'attached') {
      throwAttachmentNotFound();
    }

    const resolvedStoragePath = path.resolve(attachment.storagePath);

    if (!isPathInsideDirectory(resolvedStoragePath, chatAttachmentUploadDir)) {
      throwAttachmentNotFound();
    }

    try {
      await fs.access(resolvedStoragePath);
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;

      if (nodeError.code === 'ENOENT') {
        throwAttachmentNotFound();
      }

      throw error;
    }

    return {
      fileName: attachment.fileName,
      mimeType: attachment.mimeType,
      sizeBytes: attachment.sizeBytes,
      storagePath: resolvedStoragePath,
    };
  },

  async updateMessage(
    userId: string,
    messageId: string,
    payload: UpdateChatMessageRequest,
  ): Promise<ChatMessage> {
    await performCleanup();
    await getActiveUser(userId);

    const existingMessage = await chatRepository.findById(messageId);

    if (!existingMessage || isExpiredChatMessage(existingMessage)) {
      throwChatMessageNotFound();
    }

    if (existingMessage.createdByUserId !== userId) {
      throwChatMessageForbidden();
    }

    assertEditableChatMessage(existingMessage);

    const normalizedContent = normalizeChatMessageContent(payload.content);
    assertAllowedChatMessage(normalizedContent);

    const updatedMessage = await chatRepository.updateById(messageId, normalizedContent);
    return toChatMessage(updatedMessage);
  },

  async deleteMessage(userId: string, messageId: string): Promise<ChatMessageDeleted> {
    await performCleanup();

    const [requester, existingMessage] = await Promise.all([
      getManagedActiveUser(userId),
      chatRepository.findById(messageId),
    ]);

    if (!existingMessage || isExpiredChatMessage(existingMessage)) {
      throwChatMessageNotFound();
    }

    if (existingMessage.createdByUserId !== userId && !isPrivilegedChatModerator(requester)) {
      throwChatMessageForbidden();
    }

    await chatRepository.deleteById(messageId);
    await deleteAttachmentFiles(existingMessage.attachments);

    return {
      id: messageId,
      deletedAt: new Date().toISOString(),
    };
  },

  cleanupExpiredMessages(force = false): Promise<number> {
    return performCleanup(force);
  },
};
