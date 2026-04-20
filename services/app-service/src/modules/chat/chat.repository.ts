import type { Prisma } from '../../generated/prisma';
import { prisma } from '../../lib/prisma';

const chatMessageSelect = {
  id: true,
  content: true,
  authorName: true,
  createdAt: true,
  updatedAt: true,
  createdByUserId: true,
} satisfies Prisma.ChatMessageSelect;

export type ChatMessageRecord = Prisma.ChatMessageGetPayload<{
  select: typeof chatMessageSelect;
}>;

interface ListRecentChatMessagesOptions {
  before?: Date;
  cutoff: Date;
  limit: number;
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

  create(createdByUserId: string, authorName: string, content: string): Promise<ChatMessageRecord> {
    return prisma.chatMessage.create({
      data: {
        content,
        authorName,
        createdByUserId,
      },
      select: chatMessageSelect,
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

  deleteById(id: string): Promise<ChatMessageRecord> {
    return prisma.chatMessage.delete({
      where: { id },
      select: chatMessageSelect,
    });
  },

  async deleteOlderThan(cutoff: Date): Promise<number> {
    const result = await prisma.chatMessage.deleteMany({
      where: {
        createdAt: {
          lt: cutoff,
        },
      },
    });

    return result.count;
  },
};
