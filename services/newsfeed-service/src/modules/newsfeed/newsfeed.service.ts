import type {
  CreateNewsFeedPostRequest,
  ManagedUserStatus,
  NewsFeedApprovalStatus,
  NewsFeedDeleteResponse,
  NewsFeedItem,
  NewsFeedLikeResponse,
  NewsFeedListResponse,
  NewsFeedMetric,
  NewsFeedProductSnapshot,
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
import { logger } from '../../config/logger';
import { AppError } from '../../shared/app-error';
import {
  deleteManagedImages,
  isBase64ImageInput,
  persistBase64Image,
  resolveNewsFeedImagePublicPath,
} from '../../shared/image-storage';
import { toPublicAssetUrl } from '../../shared/public-asset-url';
import {
  invalidateNewsFeedListCache,
  readNewsFeedListCache,
  writeNewsFeedListCache,
} from './newsfeed.cache';
import { authClient } from '../auth/auth.client';
import {
  newsFeedRepository,
  type DeletedNewsFeedItemRecord,
  type NewsFeedItemRecord,
} from './newsfeed.repository';
import { storeClient } from '../store/store.client';

const DEFAULT_NEWSFEED_LIMIT = 20;
const MAX_NEWSFEED_LIMIT = 50;

interface NormalizedMetadataResult {
  createdImageUrls: string[];
  value: unknown;
}

interface NormalizedNewsFeedImagePayload<TPayload> {
  createdImageUrls: string[];
  payload: TPayload;
}

function parseRatingValue(rating: string): number {
  const match = rating.match(/(\d+(?:\.\d+)?)/);

  if (!match) {
    return 0;
  }

  const parsed = Number.parseFloat(match[1]);
  return Number.isFinite(parsed) ? parsed : 0;
}

function sanitizeImageValue(value: string): string {
  return toPublicAssetUrl(value);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function sanitizeMetadataValue(value: unknown, key?: string): unknown {
  if (typeof value === 'string') {
    return key?.toLowerCase().includes('image') ? sanitizeImageValue(value) : value;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeMetadataValue(entry, key));
  }

  if (!isObject(value)) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([nestedKey, nestedValue]) => [
      nestedKey,
      sanitizeMetadataValue(nestedValue, nestedKey),
    ]),
  );
}

function toMetadata(value: Prisma.JsonValue | null): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }

  return sanitizeMetadataValue(value) as Record<string, unknown>;
}

function toNewsFeedItem(item: NewsFeedItemRecord): NewsFeedItem {
  return {
    id: item.id,
    type: item.type,
    source: item.source ?? 'SYSTEM',
    approvalStatus: item.approvalStatus ?? 'APPROVED',
    title: item.title,
    description: item.description,
    image: item.image ? sanitizeImageValue(item.image) : undefined,
    authorUserId: item.authorUserId ?? undefined,
    storeId: item.storeId ?? undefined,
    storeName: item.storeName ?? undefined,
    metadata: toMetadata(item.metadata),
    likesCount: item._count.likes,
    createdAt: item.createdAt.toISOString(),
  };
}

function toNewsFeedLikeResponse(newsFeedLike: {
  id: string;
  likesCount: number;
}): NewsFeedLikeResponse {
  return {
    id: newsFeedLike.id,
    likesCount: newsFeedLike.likesCount,
  };
}

function normalizePagination(
  page = 1,
  limit = DEFAULT_NEWSFEED_LIMIT,
): { page: number; limit: number } {
  const normalizedPage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const normalizedLimit = Number.isFinite(limit)
    ? Math.min(Math.max(Math.floor(limit), 1), MAX_NEWSFEED_LIMIT)
    : DEFAULT_NEWSFEED_LIMIT;

  return {
    page: normalizedPage,
    limit: normalizedLimit,
  };
}

function subtractCalendarMonth(date: Date): Date {
  const result = new Date(date);
  const originalDay = result.getUTCDate();

  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() - 1);

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

function throwNewsFeedAdminRequired(action: string): never {
  throw new AppError(`Only active admin users can ${action}`, {
    statusCode: StatusCodes.FORBIDDEN,
    code: 'NEWSFEED_ADMIN_REQUIRED',
  });
}

