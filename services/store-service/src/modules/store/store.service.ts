import type {
  CreateStoreRequest,
  CreateStoreRatingRequest,
  ManagedUserStatus,
  MostSearchedStoreSnapshot,
  NewsFeedMetric,
  StoreReview,
  NewsFeedSyncEvent,
  StoreBasicSnapshot,
  StoreDetails,
  StoreProduct,
  StoreProductInput,
  StoreRankingSnapshot,
  StoreSummary,
  StoreSummaryWithOwner,
  UpdateStoreRequest,
} from '@community/contracts';
import { Prisma } from '../../generated/prisma';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../../config/logger';
import { AppError } from '../../shared/app-error';
import {
  deleteManagedImages,
  isBase64ImageInput,
  isManagedImagePublicPath,
  persistBase64Image,
} from '../../shared/image-storage';
import {
  invalidateStoreListCache,
  readStoreListCache,
  shouldSyncMostSearchedMetric,
  writeStoreListCache,
} from './store.cache';
import { authClient } from '../auth/auth-client';
import { newsFeedClient } from '../newsfeed/newsfeed.client';
import {
  storeRepository,
  type StoreReviewRecord,
  type StoreWithProductsRecord,
} from './store.repository';
import {
  buildProductChanges,
  buildStoreCreatedEvent,
  buildStoreDeletedEvent,
  buildStoreUpdateActivitySync,
  parseStoreBadges,
} from './store-newsfeed-events';
import { matchStoreProducts } from './store-product-matcher';

function toStoreProduct(product: StoreWithProductsRecord['products'][number]): StoreProduct {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    tag: product.tag ?? undefined,
    description: product.description ?? undefined,
  };
}

function toStoreReview(review: StoreReviewRecord): StoreReview {
  return {
    id: review.id,
    rating: Number(review.rating),
    description: review.description,
    createdAt: review.createdAt.toISOString(),
  };
}

function toStoreSummary(store: {
  id: number;
  name: string;
  active: boolean;
  location: string;
  rating: string;
  image: string;
  badges: Prisma.JsonValue | null;
  delivery: string;
  minOrderRs: string;
  openingTime: string;
  closingTime: string;
  phoneNumber: string;
  ratings?: StoreReviewRecord[];
}): StoreSummary {
  return {
    id: store.id,
    name: store.name,
    active: store.active,
    location: store.location,
    rating: store.rating,
    image: store.image,
    badges: parseStoreBadges(store.badges),
    delivery: store.delivery,
    minOrderRs: store.minOrderRs,
    openingTime: store.openingTime,
    closingTime: store.closingTime,
    phoneNumber: store.phoneNumber,
    reviews: store.ratings?.map(toStoreReview),
  };
}

function toStoreDetails(store: StoreWithProductsRecord): StoreDetails {
  return {
    ...toStoreSummary(store),
    products: store.products.map(toStoreProduct),
  };
}

function toStoreBasicSnapshot(store: { id: number; name: string }): StoreBasicSnapshot {
  return {
    id: store.id,
    name: store.name,
  };
}

function toStoreRankingSnapshot(store: {
  id: number;
  name: string;
  rating: string;
  updatedAt: Date;
}): StoreRankingSnapshot {
  return {
    ...toStoreBasicSnapshot(store),
    rating: store.rating,
    updatedAt: store.updatedAt.toISOString(),
  };
}

function toMostSearchedStoreSnapshot(store: {
  id: number;
  name: string;
  searchCount: number;
}): MostSearchedStoreSnapshot {
  return {
    ...toStoreBasicSnapshot(store),
    searchCount: store.searchCount,
  };
}

interface NormalizedStorePayloadResult<TPayload> {
  createdImageUrls: string[];
  payload: TPayload;
}

interface NormalizedProductImagesResult<TProduct extends { image: string }> {
  createdImageUrls: string[];
  products: TProduct[] | undefined;
}

