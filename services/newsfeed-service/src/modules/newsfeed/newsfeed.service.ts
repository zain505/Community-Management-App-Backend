import type {
  NewsFeedItem,
  NewsFeedLikeResponse,
  NewsFeedListResponse,
  NewsFeedMetric,
  NewsFeedProductSnapshot,
  SavedNewsFeedItem,
  SavedNewsFeedListResponse,
  NewsFeedSyncEvent,
  NewsFeedSyncRequest,
  StoreBasicSnapshot,
  StoreRankingSnapshot,
  StoreSummary,
  StoreSummaryWithOwner,
  UserPublic,
} from '@community/contracts';
import { StatusCodes } from 'http-status-codes';
import { type Prisma } from '../../generated/prisma';
import { AppError } from '../../shared/app-error';
import { authClient } from '../auth/auth.client';
import { newsFeedRepository, type NewsFeedItemRecord, type SavedNewsFeedRecord } from './newsfeed.repository';
import { storeClient } from '../store/store.client';

const DEFAULT_NEWSFEED_LIMIT = 20;
const MAX_NEWSFEED_LIMIT = 50;

function parseRatingValue(rating: string): number {
  const match = rating.match(/(\d+(?:\.\d+)?)/);

  if (!match) {
    return 0;
  }

  const parsed = Number.parseFloat(match[1]);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toMetadata(value: Prisma.JsonValue | null): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }

  return value as Record<string, unknown>;
}

function toNewsFeedItem(item: NewsFeedItemRecord): NewsFeedItem {
  return {
    id: item.id,
    type: item.type,
    title: item.title,
    description: item.description,
    storeId: item.storeId ?? undefined,
    storeName: item.storeName ?? undefined,
    metadata: toMetadata(item.metadata),
    likesCount: item._count.likes,
    createdAt: item.createdAt.toISOString(),
  };
}

function toNewsFeedLikeResponse(newsFeedLike: { id: string; likesCount: number }): NewsFeedLikeResponse {
  return {
    id: newsFeedLike.id,
    likesCount: newsFeedLike.likesCount,
  };
}

function normalizePagination(page = 1, limit = DEFAULT_NEWSFEED_LIMIT): { page: number; limit: number } {
  const normalizedPage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const normalizedLimit = Number.isFinite(limit)
    ? Math.min(Math.max(Math.floor(limit), 1), MAX_NEWSFEED_LIMIT)
    : DEFAULT_NEWSFEED_LIMIT;

  return {
    page: normalizedPage,
    limit: normalizedLimit,
  };
}

function addCalendarMonth(date: Date): Date {
  const result = new Date(date);
  const originalDay = result.getUTCDate();

  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + 1);

  const lastDayOfTargetMonth = new Date(
    Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0),
  ).getUTCDate();

  result.setUTCDate(Math.min(originalDay, lastDayOfTargetMonth));

  return result;
}

function throwNewsFeedNotFound(): never {
  throw new AppError('Newsfeed item not found', {
    statusCode: StatusCodes.NOT_FOUND,
    code: 'NEWSFEED_NOT_FOUND',
  });
}