function toStoreSummary(store: StoreSummaryWithOwner): StoreSummary {
  return {
    id: store.id,
    name: store.name,
    active: store.active,
    location: store.location,
    rating: store.rating,
    image: sanitizeImageValue(store.image),
    badges: store.badges,
    delivery: store.delivery,
    minOrderRs: store.minOrderRs,
    openingTime: store.openingTime,
    closingTime: store.closingTime,
    phoneNumber: store.phoneNumber,
  };
}

function toProductSnapshot(value: unknown): NewsFeedProductSnapshot | undefined {
  if (!isObject(value)) {
    return undefined;
  }

  const { id, name, price, image, tag, description } = value;

  if (typeof name !== 'string' || typeof price !== 'string' || typeof image !== 'string') {
    return undefined;
  }

  return {
    ...(typeof id === 'string' && id.trim().length > 0 ? { id } : {}),
    name,
    price,
    image: sanitizeImageValue(image),
    ...(typeof tag === 'string' && tag.trim().length > 0 ? { tag } : {}),
    ...(typeof description === 'string' && description.trim().length > 0 ? { description } : {}),
  };
}

function sanitizeUserPublic(user: UserPublic): UserPublic {
  const profileImage = user.profile.image;

  return {
    ...user,
    profile: {
      ...user.profile,
      image: typeof profileImage === 'string' ? sanitizeImageValue(profileImage) : profileImage,
    },
  };
}

function sanitizeStoreSummaryValue(store: StoreSummary): StoreSummary {
  return {
    ...store,
    image: sanitizeImageValue(store.image),
  };
}

function sanitizeProductSnapshotValue(product: NewsFeedProductSnapshot): NewsFeedProductSnapshot {
  return {
    ...product,
    image: sanitizeImageValue(product.image),
  };
}

function sanitizeNewsFeedItemValue(item: NewsFeedItem): NewsFeedItem {
  return {
    ...item,
    image: item.image ? sanitizeImageValue(item.image) : undefined,
    author: item.author ? sanitizeUserPublic(item.author) : undefined,
    store: item.store ? sanitizeStoreSummaryValue(item.store) : undefined,
    storeOwner: item.storeOwner ? sanitizeUserPublic(item.storeOwner) : undefined,
    product: item.product ? sanitizeProductSnapshotValue(item.product) : undefined,
    metadata: item.metadata ? (sanitizeMetadataValue(item.metadata) as Record<string, unknown>) : undefined,
  };
}