async function cleanupManagedStoreImagesBestEffort(
  imageUrls: string[],
  action: string,
): Promise<void> {
  if (imageUrls.length === 0) {
    return;
  }

  try {
    await deleteManagedImages(imageUrls);
  } catch (error) {
    logger.error({ error, action, imageUrls }, 'Failed to clean up managed store images');
  }
}

async function normalizeProductImages<TProduct extends { image: string }>(
  products?: TProduct[],
): Promise<NormalizedProductImagesResult<TProduct>> {
  if (!products) {
    return {
      createdImageUrls: [],
      products: undefined,
    };
  }

  const createdImageUrls: string[] = [];
  const normalizedProducts = [];

  try {
    for (const product of products) {
      if (!isBase64ImageInput(product.image)) {
        normalizedProducts.push(product);
        continue;
      }

      const image = await persistBase64Image(product.image, 'product');
      createdImageUrls.push(image);
      normalizedProducts.push({
        ...product,
        image,
      });
    }
  } catch (error) {
    await cleanupManagedStoreImagesBestEffort(
      createdImageUrls,
      'product image normalization rollback',
    );
    throw error;
  }

  return {
    createdImageUrls,
    products: normalizedProducts,
  };
}

async function buildCreatePayload(
  payload: CreateStoreRequest,
): Promise<NormalizedStorePayloadResult<{
  badges: string[];
  closingTime: string;
  delivery: string;
  image: string;
  location: string;
  minOrderRs: string;
  name: string;
  openingTime: string;
  phoneNumber: string;
  products: StoreProductInput[];
}>> {
  const normalizedProducts = await normalizeProductImages(payload.products ?? []);
  const createdImageUrls = [...normalizedProducts.createdImageUrls];

  try {
    const image = isBase64ImageInput(payload.image)
      ? await persistBase64Image(payload.image, 'store')
      : payload.image;

    if (image !== payload.image) {
      createdImageUrls.push(image);
    }

    return {
      createdImageUrls,
      payload: {
        ...payload,
        badges: [],
        image,
        products: normalizedProducts.products ?? [],
      },
    };
  } catch (error) {
    await cleanupManagedStoreImagesBestEffort(
      createdImageUrls,
      'store image normalization rollback',
    );
    throw error;
  }
}

async function buildUpdatePayload(
  payload: UpdateStoreRequest,
): Promise<NormalizedStorePayloadResult<{
  closingTime?: string;
  delivery?: string;
  image?: string;
  location?: string;
  minOrderRs?: string;
  name?: string;
  openingTime?: string;
  phoneNumber?: string;
  products?: StoreProductInput[];
}>> {
  const normalizedProducts = await normalizeProductImages(payload.products);
  const createdImageUrls = [...normalizedProducts.createdImageUrls];

  try {
    const image =
      payload.image === undefined || !isBase64ImageInput(payload.image)
        ? payload.image
        : await persistBase64Image(payload.image, 'store');

    if (image !== undefined && image !== payload.image) {
      createdImageUrls.push(image);
    }

    return {
      createdImageUrls,
      payload: {
        ...payload,
        image,
        products: normalizedProducts.products ?? undefined,
      },
    };
  } catch (error) {
    await cleanupManagedStoreImagesBestEffort(
      createdImageUrls,
      'store update image normalization rollback',
    );
    throw error;
  }
}

function collectManagedImageUrls(store: Pick<StoreWithProductsRecord, 'image' | 'products'>): string[] {
  const imageUrls = new Set<string>();

  if (isManagedImagePublicPath(store.image)) {
    imageUrls.add(store.image);
  }

  for (const product of store.products) {
    if (isManagedImagePublicPath(product.image)) {
      imageUrls.add(product.image);
    }
  }

  return [...imageUrls];
}

