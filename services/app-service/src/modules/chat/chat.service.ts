import type {
  ChatMessage,
  ChatMessageDeleted,
  CreateChatMessageRequest,
  UpdateChatMessageRequest,
  UserStatus,
} from '@community/contracts';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../shared/app-error';
import { authClient } from '../auth/auth-client';
import {
  CHAT_MESSAGE_CLEANUP_INTERVAL_MS,
  CHAT_MESSAGE_DEFAULT_LIMIT,
  getChatRetentionCutoff,
  hasBlockedLanguage,
} from './chat.constants';
import { chatRepository, type ChatMessageRecord } from './chat.repository';

function toChatMessage(message: ChatMessageRecord): ChatMessage {
  return {
    id: message.id,
    content: message.content,
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

function assertAllowedChatMessage(content: string): void {
  if (hasBlockedLanguage(content)) {
    throwBlockedChatMessage();
  }
}

function isExpiredChatMessage(message: ChatMessageRecord): boolean {
  return message.createdAt.getTime() < getChatRetentionCutoff().getTime();
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

  cleanupPromise = chatRepository
    .deleteOlderThan(getChatRetentionCutoff())
    .finally(() => {
      lastCleanupAt = Date.now();
      cleanupPromise = null;
    });

  return cleanupPromise;
}

export const chatService = {
  async listMessages(options?: { before?: string; limit?: number }): Promise<ChatMessage[]> {
    await performCleanup();

    const messages = await chatRepository.listRecent({
      before: options?.before ? new Date(options.before) : undefined,
      cutoff: getChatRetentionCutoff(),
      limit: options?.limit ?? CHAT_MESSAGE_DEFAULT_LIMIT,
    });

    return messages.reverse().map(toChatMessage);
  },

  async createMessage(userId: string, payload: CreateChatMessageRequest): Promise<ChatMessage> {
    await performCleanup();
    assertAllowedChatMessage(payload.content);

    const user = await getActiveUser(userId);
    const message = await chatRepository.create(userId, user.name, payload.content.trim());
    return toChatMessage(message);
  },

  async updateMessage(
    userId: string,
    messageId: string,
    payload: UpdateChatMessageRequest,
  ): Promise<ChatMessage> {
    await performCleanup();
    assertAllowedChatMessage(payload.content);
    await getActiveUser(userId);

    const existingMessage = await chatRepository.findById(messageId);

    if (!existingMessage || isExpiredChatMessage(existingMessage)) {
      throwChatMessageNotFound();
    }

    if (existingMessage.createdByUserId !== userId) {
      throwChatMessageForbidden();
    }

    const updatedMessage = await chatRepository.updateById(messageId, payload.content.trim());
    return toChatMessage(updatedMessage);
  },

  async deleteMessage(userId: string, messageId: string): Promise<ChatMessageDeleted> {
    await performCleanup();
    await getActiveUser(userId);

    const existingMessage = await chatRepository.findById(messageId);

    if (!existingMessage || isExpiredChatMessage(existingMessage)) {
      throwChatMessageNotFound();
    }

    if (existingMessage.createdByUserId !== userId) {
      throwChatMessageForbidden();
    }

    await chatRepository.deleteById(messageId);

    return {
      id: messageId,
      deletedAt: new Date().toISOString(),
    };
  },

  cleanupExpiredMessages(force = false): Promise<number> {
    return performCleanup(force);
  },
};