function sanitizeNewsFeedListResponse(feed: NewsFeedListResponse): NewsFeedListResponse {
  return {
    ...feed,
    items: feed.items.map(sanitizeNewsFeedItemValue),
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

function buildStoreSummaryMap(stores: StoreSummaryWithOwner[]): Map<number, StoreSummaryWithOwner> {
  return new Map(stores.map((store) => [store.id, store]));
}

function buildUserMap(users: UserPublic[]): Map<string, UserPublic> {
  return new Map(users.map((user) => [user.id, user]));
}

function canManageNewsFeed(user: ManagedUserStatus): boolean {
  return user.isActive && (user.usertype === 0 || user.usertype === 1);
}

async function ensureActiveNewsFeedManager(requesterId: string, action: string): Promise<void> {
  const requester = await authClient.getManagedUserStatus(requesterId);

  if (!requester || !canManageNewsFeed(requester)) {
    throwNewsFeedAdminRequired(action);
  }
}

async function cleanupManagedNewsFeedImagesBestEffort(
  imageUrls: string[],
  action: string,
): Promise<void> {
  if (imageUrls.length === 0) {
    return;
  }

  try {
    await deleteManagedImages(imageUrls);
  } catch (error) {
    logger.error({ action, error, imageUrls }, 'Failed to clean up managed newsfeed images');
  }
}

async function normalizeMetadataImages(value: unknown, key?: string): Promise<NormalizedMetadataResult> {
  if (typeof value === 'string') {
    if (!key?.toLowerCase().includes('image') || !isBase64ImageInput(value)) {
      return {
        createdImageUrls: [],
        value,
      };
    }

    const image = await persistBase64Image(value);

    return {
      createdImageUrls: [image],
      value: image,
    };
  }

  if (Array.isArray(value)) {
    const createdImageUrls: string[] = [];
    const normalizedEntries = [];

    try {
      for (const entry of value) {
        const normalizedEntry = await normalizeMetadataImages(entry, key);
        createdImageUrls.push(...normalizedEntry.createdImageUrls);
        normalizedEntries.push(normalizedEntry.value);
      }
    } catch (error) {
      await cleanupManagedNewsFeedImagesBestEffort(
        createdImageUrls,
        'metadata image normalization rollback',
      );
      throw error;
    }

    return {
      createdImageUrls,
      value: normalizedEntries,
    };
  }

  if (!isObject(value)) {
    return {
      createdImageUrls: [],
      value,
    };
  }

  const createdImageUrls: string[] = [];
  const normalizedEntries: [string, unknown][] = [];

  try {
    for (const [nestedKey, nestedValue] of Object.entries(value)) {
      const normalizedEntry = await normalizeMetadataImages(nestedValue, nestedKey);
      createdImageUrls.push(...normalizedEntry.createdImageUrls);
      normalizedEntries.push([nestedKey, normalizedEntry.value]);
    }
  } catch (error) {
    await cleanupManagedNewsFeedImagesBestEffort(
      createdImageUrls,
      'metadata image normalization rollback',
    );
    throw error;
  }

  return {
    createdImageUrls,
    value: Object.fromEntries(normalizedEntries),
  };
}

async function normalizeSyncEventImages(
  event: NewsFeedSyncEvent,
): Promise<NormalizedNewsFeedImagePayload<NewsFeedSyncEvent>> {
  const createdImageUrls: string[] = [];

  try {
    const image =
      event.image && isBase64ImageInput(event.image)
        ? await persistBase64Image(event.image)
        : event.image;

    if (image && image !== event.image) {
      createdImageUrls.push(image);
    }

    const metadata = event.metadata
      ? await normalizeMetadataImages(event.metadata)
      : {
          createdImageUrls: [],
          value: undefined,
        };

    createdImageUrls.push(...metadata.createdImageUrls);

    return {
      createdImageUrls,
      payload: {
        ...event,
        image,
        metadata: metadata.value as Record<string, unknown> | undefined,
      },
    };
  } catch (error) {
    await cleanupManagedNewsFeedImagesBestEffort(
      createdImageUrls,
      'sync event image normalization rollback',
    );
    throw error;
  }
}

async function normalizeUserPostPayload(
  payload: CreateNewsFeedPostRequest,
): Promise<NormalizedNewsFeedImagePayload<CreateNewsFeedPostRequest>> {
  if (!payload.image || !isBase64ImageInput(payload.image)) {
    return {
      createdImageUrls: [],
      payload,
    };
  }

  const image = await persistBase64Image(payload.image);

  return {
    createdImageUrls: [image],
    payload: {
      ...payload,
      image,
    },
  };
}

function collectManagedImageUrlsFromValue(value: unknown, key?: string): string[] {
  if (typeof value === 'string') {
    return key?.toLowerCase().includes('image') && resolveNewsFeedImagePublicPath(value) ? [value] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) => collectManagedImageUrlsFromValue(entry, key));
  }

  if (!isObject(value)) {
    return [];
  }

  return Object.entries(value).flatMap(([nestedKey, nestedValue]) =>
    collectManagedImageUrlsFromValue(nestedValue, nestedKey),
  );
}

function collectManagedImageUrlsFromDeletedEntry(entry: DeletedNewsFeedItemRecord): string[] {
  const imageUrls = new Set<string>();

  if (entry.image && resolveNewsFeedImagePublicPath(entry.image)) {
    imageUrls.add(entry.image);
  }

  const metadata = toMetadata(entry.metadata);

  if (metadata) {
    for (const imageUrl of collectManagedImageUrlsFromValue(metadata)) {
      imageUrls.add(imageUrl);
    }
  }

  return [...imageUrls];
}

interface NewsFeedEnrichmentData {
  storeSummariesById: Map<number, StoreSummaryWithOwner>;
  usersById: Map<string, UserPublic>;
}

