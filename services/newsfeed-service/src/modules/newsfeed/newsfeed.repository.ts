import { type NewsFeedEventType, type NewsFeedMetric, type Prisma } from '../../generated/prisma';
import { prisma } from '../../lib/prisma';

const ACTIVITY_EVENT_TYPES: NewsFeedEventType[] = [
  'STORE_CREATED',
  'STORE_NAME_UPDATED',
  'STORE_LOCATION_UPDATED',
  'STORE_RATING_UPDATED',
  'STORE_IMAGE_UPDATED',
  'STORE_DELIVERY_UPDATED',
  'STORE_MIN_ORDER_UPDATED',
  'STORE_CONTACT_UPDATED',
  'STORE_PROFILE_UPDATED',
  'PRODUCT_ADDED',
  'PRODUCT_UPDATED',
  'PRODUCT_DELETED',
];

const newsFeedListSelect = {
  id: true,
  type: true,
  title: true,
  description: true,
  storeId: true,
  storeName: true,
  metadata: true,
  createdAt: true,
  _count: {
    select: {
      likes: true,
    },
  },
} satisfies Prisma.NewsFeedItemSelect;

export type NewsFeedItemRecord = Prisma.NewsFeedItemGetPayload<{
  select: typeof newsFeedListSelect;
}>;

const savedNewsFeedSelect = {
  id: true,
  savedAt: true,
  expiresAt: true,
  newsFeedItem: {
    select: newsFeedListSelect,
  },
} satisfies Prisma.NewsFeedSaveSelect;

export type SavedNewsFeedRecord = Prisma.NewsFeedSaveGetPayload<{
  select: typeof savedNewsFeedSelect;
}>;

export interface NewsFeedLikeSummaryRecord {
  id: string;
  likesCount: number;
}

interface CreateNewsFeedRecordInput {
  type: NewsFeedEventType;
  title: string;
  description: string;
  storeId?: number;
  storeName?: string;
  metadata?: Prisma.InputJsonValue;
}

export const newsFeedRepository = {
  createEntry(payload: CreateNewsFeedRecordInput): Promise<NewsFeedItemRecord> {
    return prisma.newsFeedItem.create({
      data: {
        type: payload.type,
        title: payload.title,
        description: payload.description,
        storeId: payload.storeId,
        storeName: payload.storeName,
        metadata: payload.metadata,
      },
      select: newsFeedListSelect,
    });
  },

  listEntries(page: number, limit: number): Promise<NewsFeedItemRecord[]> {
    return prisma.newsFeedItem.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
      select: newsFeedListSelect,
    });
  },

  deleteExpiredSavedEntries(now: Date): Promise<number> {
    return prisma.newsFeedSave
      .deleteMany({
        where: {
          expiresAt: {
            lte: now,
          },
        },
      })
      .then((result) => result.count);
  },

  async saveEntry(
    newsFeedItemId: string,
    userId: string,
    savedAt: Date,
    expiresAt: Date,
  ): Promise<SavedNewsFeedRecord | null> {
    return prisma.$transaction(async (tx) => {
      const item = await tx.newsFeedItem.findUnique({
        where: {
          id: newsFeedItemId,
        },
        select: {
          id: true,
        },
      });

      if (!item) {
        return null;
      }

      return tx.newsFeedSave.upsert({
        where: {
          newsFeedItemId_userId: {
            newsFeedItemId,
            userId,
          },
        },
        create: {
          userId,
          savedAt,
          expiresAt,
          newsFeedItem: {
            connect: {
              id: newsFeedItemId,
            },
          },
        },
        update: {
          savedAt,
          expiresAt,
        },
        select: savedNewsFeedSelect,
      });
    });
  },

  listSavedEntries(userId: string, now: Date, page: number, limit: number): Promise<SavedNewsFeedRecord[]> {
    return prisma.newsFeedSave.findMany({
      where: {
        userId,
        expiresAt: {
          gt: now,
        },
      },
      orderBy: {
        savedAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
      select: savedNewsFeedSelect,
    });
  },

  async likeEntry(newsFeedItemId: string, userId: string): Promise<NewsFeedLikeSummaryRecord | null> {
    return prisma.$transaction(async (tx) => {
      const item = await tx.newsFeedItem.findUnique({
        where: {
          id: newsFeedItemId,
        },
        select: {
          id: true,
        },
      });

      if (!item) {
        return null;
      }

      await tx.newsFeedLike.upsert({
        where: {
          newsFeedItemId_userId: {
            newsFeedItemId,
            userId,
          },
        },
        create: {
          userId,
          newsFeedItem: {
            connect: {
              id: newsFeedItemId,
            },
          },
        },
        update: {},
      });

      const likesCount = await tx.newsFeedLike.count({
        where: {
          newsFeedItemId,
        },
      });

      return {
        id: item.id,
        likesCount,
      };
    });
  },

  async getMetricStateStoreId(metric: NewsFeedMetric): Promise<number | null> {
    const state = await prisma.newsFeedMetricState.findUnique({
      where: {
        metric,
      },
      select: {
        storeId: true,
      },
    });

    return state?.storeId ?? null;
  },

  upsertMetricState(metric: NewsFeedMetric, storeId: number | null): Promise<void> {
    return prisma.newsFeedMetricState
      .upsert({
        where: {
          metric,
        },
        create: {
          metric,
          storeId,
        },
        update: {
          storeId,
        },
      })
      .then(() => undefined);
  },

  async findMostActiveStoreId(): Promise<number | null> {
    const grouped = await prisma.newsFeedItem.groupBy({
      by: ['storeId'],
      where: {
        storeId: {
          not: null,
        },
        type: {
          in: ACTIVITY_EVENT_TYPES,
        },
      },
      _count: {
        storeId: true,
      },
      _max: {
        createdAt: true,
      },
      orderBy: [
        {
          _count: {
            storeId: 'desc',
          },
        },
        {
          _max: {
            createdAt: 'desc',
          },
        },
      ],
      take: 1,
    });

    return grouped[0]?.storeId ?? null;
  },
};