function collectReplacedManagedImageUrls(
  existingStore: StoreWithProductsRecord,
  updatedStore: StoreWithProductsRecord,
): string[] {
  const imageUrls = new Set<string>();

  if (existingStore.image !== updatedStore.image && isManagedImagePublicPath(existingStore.image)) {
    imageUrls.add(existingStore.image);
  }

  const updatedProductsById = new Map(updatedStore.products.map((product) => [product.id, product]));

  for (const existingProduct of existingStore.products) {
    const updatedProduct = updatedProductsById.get(existingProduct.id);

    if (!updatedProduct) {
      if (isManagedImagePublicPath(existingProduct.image)) {
        imageUrls.add(existingProduct.image);
      }

      continue;
    }

    if (existingProduct.image !== updatedProduct.image && isManagedImagePublicPath(existingProduct.image)) {
      imageUrls.add(existingProduct.image);
    }
  }

  return [...imageUrls];
}

function mergeStoreBadges(
  existingBadgesValue: Prisma.JsonValue | null,
  nextBadges?: string[],
): { badgesChanged: boolean; mergedBadges?: string[] } {
  if (nextBadges === undefined) {
    return {
      badgesChanged: false,
    };
  }

  const currentBadges = parseStoreBadges(existingBadgesValue);
  const mergedBadges = [...currentBadges];

  for (const badge of nextBadges) {
    if (!mergedBadges.includes(badge)) {
      mergedBadges.push(badge);
    }
  }

  return {
    badgesChanged:
      mergedBadges.length !== currentBadges.length ||
      mergedBadges.some((badge, index) => badge !== currentBadges[index]),
    mergedBadges,
  };
}

function hasSearchTerm(search?: string): boolean {
  return typeof search === 'string' && search.trim().length > 0;
}

function throwMyStoreNotFound(): never {
  throw new AppError('Store not found for this user', {
    statusCode: StatusCodes.NOT_FOUND,
    code: 'STORE_NOT_FOUND',
  });
}

function throwStoreNotFound(): never {
  throw new AppError('Store not found', {
    statusCode: StatusCodes.NOT_FOUND,
    code: 'STORE_NOT_FOUND',
  });
}

function canManageStores(user: ManagedUserStatus): boolean {
  return user.isActive && (user.usertype === 0 || user.usertype === 1);
}

async function ensureActiveStoreManager(requesterId: string, action: string): Promise<void> {
  const requester = await authClient.getManagedUserStatus(requesterId);

  if (!requester || !canManageStores(requester)) {
    throw new AppError(`Only active admin users can ${action}`, {
      statusCode: StatusCodes.FORBIDDEN,
      code: 'STORE_ADMIN_REQUIRED',
    });
  }
}

function getUniqueConstraintTargets(error: Prisma.PrismaClientKnownRequestError): string[] {
  const target = error.meta?.target;

  if (Array.isArray(target)) {
    return target.filter((value): value is string => typeof value === 'string');
  }

  if (typeof target === 'string') {
    return [target];
  }

  return [];
}

function handlePrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      const uniqueTargets = getUniqueConstraintTargets(error);

      if (uniqueTargets.some((value) => value.includes('ownerUserId'))) {
        throw new AppError('Only one store is allowed per user', {
          statusCode: StatusCodes.CONFLICT,
          code: 'STORE_ALREADY_EXISTS',
        });
      }

      if (
        uniqueTargets.some((value) => value.includes('storeId_userId')) ||
        (uniqueTargets.some((value) => value.includes('storeId')) &&
          uniqueTargets.some((value) => value.includes('userId')))
      ) {
        throw new AppError('You have already rated this store', {
          statusCode: StatusCodes.CONFLICT,
          code: 'STORE_ALREADY_RATED',
        });
      }

      throw new AppError('Only one store is allowed per user', {
        statusCode: StatusCodes.CONFLICT,
        code: 'STORE_ALREADY_EXISTS',
      });
    }
  }

  throw error;
}

async function syncNewsFeed(
  events?: NewsFeedSyncEvent[],
  refreshMetrics?: NewsFeedMetric[],
): Promise<void> {
  await newsFeedClient.syncBestEffort({
    events: events && events.length > 0 ? events : undefined,
    refreshMetrics: refreshMetrics && refreshMetrics.length > 0 ? refreshMetrics : undefined,
  });
}

