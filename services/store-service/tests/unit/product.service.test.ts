import fs from 'node:fs/promises';
import path from 'node:path';
jest.mock('../../src/modules/product/product.repository', () => ({
  productRepository: {
    listByStoreId: jest.fn(),
    findByIdForStore: jest.fn(),
    createForStore: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn(),
  },
}));

jest.mock('../../src/modules/store/store.repository', () => ({
  storeRepository: {
    findStoreBasicById: jest.fn(),
    findStoreBasicByUserId: jest.fn(),
  },
}));

jest.mock('../../src/modules/newsfeed/newsfeed.client', () => ({
  newsFeedClient: {
    syncBestEffort: jest.fn(),
  },
}));

jest.mock('../../src/modules/store/store.cache', () => ({
  invalidateStoreListCache: jest.fn(),
}));

import { newsFeedClient } from '../../src/modules/newsfeed/newsfeed.client';
import { productRepository } from '../../src/modules/product/product.repository';
import { productService } from '../../src/modules/product/product.service';
import { invalidateStoreListCache } from '../../src/modules/store/store.cache';
import { storeRepository } from '../../src/modules/store/store.repository';

const mockedProductRepository = jest.mocked(productRepository);
const mockedStoreRepository = jest.mocked(storeRepository);
const mockedNewsFeedClient = jest.mocked(newsFeedClient);
const mockedInvalidateStoreListCache = jest.mocked(invalidateStoreListCache);
const uploadsRoot = path.resolve(__dirname, '../../uploads');
const productImageBase64 = `data:image/png;base64,${Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00,
]).toString('base64')}`;
const publicBaseUrl = process.env.PUBLIC_BASE_URL ?? 'https://public.example.test';
const productImageUrl = '/uploads/product-images/product-image.png';
const updatedProductImageBase64 = `data:image/png;base64,${Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x01,
]).toString('base64')}`;
const updatedProductImageUrl = '/uploads/product-images/product-image-updated.png';
const absoluteProductImageUrl = `${publicBaseUrl}${productImageUrl}`;
const absoluteUpdatedProductImageUrl = `${publicBaseUrl}${updatedProductImageUrl}`;

async function removeUploadsDirectory(): Promise<void> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      await fs.rm(uploadsRoot, { recursive: true, force: true });
      return;
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;

      if (!['EBUSY', 'ENOTEMPTY', 'EPERM'].includes(nodeError.code ?? '')) {
        throw error;
      }

      if (attempt === 4) {
        return;
      }

      await new Promise((resolve) => {
        setTimeout(resolve, 100);
      });
    }
  }
}

function buildStoreRecord(overrides: Record<string, unknown> = {}) {
  return {
    id: 18,
    name: 'Fresh Mart2',
    ...overrides,
  } as never;
}

function buildProductRecord(overrides: Record<string, unknown> = {}) {
  return {
    id: 'prod-1',
    name: 'Orange Juice',
    price: '500',
    image: 'https://example.com/orange-juice.png',
    tag: 'Fresh',
    description: 'Freshly squeezed orange juice.',
    storeId: 18,
    createdAt: new Date('2026-03-14T08:00:00.000Z'),
    updatedAt: new Date('2026-03-14T08:00:00.000Z'),
    ...overrides,
  } as never;
}

