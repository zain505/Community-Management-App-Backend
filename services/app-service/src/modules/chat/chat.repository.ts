import type { ChatAttachmentType, ChatMessageType } from '@community/contracts';
import { StatusCodes } from 'http-status-codes';
import type { Prisma } from '../../generated/prisma';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../shared/app-error';

const chatAttachmentSelect = {
  id: true,
  type: true,
  url: true,
  storagePath: true,
  mimeType: true,
  fileName: true,
  sizeBytes: true,
  width: true,
  height: true,
  durationMillis: true,
  status: true,
  expiresAt: true,
  consumedAt: true,
  createdAt: true,
  updatedAt: true,
  createdByUserId: true,
  messageId: true,
} satisfies Prisma.ChatAttachmentSelect;

const chatMessageSelect = {
  id: true,
  type: true,
  content: true,
  authorName: true,
  createdAt: true,
  updatedAt: true,
  createdByUserId: true,
  attachments: {
    select: chatAttachmentSelect,
    orderBy: {
      createdAt: 'asc',
    },
  },
} satisfies Prisma.ChatMessageSelect;

const chatMessageCursorSelect = {
  id: true,
  createdAt: true,
} satisfies Prisma.ChatMessageSelect;

const chatAttachmentCleanupSelect = {
  id: true,
  storagePath: true,
} satisfies Prisma.ChatAttachmentSelect;

export type ChatAttachmentRecord = Prisma.ChatAttachmentGetPayload<{
  select: typeof chatAttachmentSelect;
}>;

export type ChatMessageRecord = Prisma.ChatMessageGetPayload<{
  select: typeof chatMessageSelect;
}>;

export type ChatMessageCursorRecord = Prisma.ChatMessageGetPayload<{
  select: typeof chatMessageCursorSelect;
}>;

export type ChatAttachmentCleanupRecord = Prisma.ChatAttachmentGetPayload<{
  select: typeof chatAttachmentCleanupSelect;
}>;

interface ListRecentChatMessagesOptions {
  before?: Date;
  cutoff: Date;
  limit: number;
}

interface CreateChatMessageOptions {
  createdByUserId: string;
  authorName: string;
  content: string;
  type: ChatMessageType;
  attachmentIds: string[];
}

interface CreateChatAttachmentUploadOptions {
  createdByUserId: string;
  type: ChatAttachmentType;
  url: string;
  storagePath: string;
  mimeType: string;
  fileName: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  durationMillis: number | null;
  expiresAt: Date;
}

export const chatRepository = {
  listRecent(options: ListRecentChatMessagesOptions): Promise<ChatMessageRecord[]> {
    const createdAtFilter: Prisma.DateTimeFilter = {
      gte: options.cutoff,
    };

    if (options.before) {
      createdAtFilter.lt = options.before;
    }

    return prisma.chatMessage.findMany({
      where: {
        createdAt: createdAtFilter,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: options.limit,
      select: chatMessageSelect,
    });
  },

  findById(id: string): Promise<ChatMessageRecord | null> {
    return prisma.chatMessage.findUnique({
      where: { id },
      select: chatMessageSelect,
    });
  },

  findCursorById(id: string): Promise<ChatMessageCursorRecord | null> {
    return prisma.chatMessage.findUnique({
      where: { id },
      select: chatMessageCursorSelect,
    });
  },

  findAttachmentsByIds(ids: string[]): Promise<ChatAttachmentRecord[]> {
    return prisma.chatAttachment.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: chatAttachmentSelect,
    });
  },

  createAttachmentUpload(options: CreateChatAttachmentUploadOptions): Promise<ChatAttachmentRecord> {
    return prisma.chatAttachment.create({
      data: {
        createdByUserId: options.createdByUserId,
        durationMillis: options.durationMillis,
        expiresAt: options.expiresAt,
        fileName: options.fileName,
        height: options.height,
        mimeType: options.mimeType,
        sizeBytes: options.sizeBytes,
        storagePath: options.storagePath,
        type: options.type,
        url: options.url,
        width: options.width,
      },
      select: chatAttachmentSelect,
    });
  },

  async createMessage(options: CreateChatMessageOptions): Promise<ChatMessageRecord> {
    return prisma.$transaction(async (transaction) => {
      const message = await transaction.chatMessage.create({
        data: {
          authorName: options.authorName,
          content: options.content,
          createdByUserId: options.createdByUserId,
          type: options.type,
        },
        select: {
          id: true,
        },
      });

      if (options.attachmentIds.length > 0) {
        const consumedAt = new Date();
        const updatedAttachments = await transaction.chatAttachment.updateMany({
          where: {
            createdByUserId: options.createdByUserId,
            id: {
              in: options.attachmentIds,
            },
            messageId: null,
            status: 'uploaded',
          },
          data: {
            consumedAt,
            expiresAt: null,
            messageId: message.id,
            status: 'attached',
          },
        });

        if (updatedAttachments.count !== options.attachmentIds.length) {
          throw new AppError('One or more attachments are no longer available', {
            statusCode: StatusCodes.CONFLICT,
            code: 'CHAT_ATTACHMENT_NOT_FOUND',
          });
        }
      }

      return transaction.chatMessage.findUniqueOrThrow({
        where: { id: message.id },
        select: chatMessageSelect,
      });
    });
  },

  updateById(id: string, content: string): Promise<ChatMessageRecord> {
    return prisma.chatMessage.update({
      where: { id },
      data: {
        content,
      },
      select: chatMessageSelect,
    });
  },

  async deleteById(id: string): Promise<void> {
    await prisma.chatMessage.delete({
      where: { id },
    });
  },

  async deleteOlderThan(cutoff: Date): Promise<{ count: number; attachments: ChatAttachmentCleanupRecord[] }> {
    const expiredMessages = await prisma.chatMessage.findMany({
      where: {
        createdAt: {
          lt: cutoff,
        },
      },
      select: {
        id: true,
        attachments: {
          select: chatAttachmentCleanupSelect,
        },
      },
    });

    if (expiredMessages.length === 0) {
      return {
        count: 0,
        attachments: [],
      };
    }

    await prisma.chatMessage.deleteMany({
      where: {
        id: {
          in: expiredMessages.map((message) => message.id),
        },
      },
    });

    return {
      count: expiredMessages.length,
      attachments: expiredMessages.flatMap((message) => message.attachments),
    };
  },

  async expireUnusedUploads(cutoff: Date): Promise<ChatAttachmentCleanupRecord[]> {
    return prisma.$transaction(async (transaction) => {
      const expiredCandidateIds = (
        await transaction.chatAttachment.findMany({
          where: {
            expiresAt: {
              lte: cutoff,
            },
            status: 'uploaded',
          },
          select: {
            id: true,
          },
        })
      ).map((attachment) => attachment.id);

      if (expiredCandidateIds.length === 0) {
        return [];
      }

      await transaction.chatAttachment.updateMany({
        where: {
          id: {
            in: expiredCandidateIds,
          },
          messageId: null,
          status: 'uploaded',
        },
        data: {
          status: 'expired',
        },
      });

      return transaction.chatAttachment.findMany({
        where: {
          id: {
            in: expiredCandidateIds,
          },
          status: 'expired',
        },
        select: chatAttachmentCleanupSelect,
      });
    });
  },
};