async function buildNewsFeedEnrichmentData(
  items: NewsFeedItemRecord[],
): Promise<NewsFeedEnrichmentData> {
  const storeIds = [
    ...new Set(
      items
        .map((item) => item.storeId)
        .filter((storeId): storeId is number => typeof storeId === 'number'),
    ),
  ];
  const stores =
    storeIds.length > 0 ? await storeClient.findStoreSummariesByIds(storeIds).catch(() => []) : [];
  const storeSummariesById = buildStoreSummaryMap(stores);
  const userIds = new Set<string>();

  for (const store of stores) {
    if (store.ownerUserId.trim().length > 0) {
      userIds.add(store.ownerUserId);
    }
  }

  for (const item of items) {
    if (item.authorUserId && item.authorUserId.trim().length > 0) {
      userIds.add(item.authorUserId);
    }
  }

  const users =
    userIds.size > 0
      ? await authClient.findUsersPublicByIds([...userIds]).catch(() => [])
      : [];

  return {
    storeSummariesById,
    usersById: buildUserMap(users),
  };
}

function enrichNewsFeedItem(
  item: NewsFeedItemRecord,
  enrichmentData: NewsFeedEnrichmentData,
): NewsFeedItem {
  const baseItem = toNewsFeedItem(item);
  const attachedStoreSnapshot =
    typeof item.storeId === 'number'
      ? (enrichmentData.storeSummariesById.get(item.storeId) ?? null)
      : null;
  const attachedStore = attachedStoreSnapshot ? toStoreSummary(attachedStoreSnapshot) : undefined;
  const attachedStoreOwner = attachedStoreSnapshot?.ownerUserId
    ? enrichmentData.usersById.get(attachedStoreSnapshot.ownerUserId)
    : undefined;
  const author = item.authorUserId ? enrichmentData.usersById.get(item.authorUserId) : undefined;

  return {
    ...baseItem,
    author: author ? sanitizeUserPublic(author) : undefined,
    store: attachedStore,
    storeOwner: attachedStoreOwner ? sanitizeUserPublic(attachedStoreOwner) : undefined,
    product: toAttachedProduct(item),
  };
}

async function enrichNewsFeedItems(items: NewsFeedItemRecord[]): Promise<NewsFeedItem[]> {
  const enrichmentData = await buildNewsFeedEnrichmentData(items);

  return items.map((item) => enrichNewsFeedItem(item, enrichmentData));
}