function toStoreSummary(store: StoreSummaryWithOwner): StoreSummary {
  return {
    id: store.id,
    name: store.name,
    location: store.location,
    rating: store.rating,
    image: store.image,
    badges: store.badges,
    delivery: store.delivery,
    minOrderRs: store.minOrderRs,
    openingTime: store.openingTime,
    closingTime: store.closingTime,
    phoneNumber: store.phoneNumber,
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toProductSnapshot(value: unknown): NewsFeedProductSnapshot | undefined {
  if (!isObject(value)) {
    return undefined;
  }

  const { id, name, price, image, tag } = value;

  if (typeof name !== 'string' || typeof price !== 'string' || typeof image !== 'string') {
    return undefined;
  }

  return {
    ...(typeof id === 'string' && id.trim().length > 0 ? { id } : {}),
    name,
    price,
    image,
    ...(typeof tag === 'string' && tag.trim().length > 0 ? { tag } : {}),
  };
}

function toAttachedProduct(item: NewsFeedItemRecord): NewsFeedProductSnapshot | undefined {
  const metadata = toMetadata(item.metadata);

  if (!metadata) {
    return undefined;
  }

  switch (item.type) {
    case 'PRODUCT_ADDED':
    case 'PRODUCT_DELETED':
      return toProductSnapshot(metadata.product);
    case 'PRODUCT_UPDATED':
      return toProductSnapshot(metadata.current) ?? toProductSnapshot(metadata.previous);
    default:
      return undefined;
  }
}

function createStoreSummaryLoader(): (storeId: number) => Promise<StoreSummaryWithOwner | null> {
  const cache = new Map<number, Promise<StoreSummaryWithOwner | null>>();

  return (storeId: number) => {
    let storePromise = cache.get(storeId);

    if (!storePromise) {
      storePromise = storeClient.findStoreSummaryById(storeId).catch(() => null);
      cache.set(storeId, storePromise);
    }

    return storePromise;
  };
}

function createStoreOwnerLoader(): (ownerUserId: string) => Promise<UserPublic | null> {
  const cache = new Map<string, Promise<UserPublic | null>>();

  return (ownerUserId: string) => {
    let ownerPromise = cache.get(ownerUserId);

    if (!ownerPromise) {
      ownerPromise = authClient.findUserPublicById(ownerUserId).catch(() => null);
      cache.set(ownerUserId, ownerPromise);
    }

    return ownerPromise;
  };
}

async function enrichNewsFeedItem(
  item: NewsFeedItemRecord,
  loadStoreSummary: (storeId: number) => Promise<StoreSummaryWithOwner | null>,
  loadStoreOwner: (ownerUserId: string) => Promise<UserPublic | null>,
): Promise<NewsFeedItem> {
  const baseItem = toNewsFeedItem(item);
  const attachedStoreSnapshot =
    typeof item.storeId === 'number' ? await loadStoreSummary(item.storeId) : null;
  const attachedStore = attachedStoreSnapshot ? toStoreSummary(attachedStoreSnapshot) : undefined;
  const attachedStoreOwner =
    attachedStoreSnapshot?.ownerUserId ? await loadStoreOwner(attachedStoreSnapshot.ownerUserId) : undefined;

  return {
    ...baseItem,
    store: attachedStore,
    storeOwner: attachedStoreOwner ?? undefined,
    product: toAttachedProduct(item),
  };
}

async function enrichNewsFeedItems(items: NewsFeedItemRecord[]): Promise<NewsFeedItem[]> {
  const loadStoreSummary = createStoreSummaryLoader();
  const loadStoreOwner = createStoreOwnerLoader();

  return Promise.all(items.map((item) => enrichNewsFeedItem(item, loadStoreSummary, loadStoreOwner)));
}

async function toSavedNewsFeedItem(
  item: SavedNewsFeedRecord,
  loadStoreSummary: (storeId: number) => Promise<StoreSummaryWithOwner | null>,
  loadStoreOwner: (ownerUserId: string) => Promise<UserPublic | null>,
): Promise<SavedNewsFeedItem> {
  const newsFeedItem = await enrichNewsFeedItem(item.newsFeedItem, loadStoreSummary, loadStoreOwner);

  return {
    ...newsFeedItem,
    savedAt: item.savedAt.toISOString(),
    expiresAt: item.expiresAt.toISOString(),
  };
}

async function createEntry(payload: NewsFeedSyncEvent): Promise<void> {
  await newsFeedRepository.createEntry({
    ...payload,
    metadata: payload.metadata as Prisma.InputJsonValue | undefined,
  });
}

interface MetricRefreshContext {
  directEventStoreIds: Set<number>;
}

function buildMetricRefreshContext(events?: NewsFeedSyncEvent[]): MetricRefreshContext {
  return {
    directEventStoreIds: new Set(
      (events ?? [])
        .map((event) => event.storeId)
        .filter((storeId): storeId is number => typeof storeId === 'number'),
    ),
  };
}

async function publishMetricChangeIfNeeded(
  metric: NewsFeedMetric,
  store: StoreBasicSnapshot | null,
  context: MetricRefreshContext,
  buildEntry?: (topStore: StoreBasicSnapshot) => NewsFeedSyncEvent,
): Promise<void> {
  const currentStoreId = await newsFeedRepository.getMetricStateStoreId(metric);
  const nextStoreId = store?.id ?? null;

  if (currentStoreId === nextStoreId) {
    return;
  }

  if (!store) {
    await newsFeedRepository.upsertMetricState(metric, null);
    return;
  }

  if (!buildEntry) {
    throw new Error(`Missing metric entry builder for ${metric}`);
  }

  if (context.directEventStoreIds.has(store.id)) {
    await newsFeedRepository.upsertMetricState(metric, store.id);
    return;
  }

  await createEntry(buildEntry(store));
  await newsFeedRepository.upsertMetricState(metric, store.id);
}

function pickPopularStore(stores: StoreRankingSnapshot[]): StoreRankingSnapshot | null {
  if (stores.length === 0) {
    return null;
  }

  const sorted = [...stores].sort((left, right) => {
    const byRating = parseRatingValue(right.rating) - parseRatingValue(left.rating);

    if (byRating !== 0) {
      return byRating;
    }

    return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
  });

  return sorted[0];
}

async function refreshMetric(metric: NewsFeedMetric, context: MetricRefreshContext): Promise<void> {
  switch (metric) {
    case 'POPULAR_STORE':
      await newsFeedService.refreshPopularStoreMetric(context);
      return;
    case 'MOST_ACTIVE_STORE':
      await newsFeedService.refreshMostActiveStoreMetric(context);
      return;
    case 'MOST_SEARCHED_STORE':
      await newsFeedService.refreshMostSearchedStoreMetric(context);
      return;
  }
}

export const newsFeedService = {
  async listNewsFeed(page = 1, limit = DEFAULT_NEWSFEED_LIMIT): Promise<NewsFeedListResponse> {
    const pagination = normalizePagination(page, limit);

    const items = await newsFeedRepository.listEntries(pagination.page, pagination.limit);

    return {
      items: await enrichNewsFeedItems(items),
      page: pagination.page,
      limit: pagination.limit,
    };
  },

  async saveNewsFeed(userId: string, newsFeedId: string): Promise<SavedNewsFeedItem> {
    const now = new Date();
    const expiresAt = addCalendarMonth(now);

    await newsFeedRepository.deleteExpiredSavedEntries(now);

    const savedEntry = await newsFeedRepository.saveEntry(newsFeedId, userId, now, expiresAt);

    if (!savedEntry) {
      throwNewsFeedNotFound();
    }

    const loadStoreSummary = createStoreSummaryLoader();
    const loadStoreOwner = createStoreOwnerLoader();

    return toSavedNewsFeedItem(savedEntry, loadStoreSummary, loadStoreOwner);
  },

  async listSavedNewsFeed(
    userId: string,
    page = 1,
    limit = DEFAULT_NEWSFEED_LIMIT,
  ): Promise<SavedNewsFeedListResponse> {
    const pagination = normalizePagination(page, limit);
    const now = new Date();

    await newsFeedRepository.deleteExpiredSavedEntries(now);

    const items = await newsFeedRepository.listSavedEntries(userId, now, pagination.page, pagination.limit);
    const loadStoreSummary = createStoreSummaryLoader();
    const loadStoreOwner = createStoreOwnerLoader();

    return {
      items: await Promise.all(
        items.map((item) => toSavedNewsFeedItem(item, loadStoreSummary, loadStoreOwner)),
      ),
      page: pagination.page,
      limit: pagination.limit,
    };
  },

  async likeNewsFeed(userId: string, newsFeedId: string): Promise<NewsFeedLikeResponse> {
    const likedEntry = await newsFeedRepository.likeEntry(newsFeedId, userId);

    if (!likedEntry) {
      throwNewsFeedNotFound();
    }

    return toNewsFeedLikeResponse(likedEntry);
  },

  async syncNewsFeed(payload: NewsFeedSyncRequest): Promise<void> {
    const events = payload.events ?? [];
    const metricRefreshContext = buildMetricRefreshContext(events);

    for (const event of events) {
      await createEntry(event);
    }

    const refreshMetrics = [...new Set(payload.refreshMetrics ?? [])];
    for (const metric of refreshMetrics) {
      await refreshMetric(metric, metricRefreshContext);
    }
  },

  async refreshPopularStoreMetric(
    context: MetricRefreshContext = buildMetricRefreshContext(),
  ): Promise<void> {
    const stores = await storeClient.listStoresForPopularityRanking();
    const topStore = pickPopularStore(stores);

    if (!topStore) {
      await publishMetricChangeIfNeeded('POPULAR_STORE', null, context);
      return;
    }

    await publishMetricChangeIfNeeded('POPULAR_STORE', topStore, context, (store) => ({
      type: 'POPULAR_STORE_CHANGED',
      storeId: store.id,
      storeName: store.name,
      title: `${store.name} is now popular`,
      description: `${store.name} is now the most popular store by rating.`,
      metadata: {
        rating: topStore.rating,
      },
    }));
  },

  async refreshMostActiveStoreMetric(
    context: MetricRefreshContext = buildMetricRefreshContext(),
  ): Promise<void> {
    const topStoreId = await newsFeedRepository.findMostActiveStoreId();

    if (!topStoreId) {
      await publishMetricChangeIfNeeded('MOST_ACTIVE_STORE', null, context);
      return;
    }

    const topStore = await storeClient.findStoreBasicById(topStoreId);

    await publishMetricChangeIfNeeded('MOST_ACTIVE_STORE', topStore, context, (store) => ({
      type: 'MOST_ACTIVE_STORE_CHANGED',
      storeId: store.id,
      storeName: store.name,
      title: `${store.name} is now most active`,
      description: `${store.name} has the highest recent store activity.`,
    }));
  },

  async refreshMostSearchedStoreMetric(
    context: MetricRefreshContext = buildMetricRefreshContext(),
  ): Promise<void> {
    const topStore = await storeClient.findMostSearchedStore();

    if (!topStore || topStore.searchCount <= 0) {
      await publishMetricChangeIfNeeded('MOST_SEARCHED_STORE', null, context);
      return;
    }

    await publishMetricChangeIfNeeded('MOST_SEARCHED_STORE', topStore, context, (store) => ({
      type: 'MOST_SEARCHED_STORE_CHANGED',
      storeId: store.id,
      storeName: store.name,
      title: `${store.name} is now most searched`,
      description: `${store.name} is currently the most searched store.`,
      metadata: {
        searchCount: topStore.searchCount,
      },
    }));
  },
};
