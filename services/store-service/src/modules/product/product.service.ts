import type {
  CreateProductRequest,
  NewsFeedMetric,
  NewsFeedSyncEvent,
  Product,
  UpdateProductRequest,
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
import { toPublicAssetUrl } from '../../shared/public-asset-url';
import { newsFeedClient } from '../newsfeed/newsfeed.client';
import { invalidateStoreListCache } from '../store/store.cache';
import {
  buildProductAddedEvent,
  buildProductDeletedEvent,
  buildProductUpdatedEvent,
} from '../store/store-newsfeed-events';
import { storeRepository } from '../store/store.repository';
import { productRepository, type ProductRecord } from './product.repository';

function toProduct(product: ProductRecord): Product {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    image: toPublicAssetUrl(product.image),
    tag: product.tag ?? undefined,
    description: product.description ?? undefined,
  };
}

async function cleanupManagedProductImagesBestEffort(
  imageUrls: string[],
  action: string,
): Promise<void> {
  if (imageUrls.length === 0) {
    return;
  }

  try {
    await deleteManagedImages(imageUrls);
  } catch (error) {
    logger.error({ error, action, imageUrls }, 'Failed to clean up managed product images');
  }
}

async function buildCreatePayload(payload: CreateProductRequest): Promise<CreateProductRequest> {
  if (!isBase64ImageInput(payload.image)) {
    return payload;
  }

  return {
    ...payload,
    image: await persistBase64Image(payload.image, 'product'),
  };
}

async function buildUpdatePayload(payload: UpdateProductRequest): Promise<UpdateProductRequest> {
  if (payload.image === undefined || !isBase64ImageInput(payload.image)) {
    return payload;
  }

  return {
    ...payload,
    image: await persistBase64Image(payload.image, 'product'),
  };
}

function throwStoreNotFound(message = 'Store not found'): never {
  throw new AppError(message, {
    statusCode: StatusCodes.NOT_FOUND,
    code: 'STORE_NOT_FOUND',
  });
}

function throwProductNotFound(): never {
  throw new AppError('Product not found for this user', {
    statusCode: StatusCodes.NOT_FOUND,
    code: 'PRODUCT_NOT_FOUND',
  });
}

function handlePrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw new AppError('Product already exists', {
        statusCode: StatusCodes.CONFLICT,
        code: 'PRODUCT_ALREADY_EXISTS',
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

async function getStoreForUser(userId: string) {
  const store = await storeRepository.findStoreBasicByUserId(userId);

  if (!store) {
    throwStoreNotFound('Store not found for this user');
  }

  return store;
}

async function getStoreById(storeId: number) {
  const store = await storeRepository.findStoreBasicById(storeId);

  if (!store) {
    throwStoreNotFound();
  }

  return store;
}

export const productService = {
  async listProductsByStoreId(storeId: number, search?: string, page = 1): Promise<Product[]> {
    await getStoreById(storeId);
    const products = await productRepository.listByStoreId(storeId, search, page);
    return products.map(toProduct);
  },

  async listMyProducts(userId: string, search?: string, page = 1): Promise<Product[]> {
    const store = await getStoreForUser(userId);
    const products = await productRepository.listByStoreId(store.id, search, page);
    return products.map(toProduct);
  },

  async getMyProduct(userId: string, productId: string): Promise<Product> {
    const store = await getStoreForUser(userId);
    const product = await productRepository.findByIdForStore(productId, store.id);

    if (!product) {
      throwProductNotFound();
    }

    return toProduct(product);
  },

  async createMyProduct(userId: string, payload: CreateProductRequest): Promise<Product> {
    const store = await getStoreForUser(userId);
    const normalizedPayload = await buildCreatePayload(payload);
    const createdImageUrls =
      normalizedPayload.image === payload.image ? [] : [normalizedPayload.image];

    try {
      const product = await productRepository.createForStore(store.id, normalizedPayload);
      await invalidateStoreListCache();
      await syncNewsFeed(
        [
          buildProductAddedEvent({
            store,
            product,
          }),
        ],
        ['MOST_ACTIVE_STORE'],
      );
      return toProduct(product);
    } catch (error) {
      await cleanupManagedProductImagesBestEffort(
        createdImageUrls,
        'product creation rollback',
      );
      handlePrismaError(error);
    }
  },

  async updateMyProduct(
    userId: string,
    productId: string,
    payload: UpdateProductRequest,
  ): Promise<Product> {
    const store = await getStoreForUser(userId);
    const existingProduct = await productRepository.findByIdForStore(productId, store.id);

    if (!existingProduct) {
      throwProductNotFound();
    }

    const normalizedPayload = await buildUpdatePayload(payload);
    const createdImageUrls =
      normalizedPayload.image !== undefined && normalizedPayload.image !== payload.image
        ? [normalizedPayload.image]
        : [];
    let updatedProduct: ProductRecord;

    try {
      updatedProduct = await productRepository.updateById(productId, normalizedPayload);
    } catch (error) {
      await cleanupManagedProductImagesBestEffort(
        createdImageUrls,
        'product update rollback',
      );
      throw error;
    }

    await cleanupManagedProductImagesBestEffort(
      existingProduct.image !== updatedProduct.image && isManagedImagePublicPath(existingProduct.image)
        ? [existingProduct.image]
        : [],
      'product update replacement',
    );
    await invalidateStoreListCache();
    await syncNewsFeed(
      [
        buildProductUpdatedEvent({
          store,
          previousProduct: existingProduct,
          currentProduct: updatedProduct,
        }),
      ],
      ['MOST_ACTIVE_STORE'],
    );

    return toProduct(updatedProduct);
  },

  async deleteMyProduct(userId: string, productId: string): Promise<void> {
    const store = await getStoreForUser(userId);
    const existingProduct = await productRepository.findByIdForStore(productId, store.id);

    if (!existingProduct) {
      throwProductNotFound();
    }

    const deletedProduct = await productRepository.deleteById(productId);
    await cleanupManagedProductImagesBestEffort(
      isManagedImagePublicPath(deletedProduct.image) ? [deletedProduct.image] : [],
      'product deletion cleanup',
    );
    await invalidateStoreListCache();
    await syncNewsFeed(
      [
        buildProductDeletedEvent({
          store,
          product: existingProduct,
        }),
      ],
      ['MOST_ACTIVE_STORE'],
    );
  },
};