async function createEntry(payload: NewsFeedSyncEvent): Promise<void> {
  const normalizedPayload = await normalizeSyncEventImages(payload);

  try {
    await newsFeedRepository.createEntry({
      ...normalizedPayload.payload,
      metadata: normalizedPayload.payload.metadata as Prisma.InputJsonValue | undefined,
    });
  } catch (error) {
    await cleanupManagedNewsFeedImagesBestEffort(
      normalizedPayload.createdImageUrls,
      'system newsfeed create rollback',
    );
    throw error;
  }
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

async function cleanupExpiredNewsFeedEntries(now = new Date()): Promise<void> {
  const deletedEntries = await newsFeedRepository.deleteEntriesOlderThan(subtractCalendarMonth(now));

  if (deletedEntries.length === 0) {
    return;
  }

  const imageUrls = deletedEntries.flatMap(collectManagedImageUrlsFromDeletedEntry);

  await cleanupManagedNewsFeedImagesBestEffort(imageUrls, 'expired newsfeed cleanup');
  await invalidateNewsFeedListCache();
}

export const newsFeedService = {
  async listNewsFeed(page = 1, limit = DEFAULT_NEWSFEED_LIMIT): Promise<NewsFeedListResponse> {
    await cleanupExpiredNewsFeedEntries();

    const pagination = normalizePagination(page, limit);
    const cachedFeed = await readNewsFeedListCache(pagination.page, pagination.limit);

    if (cachedFeed) {
      return sanitizeNewsFeedListResponse(cachedFeed);
    }

    const { items, hasMore } = await newsFeedRepository.listEntries(
      pagination.page,
      pagination.limit,
    );
    const payload = {
      items: await enrichNewsFeedItems(items),
      page: pagination.page,
      limit: pagination.limit,
      hasMore,
    } satisfies NewsFeedListResponse;

    await writeNewsFeedListCache(pagination.page, pagination.limit, payload);

    return payload;
  },

  async createNewsFeedPost(
    userId: string,
    payload: CreateNewsFeedPostRequest,
  ): Promise<NewsFeedItem> {
    await cleanupExpiredNewsFeedEntries();

    const normalizedPayload = await normalizeUserPostPayload(payload);

    try {
      const createdPost = await newsFeedRepository.createUserPost({
        authorUserId: userId,
        title: normalizedPayload.payload.title,
        description: normalizedPayload.payload.description,
        image: normalizedPayload.payload.image,
      });
      const enrichmentData = await buildNewsFeedEnrichmentData([createdPost]);

      return enrichNewsFeedItem(createdPost, enrichmentData);
    } catch (error) {
      await cleanupManagedNewsFeedImagesBestEffort(
        normalizedPayload.createdImageUrls,
        'user newsfeed create rollback',
      );
      throw error;
    }
  },

  async listMyNewsFeedPosts(
    userId: string,
    page = 1,
    limit = DEFAULT_NEWSFEED_LIMIT,
  ): Promise<NewsFeedListResponse> {
    await cleanupExpiredNewsFeedEntries();

    const pagination = normalizePagination(page, limit);
    const { items, hasMore } = await newsFeedRepository.listUserPostsByAuthor(
      userId,
      pagination.page,
      pagination.limit,
    );

    return {
      items: await enrichNewsFeedItems(items),
      page: pagination.page,
      limit: pagination.limit,
      hasMore,
    };
  },

  async listUserSubmittedNewsFeed(
    requesterId: string,
    page = 1,
    limit = DEFAULT_NEWSFEED_LIMIT,
    approvalStatus?: NewsFeedApprovalStatus,
  ): Promise<NewsFeedListResponse> {
    await cleanupExpiredNewsFeedEntries();
    await ensureActiveNewsFeedManager(requesterId, 'review user-submitted newsfeed posts');

    const pagination = normalizePagination(page, limit);
    const { items, hasMore } = await newsFeedRepository.listUserSubmittedEntries(
      pagination.page,
      pagination.limit,
      approvalStatus,
    );

    return {
      items: await enrichNewsFeedItems(items),
      page: pagination.page,
      limit: pagination.limit,
      hasMore,
    };
  },

  async reviewNewsFeedPost(
    requesterId: string,
    newsFeedId: string,
    approvalStatus: Exclude<NewsFeedApprovalStatus, 'PENDING'>,
  ): Promise<NewsFeedItem> {
    await cleanupExpiredNewsFeedEntries();
    await ensureActiveNewsFeedManager(requesterId, 'approve or disapprove user-submitted newsfeed posts');

    const updatedPost = await newsFeedRepository.updateApprovalStatus(newsFeedId, approvalStatus);

    if (!updatedPost) {
      throwNewsFeedNotFound();
    }

    await invalidateNewsFeedListCache();

    const enrichmentData = await buildNewsFeedEnrichmentData([updatedPost]);
    return enrichNewsFeedItem(updatedPost, enrichmentData);
  },

  async deleteMyNewsFeedPost(userId: string, newsFeedId: string): Promise<NewsFeedDeleteResponse> {
    await cleanupExpiredNewsFeedEntries();

    const deletedPost = await newsFeedRepository.deleteUserPostByAuthor(newsFeedId, userId);

    if (!deletedPost) {
      throwNewsFeedNotFound();
    }

    await cleanupManagedNewsFeedImagesBestEffort(
      collectManagedImageUrlsFromDeletedEntry(deletedPost),
      'user newsfeed delete',
    );
    await invalidateNewsFeedListCache();

    return {
      id: deletedPost.id,
      message: 'Newsfeed post deleted',
    };
  },

  async likeNewsFeed(userId: string, newsFeedId: string): Promise<NewsFeedLikeResponse> {
    await cleanupExpiredNewsFeedEntries();

    const likedEntry = await newsFeedRepository.likeEntry(newsFeedId, userId);

    if (!likedEntry) {
      throwNewsFeedNotFound();
    }

    await invalidateNewsFeedListCache();
    return toNewsFeedLikeResponse(likedEntry);
  },

  async syncNewsFeed(payload: NewsFeedSyncRequest): Promise<void> {
    await cleanupExpiredNewsFeedEntries();

    const events = payload.events ?? [];
    const metricRefreshContext = buildMetricRefreshContext(events);

    for (const event of events) {
      await createEntry(event);
    }

    const refreshMetrics = [...new Set(payload.refreshMetrics ?? [])];
    for (const metric of refreshMetrics) {
      await refreshMetric(metric, metricRefreshContext);
    }

    await invalidateNewsFeedListCache();
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
