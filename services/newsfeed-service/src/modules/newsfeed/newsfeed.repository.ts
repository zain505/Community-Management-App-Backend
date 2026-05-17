import {
  type NewsFeedApprovalStatus,
  type NewsFeedEventType,
  type NewsFeedMetric,
  type NewsFeedSource,
  type Prisma,
} from '../../generated/prisma';
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
  source: true,
  approvalStatus: true,
  title: true,
  description: true,
  image: true,
  authorUserId: true,
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

const deletedNewsFeedItemSelect = {
  id: true,
  image: true,
  metadata: true,
} satisfies Prisma.NewsFeedItemSelect;

export type DeletedNewsFeedItemRecord = Prisma.NewsFeedItemGetPayload<{
  select: typeof deletedNewsFeedItemSelect;
}>;

export interface NewsFeedLikeSummaryRecord {
  id: string;
  likesCount: number;
}

export interface NewsFeedListRecords {
  items: NewsFeedItemRecord[];
  hasMore: boolean;
}

interface CreateNewsFeedRecordInput {
  type: NewsFeedEventType;
  title: string;
  description: string;
  image?: string;
  storeId?: number;
  storeName?: string;
  metadata?: Prisma.InputJsonValue;
}

interface CreateUserNewsFeedPostInput {
  authorUserId: string;
  title: string;
  description: string;
  image?: string;
}

interface ListEntryFilters {
  approvalStatus?: NewsFeedApprovalStatus;
  authorUserId?: string;
  source?: NewsFeedSource;
}

function buildPublicNewsFeedWhere(): Prisma.NewsFeedItemWhereInput {
  return {
    approvalStatus: 'APPROVED',
  };
}

function buildListEntryWhere(filters: ListEntryFilters = {}): Prisma.NewsFeedItemWhereInput {
  const where: Prisma.NewsFeedItemWhereInput = {};

  if (filters.source !== undefined) {
    where.source = filters.source;
  }

  if (filters.authorUserId !== undefined) {
    where.authorUserId = filters.authorUserId;
  }

  if (filters.approvalStatus !== undefined) {
    where.approvalStatus = filters.approvalStatus;
  }

  return where;
}

async function listEntriesWithWhere(
  where: Prisma.NewsFeedItemWhereInput,
  page: number,
  limit: number,
): Promise<NewsFeedListRecords> {
  const entryIds = await prisma.newsFeedItem.findMany({
    where,
    orderBy: [
      {
        createdAt: 'desc',
      },
      {
        id: 'desc',
      },
    ],
    skip: (page - 1) * limit,
    take: limit + 1,
    select: {
      id: true,
    },
  });

  const hasMore = entryIds.length > limit;
  const orderedIds = entryIds.slice(0, limit).map((entry) => entry.id);

  if (orderedIds.length === 0) {
    return {
      items: [],
      hasMore,
    };
  }

  const items = await prisma.newsFeedItem.findMany({
    where: {
      ...where,
      id: {
        in: orderedIds,
      },
    },
    select: newsFeedListSelect,
  });
  const itemById = new Map(items.map((item) => [item.id, item]));

  return {
    items: orderedIds
      .map((id) => itemById.get(id))
      .filter((item): item is NewsFeedItemRecord => item !== undefined),
    hasMore,
  };
}

export const newsFeedRepository = {
  createEntry(payload: CreateNewsFeedRecordInput): Promise<NewsFeedItemRecord> {
    return prisma.newsFeedItem.create({
      data: {
        type: payload.type,
        source: 'SYSTEM',
        approvalStatus: 'APPROVED',
        title: payload.title,
        description: payload.description,
        image: payload.image,
        storeId: payload.storeId,
        storeName: payload.storeName,
        metadata: payload.metadata,
      },
      select: newsFeedListSelect,
    });
  },

  createUserPost(payload: CreateUserNewsFeedPostInput): Promise<NewsFeedItemRecord> {
    return prisma.newsFeedItem.create({
      data: {
        type: 'USER_POST',
        source: 'USER_POST',
        approvalStatus: 'PENDING',
        title: payload.title,
        description: payload.description,
        image: payload.image,
        authorUserId: payload.authorUserId,
      },
      select: newsFeedListSelect,
    });
  },

  listEntries(page: number, limit: number): Promise<NewsFeedListRecords> {
    return listEntriesWithWhere(buildPublicNewsFeedWhere(), page, limit);
  },

  listUserSubmittedEntries(
    page: number,
    limit: number,
    approvalStatus?: NewsFeedApprovalStatus,
  ): Promise<NewsFeedListRecords> {
    return listEntriesWithWhere(
      buildListEntryWhere({
        source: 'USER_POST',
        approvalStatus,
      }),
      page,
      limit,
    );
  },

  listUserPostsByAuthor(authorUserId: string, page: number, limit: number): Promise<NewsFeedListRecords> {
    return listEntriesWithWhere(
      buildListEntryWhere({
        source: 'USER_POST',
        authorUserId,
      }),
      page,
      limit,
    );
  },

  async deleteEntriesOlderThan(cutoff: Date): Promise<DeletedNewsFeedItemRecord[]> {
    return prisma.$transaction(async (transaction) => {
      const items = await transaction.newsFeedItem.findMany({
        where: {
          createdAt: {
            lt: cutoff,
          },
        },
        select: deletedNewsFeedItemSelect,
      });

      if (items.length === 0) {
        return [];
      }

      await transaction.newsFeedItem.deleteMany({
        where: {
          id: {
            in: items.map((item) => item.id),
          },
        },
      });

      return items;
    });
  },

  async deleteUserPostByAuthor(
    newsFeedItemId: string,
    authorUserId: string,
  ): Promise<DeletedNewsFeedItemRecord | null> {
    return prisma.$transaction(async (transaction) => {
      const item = await transaction.newsFeedItem.findFirst({
        where: {
          id: newsFeedItemId,
          source: 'USER_POST',
          authorUserId,
        },
        select: deletedNewsFeedItemSelect,
      });

      if (!item) {
        return null;
      }

      await transaction.newsFeedItem.delete({
        where: {
          id: item.id,
        },
      });

      return item;
    });
  },

  async likeEntry(newsFeedItemId: string, userId: string): Promise<NewsFeedLikeSummaryRecord | null> {
    return prisma.$transaction(async (transaction) => {
      const item = await transaction.newsFeedItem.findFirst({
        where: {
          id: newsFeedItemId,
          ...buildPublicNewsFeedWhere(),
        },
        select: {
          id: true,
        },
      });

      if (!item) {
        return null;
      }

      await transaction.newsFeedLike.upsert({
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

      const likesCount = await transaction.newsFeedLike.count({
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

  async updateApprovalStatus(
    newsFeedItemId: string,
    approvalStatus: Exclude<NewsFeedApprovalStatus, 'PENDING'>,
  ): Promise<NewsFeedItemRecord | null> {
    return prisma.$transaction(async (transaction) => {
      const item = await transaction.newsFeedItem.findFirst({
        where: {
          id: newsFeedItemId,
          source: 'USER_POST',
        },
        select: {
          id: true,
        },
      });

      if (!item) {
        return null;
      }

      return transaction.newsFeedItem.update({
        where: {
          id: newsFeedItemId,
        },
        data: {
          approvalStatus,
        },
        select: newsFeedListSelect,
      });
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
        approvalStatus: 'APPROVED',
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