export const storeService = {
  async listStores(search?: string, page = 1): Promise<StoreSummary[]> {
    if (!hasSearchTerm(search)) {
      const cachedStores = await readStoreListCache(search, page);

      if (cachedStores) {
        return cachedStores;
      }
    }

    const stores = await storeRepository.listStores(search, page);
    const storeSummaries = stores.map(toStoreSummary);

    if (hasSearchTerm(search) && stores.length > 0) {
      await storeRepository.incrementSearchCountByIds(stores.map((store) => store.id));

      if (await shouldSyncMostSearchedMetric()) {
        await syncNewsFeed(undefined, ['MOST_SEARCHED_STORE']);
      }
    } else if (!hasSearchTerm(search)) {
      await writeStoreListCache(search, page, storeSummaries);
    }

    return storeSummaries;
  },

  async listStoresForAdmin(
    requesterId: string,
    search?: string,
    page = 1,
    active?: boolean,
  ): Promise<StoreSummary[]> {
    await ensureActiveStoreManager(requesterId, 'view stores for management');

    const stores = await storeRepository.listStoresForAdmin(search, page, active);

    return stores.map(toStoreSummary);
  },

  async getMyStore(userId: string): Promise<StoreDetails> {
    const store = await storeRepository.findStoreByUserId(userId);

    if (!store) {
      throwMyStoreNotFound();
    }

    return toStoreDetails(store);
  },

  async getMyStoreProducts(userId: string): Promise<StoreProduct[]> {
    const store = await storeRepository.findStoreByUserId(userId);

    if (!store) {
      throwMyStoreNotFound();
    }

    return store.products.map(toStoreProduct);
  },

  async createMyStore(userId: string, payload: CreateStoreRequest): Promise<StoreDetails> {
    const existingStore = await storeRepository.findStoreByUserId(userId);

    if (existingStore) {
      throw new AppError('Only one store is allowed per user', {
        statusCode: StatusCodes.CONFLICT,
        code: 'STORE_ALREADY_EXISTS',
      });
    }

    const normalizedPayload = await buildCreatePayload(payload);

    try {
      const store = await storeRepository.createForUser(userId, normalizedPayload.payload);
      await invalidateStoreListCache();
      await syncNewsFeed([buildStoreCreatedEvent(store)]);
      return toStoreDetails(store);
    } catch (error) {
      await cleanupManagedStoreImagesBestEffort(
        normalizedPayload.createdImageUrls,
        'store creation rollback',
      );
      handlePrismaError(error);
    }
  },

  async updateMyStore(userId: string, payload: UpdateStoreRequest): Promise<StoreDetails> {
    const existingStore = await storeRepository.findStoreByUserId(userId);

    if (!existingStore) {
      throwMyStoreNotFound();
    }

    const normalizedPayload = await buildUpdatePayload(payload);
    const productMatches =
      normalizedPayload.payload.products !== undefined
        ? matchStoreProducts(existingStore.products, normalizedPayload.payload.products)
        : undefined;
    const productChanges = productMatches ? buildProductChanges(productMatches) : [];
    let updatedStore: StoreWithProductsRecord;

    try {
      updatedStore = await storeRepository.updateById(
        existingStore.id,
        normalizedPayload.payload,
        existingStore.products,
      );
    } catch (error) {
      await cleanupManagedStoreImagesBestEffort(
        normalizedPayload.createdImageUrls,
        'store update rollback',
      );
      throw error;
    }

    await cleanupManagedStoreImagesBestEffort(
      collectReplacedManagedImageUrls(existingStore, updatedStore),
      'store update replacement',
    );
    const { events: newsFeedEvents, refreshMetrics } = buildStoreUpdateActivitySync({
      existingStore,
      updatedStore,
      badgesChanged: false,
      productChanges,
    });

    await invalidateStoreListCache();
    await syncNewsFeed(newsFeedEvents, refreshMetrics);

    return toStoreDetails(updatedStore);
  },

  async updateStoreActivation(
    requesterId: string,
    storeId: number,
    active: boolean,
  ): Promise<StoreDetails> {
    await ensureActiveStoreManager(requesterId, 'update store activation');

    const existingStore = await storeRepository.findStoreById(storeId);

    if (!existingStore) {
      throwStoreNotFound();
    }

    if (existingStore.active === active) {
      return toStoreDetails(existingStore);
    }

    const updatedStore = await storeRepository.updateActiveStatusById(storeId, active);
    await invalidateStoreListCache();

    return toStoreDetails(updatedStore);
  },

  async rateStore(
    userId: string,
    storeId: number,
    payload: CreateStoreRatingRequest,
  ): Promise<StoreDetails> {
    const existingStore = await storeRepository.findStoreById(storeId);

    if (!existingStore) {
      throwStoreNotFound();
    }

    if (!existingStore.active) {
      throwStoreNotFound();
    }

    const { badgesChanged, mergedBadges } = mergeStoreBadges(existingStore.badges, payload.badges);

    try {
      const updatedStore = await storeRepository.addRatingForUser(
        storeId,
        userId,
        payload.rating,
        mergedBadges,
        payload.description,
      );
      const { events, refreshMetrics } = buildStoreUpdateActivitySync({
        existingStore,
        updatedStore,
        badgesChanged,
        productChanges: [],
      });

      await invalidateStoreListCache();
      await syncNewsFeed(events, refreshMetrics);

      return toStoreDetails(updatedStore);
    } catch (error) {
      handlePrismaError(error);
    }
  },

  async deleteMyStore(userId: string): Promise<void> {
    const existingStore = await storeRepository.findStoreByUserId(userId);

    if (!existingStore) {
      throwMyStoreNotFound();
    }

    await storeRepository.deleteById(existingStore.id);
    await cleanupManagedStoreImagesBestEffort(
      collectManagedImageUrls(existingStore),
      'store deletion cleanup',
    );
    await invalidateStoreListCache();
    await syncNewsFeed(
      [buildStoreDeletedEvent(existingStore)],
      ['POPULAR_STORE', 'MOST_ACTIVE_STORE', 'MOST_SEARCHED_STORE'],
    );
  },

  async listStoresForPopularityRanking(): Promise<StoreRankingSnapshot[]> {
    const stores = await storeRepository.listStoresForPopularityRanking();
    return stores.map(toStoreRankingSnapshot);
  },

  async findStoreBasicById(storeId: number): Promise<StoreBasicSnapshot | null> {
    const store = await storeRepository.findStoreBasicById(storeId);
    return store ? toStoreBasicSnapshot(store) : null;
  },

  async findStoreSummaryById(storeId: number): Promise<StoreSummaryWithOwner | null> {
    const store = await storeRepository.findStoreSummaryById(storeId);
    return store
      ? {
          ...toStoreSummary(store),
          ownerUserId: store.ownerUserId,
        }
      : null;
  },

  async findStoreSummariesByIds(storeIds: number[]): Promise<StoreSummaryWithOwner[]> {
    if (storeIds.length === 0) {
      return [];
    }

    const stores = await storeRepository.findStoreSummariesByIds(storeIds);
    const storesById = new Map(stores.map((store) => [store.id, store]));

    return storeIds
      .map((storeId) => storesById.get(storeId))
      .filter((store): store is NonNullable<typeof store> => Boolean(store))
      .map((store) => ({
        ...toStoreSummary(store),
        ownerUserId: store.ownerUserId,
      }));
  },

  async findMostSearchedStore(): Promise<MostSearchedStoreSnapshot | null> {
    const store = await storeRepository.findMostSearchedStore();
    return store ? toMostSearchedStoreSnapshot(store) : null;
  },
};
