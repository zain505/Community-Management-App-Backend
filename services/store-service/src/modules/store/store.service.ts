import type {
  CreateStoreRequest,
  CreateStoreRatingRequest,
  MostSearchedStoreSnapshot,
  NewsFeedMetric,
  NewsFeedSyncEvent,
  StoreBasicSnapshot,
  StoreDetails,
  StoreProduct,
  StoreRankingSnapshot,
  StoreSummary,
  StoreSummaryWithOwner,
  UpdateStoreRequest,
} from '@community/contracts';
import { Prisma } from '../../generated/prisma';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../shared/app-error';
import { newsFeedClient } from '../newsfeed/newsfeed.client';
import { storeRepository, type StoreWithProductsRecord } from './store.repository';
import {
  buildProductChanges,
  buildStoreCreatedEvent,
  buildStoreUpdateActivitySync,
  hasStoreBadgesChanged,
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
  };
}

function toStoreSummary(store: {
  id: number;
  name: string;
  location: string;
  rating: string;
  image: string;
  badges: Prisma.JsonValue | null;
  delivery: string;
  minOrderRs: string;
  openingTime: string;
  closingTime: string;
  phoneNumber: string;
}): StoreSummary {
  return {
    id: store.id,
    name: store.name,
    location: store.location,
    rating: store.rating,
    image: store.image,
    badges: parseStoreBadges(store.badges),
    delivery: store.delivery,
    minOrderRs: store.minOrderRs,
    openingTime: store.openingTime,
    closingTime: store.closingTime,
    phoneNumber: store.phoneNumber,
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

function buildCreatePayload(payload: CreateStoreRequest) {
  return {
    ...payload,
    badges: payload.badges ?? [],
    products: payload.products ?? [],
  };
}

function buildUpdatePayload(payload: UpdateStoreRequest) {
  return {
    ...payload,
    badges: payload.badges ?? undefined,
    products: payload.products ?? undefined,
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

async function syncNewsFeed(events?: NewsFeedSyncEvent[], refreshMetrics?: NewsFeedMetric[]): Promise<void> {
  await newsFeedClient.syncBestEffort({
    events: events && events.length > 0 ? events : undefined,
    refreshMetrics: refreshMetrics && refreshMetrics.length > 0 ? refreshMetrics : undefined,
  });
}

export const storeService = {
  async listStores(search?: string, page = 1): Promise<StoreSummary[]> {
    const stores = await storeRepository.listStores(search, page);

    if (hasSearchTerm(search) && stores.length > 0) {
      await storeRepository.incrementSearchCountByIds(stores.map((store) => store.id));
      await syncNewsFeed(undefined, ['MOST_SEARCHED_STORE']);
    }

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

    try {
      const store = await storeRepository.createForUser(userId, buildCreatePayload(payload));
      await syncNewsFeed([buildStoreCreatedEvent(store)]);
      return toStoreDetails(store);
    } catch (error) {
      handlePrismaError(error);
    }
  },

  async updateMyStore(userId: string, payload: UpdateStoreRequest): Promise<StoreDetails> {
    const existingStore = await storeRepository.findStoreByUserId(userId);

    if (!existingStore) {
      throwMyStoreNotFound();
    }

    const badgesChanged = hasStoreBadgesChanged(existingStore, payload);
    const productMatches =
      payload.products !== undefined ? matchStoreProducts(existingStore.products, payload.products) : undefined;
    const productChanges = productMatches ? buildProductChanges(productMatches) : [];
    const updatedStore = await storeRepository.updateById(
      existingStore.id,
      buildUpdatePayload(payload),
      existingStore.products,
    );
    const { events: newsFeedEvents, refreshMetrics } = buildStoreUpdateActivitySync({
      existingStore,
      updatedStore,
      badgesChanged,
      productChanges,
    });

    await syncNewsFeed(newsFeedEvents, refreshMetrics);

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

    try {
      const updatedStore = await storeRepository.addRatingForUser(storeId, userId, payload.rating);
      const { events, refreshMetrics } = buildStoreUpdateActivitySync({
        existingStore,
        updatedStore,
        badgesChanged: false,
        productChanges: [],
      });

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
    await syncNewsFeed(undefined, ['POPULAR_STORE', 'MOST_ACTIVE_STORE', 'MOST_SEARCHED_STORE']);
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

  async findMostSearchedStore(): Promise<MostSearchedStoreSnapshot | null> {
    const store = await storeRepository.findMostSearchedStore();
    return store ? toMostSearchedStoreSnapshot(store) : null;
  },
};
