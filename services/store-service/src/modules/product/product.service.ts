import type {
  CreateProductRequest,
  NewsFeedMetric,
  NewsFeedSyncEvent,
  Product,
  UpdateProductRequest,
} from '@community/contracts';
import { Prisma } from '../../generated/prisma';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../shared/app-error';
import { newsFeedClient } from '../newsfeed/newsfeed.client';
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
    image: product.image,
    tag: product.tag ?? undefined,
  };
}

function buildCreatePayload(payload: CreateProductRequest) {
  return {
    ...payload,
  };
}

function buildUpdatePayload(payload: UpdateProductRequest) {
  return {
    ...payload,
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

async function syncNewsFeed(events?: NewsFeedSyncEvent[], refreshMetrics?: NewsFeedMetric[]): Promise<void> {
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

    try {
      const product = await productRepository.createForStore(store.id, buildCreatePayload(payload));
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
      handlePrismaError(error);
    }
  },

  async updateMyProduct(userId: string, productId: string, payload: UpdateProductRequest): Promise<Product> {
    const store = await getStoreForUser(userId);
    const existingProduct = await productRepository.findByIdForStore(productId, store.id);

    if (!existingProduct) {
      throwProductNotFound();
    }

    const updatedProduct = await productRepository.updateById(productId, buildUpdatePayload(payload));

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

    await productRepository.deleteById(productId);
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