describe('product service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockedInvalidateStoreListCache.mockResolvedValue(undefined);
  });

  afterEach(async () => {
    await removeUploadsDirectory();
  });

  it('lists products for a store after confirming the store exists', async () => {
    mockedStoreRepository.findStoreBasicById.mockResolvedValue(buildStoreRecord());
    mockedProductRepository.listByStoreId.mockResolvedValue([buildProductRecord()]);

    const products = await productService.listProductsByStoreId(18, 'Orange', 2);

    expect(products).toEqual([
      {
        id: 'prod-1',
        name: 'Orange Juice',
        price: '500',
        image: 'https://example.com/orange-juice.png',
        tag: 'Fresh',
        description: 'Freshly squeezed orange juice.',
      },
    ]);
    expect(mockedStoreRepository.findStoreBasicById).toHaveBeenCalledWith(18);
    expect(mockedProductRepository.listByStoreId).toHaveBeenCalledWith(18, 'Orange', 2);
  });

  it('publishes a product-added event when creating a product', async () => {
    mockedStoreRepository.findStoreBasicByUserId.mockResolvedValue(buildStoreRecord());
    mockedProductRepository.createForStore.mockResolvedValue(
      buildProductRecord({
        id: 'prod-2',
        name: 'Chocolate Cake',
        price: '900',
        image: productImageUrl,
        tag: 'Dessert',
        description: 'Rich chocolate sponge cake.',
      }),
    );
    mockedNewsFeedClient.syncBestEffort.mockResolvedValue(undefined);

    const product = await productService.createMyProduct('user-123', {
      name: 'Chocolate Cake',
      price: '900',
      image: productImageBase64,
      tag: 'Dessert',
      description: 'Rich chocolate sponge cake.',
    });

    expect(mockedProductRepository.createForStore).toHaveBeenCalledWith(18, {
      name: 'Chocolate Cake',
      price: '900',
      image: expect.stringMatching(/^\/uploads\/product-images\//),
      tag: 'Dessert',
      description: 'Rich chocolate sponge cake.',
    });
    expect(mockedNewsFeedClient.syncBestEffort).toHaveBeenCalledWith({
      events: [
        {
          type: 'PRODUCT_ADDED',
          storeId: 18,
          storeName: 'Fresh Mart2',
          title: 'Fresh Mart2 added a new product.',
          description: 'Check out Chocolate Cake.',
          metadata: {
            product: {
              id: 'prod-2',
              name: 'Chocolate Cake',
              price: '900',
              image: productImageUrl,
              tag: 'Dessert',
              description: 'Rich chocolate sponge cake.',
            },
          },
        },
      ],
      refreshMetrics: ['MOST_ACTIVE_STORE'],
    });
    expect(product.image).toBe(absoluteProductImageUrl);
    expect(mockedInvalidateStoreListCache).toHaveBeenCalled();
  });

  it('stores updated product images as managed URLs before publishing events', async () => {
    mockedStoreRepository.findStoreBasicByUserId.mockResolvedValue(buildStoreRecord());
    mockedProductRepository.findByIdForStore.mockResolvedValue(buildProductRecord());
    mockedProductRepository.updateById.mockResolvedValue(
      buildProductRecord({
        image: updatedProductImageUrl,
      }),
    );
    mockedNewsFeedClient.syncBestEffort.mockResolvedValue(undefined);

    const product = await productService.updateMyProduct('user-123', 'prod-1', {
      image: updatedProductImageBase64,
    });

    expect(mockedProductRepository.updateById).toHaveBeenCalledWith(
      'prod-1',
      expect.objectContaining({
        image: expect.stringMatching(/^\/uploads\/product-images\//),
      }),
    );
    expect(mockedNewsFeedClient.syncBestEffort).toHaveBeenCalledWith({
      events: [
        {
          type: 'PRODUCT_UPDATED',
          storeId: 18,
          storeName: 'Fresh Mart2',
          title: "Fresh Mart2 updated a product.",
          description: "See what's new with Orange Juice.",
          metadata: {
            previous: {
              id: 'prod-1',
              name: 'Orange Juice',
              price: '500',
              image: 'https://example.com/orange-juice.png',
              tag: 'Fresh',
              description: 'Freshly squeezed orange juice.',
            },
            current: {
              id: 'prod-1',
              name: 'Orange Juice',
              price: '500',
              image: updatedProductImageUrl,
              tag: 'Fresh',
              description: 'Freshly squeezed orange juice.',
            },
          },
        },
      ],
      refreshMetrics: ['MOST_ACTIVE_STORE'],
    });
    expect(product.image).toBe(absoluteUpdatedProductImageUrl);
  });

  it('publishes a product-updated event when updating a product', async () => {
    mockedStoreRepository.findStoreBasicByUserId.mockResolvedValue(buildStoreRecord());
    mockedProductRepository.findByIdForStore.mockResolvedValue(buildProductRecord());
    mockedProductRepository.updateById.mockResolvedValue(
      buildProductRecord({
        price: '550',
      }),
    );
    mockedNewsFeedClient.syncBestEffort.mockResolvedValue(undefined);

    await productService.updateMyProduct('user-123', 'prod-1', {
      price: '550',
    });

    expect(mockedNewsFeedClient.syncBestEffort).toHaveBeenCalledWith({
      events: [
        {
          type: 'PRODUCT_UPDATED',
          storeId: 18,
          storeName: 'Fresh Mart2',
          title: 'Fresh Mart2 updated a product.',
          description: "See what's new with Orange Juice.",
          metadata: {
            previous: {
              id: 'prod-1',
              name: 'Orange Juice',
              price: '500',
              image: 'https://example.com/orange-juice.png',
              tag: 'Fresh',
              description: 'Freshly squeezed orange juice.',
            },
            current: {
              id: 'prod-1',
              name: 'Orange Juice',
              price: '550',
              image: 'https://example.com/orange-juice.png',
              tag: 'Fresh',
              description: 'Freshly squeezed orange juice.',
            },
          },
        },
      ],
      refreshMetrics: ['MOST_ACTIVE_STORE'],
    });
    expect(mockedInvalidateStoreListCache).toHaveBeenCalled();
  });

  it('publishes a product-deleted event when deleting a product', async () => {
    mockedStoreRepository.findStoreBasicByUserId.mockResolvedValue(buildStoreRecord());
    mockedProductRepository.findByIdForStore.mockResolvedValue(buildProductRecord());
    mockedProductRepository.deleteById.mockResolvedValue(buildProductRecord());
    mockedNewsFeedClient.syncBestEffort.mockResolvedValue(undefined);

    await productService.deleteMyProduct('user-123', 'prod-1');

    expect(mockedProductRepository.deleteById).toHaveBeenCalledWith('prod-1');
    expect(mockedInvalidateStoreListCache).toHaveBeenCalled();
    expect(mockedNewsFeedClient.syncBestEffort).toHaveBeenCalledWith({
      events: [
        {
          type: 'PRODUCT_DELETED',
          storeId: 18,
          storeName: 'Fresh Mart2',
          title: 'Fresh Mart2 removed a product.',
          description: 'Orange Juice is no longer available.',
          metadata: {
            product: {
              id: 'prod-1',
              name: 'Orange Juice',
              price: '500',
              image: 'https://example.com/orange-juice.png',
              tag: 'Fresh',
              description: 'Freshly squeezed orange juice.',
            },
          },
        },
      ],
      refreshMetrics: ['MOST_ACTIVE_STORE'],
    });
  });
});
