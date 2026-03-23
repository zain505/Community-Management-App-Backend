import type { Prisma } from '../../generated/prisma';
import { prisma } from '../../lib/prisma';

const ANNOUNCEMENTS_PER_PAGE = 10;

const announcementSelect = {
  id: true,
  title: true,
  content: true,
  authorName: true,
  createdAt: true,
  updatedAt: true,
  createdByUserId: true,
} satisfies Prisma.AnnouncementSelect;

export type AnnouncementRecord = Prisma.AnnouncementGetPayload<{
  select: typeof announcementSelect;
}>;

interface CreateAnnouncementRecordInput {
  title: string;
  content: string;
}

interface UpdateAnnouncementRecordInput {
  title?: string;
  content?: string;
}

export const announcementRepository = {
  list(search?: string, page = 1): Promise<AnnouncementRecord[]> {
    return prisma.announcement.findMany({
      where: search
        ? {
            OR: [
              {
                title: {
                  contains: search,
                },
              },
              {
                content: {
                  contains: search,
                },
              },
            ],
          }
        : undefined,
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * ANNOUNCEMENTS_PER_PAGE,
      take: ANNOUNCEMENTS_PER_PAGE,
      select: announcementSelect,
    });
  },

  findById(id: string): Promise<AnnouncementRecord | null> {
    return prisma.announcement.findUnique({
      where: { id },
      select: announcementSelect,
    });
  },

  create(
    createdByUserId: string,
    authorName: string,
    payload: CreateAnnouncementRecordInput,
  ): Promise<AnnouncementRecord> {
    return prisma.announcement.create({
      data: {
        title: payload.title,
        content: payload.content,
        authorName,
        createdByUserId,
      },
      select: announcementSelect,
    });
  },

  updateById(id: string, payload: UpdateAnnouncementRecordInput): Promise<AnnouncementRecord> {
    const data: Prisma.AnnouncementUpdateInput = {};

    if (payload.title !== undefined) data.title = payload.title;
    if (payload.content !== undefined) data.content = payload.content;

    return prisma.announcement.update({
      where: { id },
      data,
      select: announcementSelect,
    });
  },

  deleteById(id: string): Promise<AnnouncementRecord> {
    return prisma.announcement.delete({
      where: { id },
      select: announcementSelect,
    });
  },
};
