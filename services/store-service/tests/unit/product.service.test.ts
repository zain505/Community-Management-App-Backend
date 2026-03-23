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

import { newsFeedClient } from '../../src/modules/newsfeed/newsfeed.client';
import { productRepository } from '../../src/modules/product/product.repository';
import { productService } from '../../src/modules/product/product.service';
import { storeRepository } from '../../src/modules/store/store.repository';

const mockedProductRepository = jest.mocked(productRepository);
const mockedStoreRepository = jest.mocked(storeRepository);
const mockedNewsFeedClient = jest.mocked(newsFeedClient);

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
    storeId: 18,
    createdAt: new Date('2026-03-14T08:00:00.000Z'),
    updatedAt: new Date('2026-03-14T08:00:00.000Z'),
    ...overrides,
  } as never;
}

describe('product service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('lists products for a store after confirming the store exists', async () => {
    mockedStoreRepository.findStoreBasicById.mockResolvedValue(buildStoreRecord());
    mockedProductRepository.listByStoreId.mockResolvedValue([
      buildProductRecord(),
    ]);

    const products = await productService.listProductsByStoreId(18, 'Orange', 2);

    expect(products).toEqual([
      {
        id: 'prod-1',
        name: 'Orange Juice',
        price: '500',
        image: 'https://example.com/orange-juice.png',
        tag: 'Fresh',
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
        image: 'https://example.com/chocolate-cake.png',
        tag: 'Dessert',
      }),
    );
    mockedNewsFeedClient.syncBestEffort.mockResolvedValue(undefined);

    await productService.createMyProduct('user-123', {
      name: 'Chocolate Cake',
      price: '900',
      image: 'https://example.com/chocolate-cake.png',
      tag: 'Dessert',
    });

    expect(mockedProductRepository.createForStore).toHaveBeenCalledWith(18, {
      name: 'Chocolate Cake',
      price: '900',
      image: 'https://example.com/chocolate-cake.png',
      tag: 'Dessert',
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
              image: 'https://example.com/chocolate-cake.png',
              tag: 'Dessert',
            },
          },
        },
      ],
      refreshMetrics: ['MOST_ACTIVE_STORE'],
    });
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
            },
            current: {
              id: 'prod-1',
              name: 'Orange Juice',
              price: '550',
              image: 'https://example.com/orange-juice.png',
              tag: 'Fresh',
            },
          },
        },
      ],
      refreshMetrics: ['MOST_ACTIVE_STORE'],
    });
  });

  it('publishes a product-deleted event when deleting a product', async () => {
    mockedStoreRepository.findStoreBasicByUserId.mockResolvedValue(buildStoreRecord());
    mockedProductRepository.findByIdForStore.mockResolvedValue(buildProductRecord());
    mockedProductRepository.deleteById.mockResolvedValue(buildProductRecord());
    mockedNewsFeedClient.syncBestEffort.mockResolvedValue(undefined);

    await productService.deleteMyProduct('user-123', 'prod-1');

    expect(mockedProductRepository.deleteById).toHaveBeenCalledWith('prod-1');
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
            },
          },
        },
      ],
      refreshMetrics: ['MOST_ACTIVE_STORE'],
    });
  });
});
