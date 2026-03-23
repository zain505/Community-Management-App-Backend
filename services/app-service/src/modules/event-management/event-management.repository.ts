import type { Prisma } from '../../generated/prisma';
import { prisma } from '../../lib/prisma';

const EVENTS_PER_PAGE = 10;

const eventManagementSelect = {
  id: true,
  title: true,
  description: true,
  location: true,
  startAt: true,
  endAt: true,
  authorName: true,
  createdAt: true,
  updatedAt: true,
  createdByUserId: true,
} satisfies Prisma.EventManagementSelect;

export type EventManagementRecord = Prisma.EventManagementGetPayload<{
  select: typeof eventManagementSelect;
}>;

interface CreateEventManagementRecordInput {
  title: string;
  description: string;
  location: string;
  startAt: string;
  endAt?: string | null;
}

interface UpdateEventManagementRecordInput {
  title?: string;
  description?: string;
  location?: string;
  startAt?: string;
  endAt?: string | null;
}

export const eventManagementRepository = {
  list(search?: string, page = 1): Promise<EventManagementRecord[]> {
    return prisma.eventManagement.findMany({
      where: search
        ? {
            OR: [
              {
                title: {
                  contains: search,
                },
              },
              {
                description: {
                  contains: search,
                },
              },
              {
                location: {
                  contains: search,
                },
              },
            ],
          }
        : undefined,
      orderBy: [
        {
          startAt: 'asc',
        },
        {
          createdAt: 'desc',
        },
      ],
      skip: (page - 1) * EVENTS_PER_PAGE,
      take: EVENTS_PER_PAGE,
      select: eventManagementSelect,
    });
  },

  findById(id: string): Promise<EventManagementRecord | null> {
    return prisma.eventManagement.findUnique({
      where: { id },
      select: eventManagementSelect,
    });
  },

  create(
    createdByUserId: string,
    authorName: string,
    payload: CreateEventManagementRecordInput,
  ): Promise<EventManagementRecord> {
    return prisma.eventManagement.create({
      data: {
        title: payload.title,
        description: payload.description,
        location: payload.location,
        startAt: new Date(payload.startAt),
        endAt: payload.endAt ? new Date(payload.endAt) : null,
        authorName,
        createdByUserId,
      },
      select: eventManagementSelect,
    });
  },

  updateById(id: string, payload: UpdateEventManagementRecordInput): Promise<EventManagementRecord> {
    const data: Prisma.EventManagementUpdateInput = {};

    if (payload.title !== undefined) data.title = payload.title;
    if (payload.description !== undefined) data.description = payload.description;
    if (payload.location !== undefined) data.location = payload.location;
    if (payload.startAt !== undefined) data.startAt = new Date(payload.startAt);
    if ('endAt' in payload) data.endAt = payload.endAt ? new Date(payload.endAt) : null;

    return prisma.eventManagement.update({
      where: { id },
      data,
      select: eventManagementSelect,
    });
  },

  deleteById(id: string): Promise<EventManagementRecord> {
    return prisma.eventManagement.delete({
      where: { id },
      select: eventManagementSelect,
    });
  },
};
