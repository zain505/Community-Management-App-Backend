jest.mock('../../src/modules/store/store.repository', () => ({
  storeRepository: {
    createForUser: jest.fn(),
    listStores: jest.fn(),
    incrementSearchCountByIds: jest.fn(),
    findStoreById: jest.fn(),
    findStoreByUserId: jest.fn(),
    deleteById: jest.fn(),
    addRatingForUser: jest.fn(),
    updateById: jest.fn(),
  },
}));

jest.mock('../../src/modules/newsfeed/newsfeed.client', () => ({
  newsFeedClient: {
    syncBestEffort: jest.fn(),
  },
}));

import { newsFeedClient } from '../../src/modules/newsfeed/newsfeed.client';
import { storeRepository } from '../../src/modules/store/store.repository';
import { storeService } from '../../src/modules/store/store.service';

const mockedStoreRepository = jest.mocked(storeRepository);
const mockedNewsFeedClient = jest.mocked(newsFeedClient);

const storeImageBase64 = 'data:image/png;base64,aGVsbG8=';
const updatedStoreImageBase64 = 'data:image/png;base64,d29ybGQ=';

function buildStoreRecord(overrides: Record<string, unknown> = {}) {
  return {
    id: 18,
    ownerUserId: 'user-123',
    name: 'Fresh Mart2',
    location: 'Main Road',
    rating: '4.2',
    image: storeImageBase64,
    badges: [],
    delivery: '30 mins',
    minOrderRs: '500',
    openingTime: '09:00',
    closingTime: '22:00',
    phoneNumber: '03001234567',
    searchCount: 0,
    createdAt: new Date('2026-03-14T08:00:00.000Z'),
    updatedAt: new Date('2026-03-14T08:00:00.000Z'),
    products: [],
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
    createdAt: new Date('2026-03-14T08:00:00.000Z'),
    updatedAt: new Date('2026-03-14T08:00:00.000Z'),
    ...overrides,
  } as never;
}

const storeFieldChangeCases = [
  {
    name: 'publishes a phone update event when phone number changes',
    payload: {
      phoneNumber: '03112223344',
    },
    updatedStoreOverrides: {
      phoneNumber: '03112223344',
    },
    expectedEvent: {
      type: 'STORE_CONTACT_UPDATED',
      storeId: 18,
      storeName: 'Fresh Mart2',
      title: 'Fresh Mart2 updated their phone number.',
      description: 'Check their latest contact details.',
      metadata: {
        previousContact: '03001234567',
        nextContact: '03112223344',
      },
    },
    expectedRefreshMetrics: ['MOST_ACTIVE_STORE'],
  },
  {
    name: 'publishes a location update event when location changes',
    payload: {
      location: 'Mall Road',
    },
    updatedStoreOverrides: {
      location: 'Mall Road',
    },
    expectedEvent: {
      type: 'STORE_LOCATION_UPDATED',
      storeId: 18,
      storeName: 'Fresh Mart2',
      title: 'Fresh Mart2 changed location.',
      description: 'See where they are now.',
      metadata: {
        previousLocation: 'Main Road',
        nextLocation: 'Mall Road',
      },
    },
    expectedRefreshMetrics: ['MOST_ACTIVE_STORE'],
  },
  {
    name: 'publishes an image update event when image changes',
    payload: {
      image: updatedStoreImageBase64,
    },
    updatedStoreOverrides: {
      image: updatedStoreImageBase64,
    },
    expectedEvent: {
      type: 'STORE_IMAGE_UPDATED',
      storeId: 18,
      storeName: 'Fresh Mart2',
      title: 'Fresh Mart2 updated their store photo.',
      description: 'See their latest look.',
      metadata: {
        previousImage: storeImageBase64,
        nextImage: updatedStoreImageBase64,
      },
    },
    expectedRefreshMetrics: ['MOST_ACTIVE_STORE'],
  },
] as const;

describe('store service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('includes phoneNumber in store list responses', async () => {
    mockedStoreRepository.listStores.mockResolvedValue([buildStoreRecord()]);

    const stores = await storeService.listStores(undefined, 1);

    expect(stores).toEqual([
      expect.objectContaining({
        id: 18,
        name: 'Fresh Mart2',
        openingTime: '09:00',
        closingTime: '22:00',
        phoneNumber: '03001234567',
      }),
    ]);
    expect(mockedStoreRepository.incrementSearchCountByIds).not.toHaveBeenCalled();
  });

  it('publishes only a store-created event when creating a store', async () => {
    mockedStoreRepository.findStoreByUserId.mockResolvedValue(null);
    mockedStoreRepository.createForUser.mockResolvedValue({
      id: 18,
      name: 'Fresh Mart2',
      location: 'Main Road',
      rating: '0',
      image: storeImageBase64,
      badges: [],
      delivery: '30 mins',
      minOrderRs: '500',
      openingTime: '09:00',
      closingTime: '22:00',
      phoneNumber: '03001234567',
      products: [],
    } as never);
    mockedNewsFeedClient.syncBestEffort.mockResolvedValue(undefined);

    await storeService.createMyStore('user-123', {
      name: 'Fresh Mart2',
      location: 'Main Road',
      image: storeImageBase64,
      badges: [],
      delivery: '30 mins',
      minOrderRs: '500',
      openingTime: '09:00',
      closingTime: '22:00',
      phoneNumber: '03001234567',
      products: [],
    });

    expect(mockedNewsFeedClient.syncBestEffort).toHaveBeenCalledWith({
      events: [
        {
          type: 'STORE_CREATED',
          storeId: 18,
          storeName: 'Fresh Mart2',
          title: 'A new store opened in your neighborhood.',
          description: 'Check out Fresh Mart2.',
        },
      ],
      refreshMetrics: undefined,
    });
    expect(mockedStoreRepository.createForUser).toHaveBeenCalledWith('user-123', {
      name: 'Fresh Mart2',
      location: 'Main Road',
      image: storeImageBase64,
      badges: [],
      delivery: '30 mins',
      minOrderRs: '500',
      openingTime: '09:00',
      closingTime: '22:00',
      phoneNumber: '03001234567',
      products: [],
    });
  });

  it('refreshes derived metrics after deleting a store', async () => {
    mockedStoreRepository.findStoreByUserId.mockResolvedValue({
      id: 7,
    } as never);
    mockedStoreRepository.deleteById.mockResolvedValue({} as never);
    mockedNewsFeedClient.syncBestEffort.mockResolvedValue(undefined);

    await storeService.deleteMyStore('user-123');

    expect(mockedStoreRepository.deleteById).toHaveBeenCalledWith(7);
    expect(mockedNewsFeedClient.syncBestEffort).toHaveBeenCalledWith({
      events: undefined,
      refreshMetrics: ['POPULAR_STORE', 'MOST_ACTIVE_STORE', 'MOST_SEARCHED_STORE'],
    });
  });

  it('publishes explicit name and location events without a duplicate profile event', async () => {
    const existingStore = buildStoreRecord();
    const updatedStore = buildStoreRecord({
      name: 'Fresh Mart Plus',
      location: 'Mall Road',
    });

    mockedStoreRepository.findStoreByUserId.mockResolvedValue(existingStore);
    mockedStoreRepository.updateById.mockResolvedValue(updatedStore);
    mockedNewsFeedClient.syncBestEffort.mockResolvedValue(undefined);

    await storeService.updateMyStore('user-123', {
      name: 'Fresh Mart Plus',
      location: 'Mall Road',
    });

    expect(mockedNewsFeedClient.syncBestEffort).toHaveBeenCalledWith({
      events: [
        {
          type: 'STORE_NAME_UPDATED',
          storeId: 18,
          storeName: 'Fresh Mart Plus',
          title: 'Fresh Mart2 is now Fresh Mart Plus.',
          description: 'Fresh Mart Plus updated their store name.',
          metadata: {
            previousName: 'Fresh Mart2',
            nextName: 'Fresh Mart Plus',
          },
        },
        {
          type: 'STORE_LOCATION_UPDATED',
          storeId: 18,
          storeName: 'Fresh Mart Plus',
          title: 'Fresh Mart Plus changed location.',
          description: 'See where they are now.',
          metadata: {
            previousLocation: 'Main Road',
            nextLocation: 'Mall Road',
          },
        },
      ],
      refreshMetrics: ['MOST_ACTIVE_STORE'],
    });
  });

  it.each(storeFieldChangeCases)('$name', async ({ payload, updatedStoreOverrides, expectedEvent, expectedRefreshMetrics }) => {
    const existingStore = buildStoreRecord();
    const updatedStore = buildStoreRecord(updatedStoreOverrides);

    mockedStoreRepository.findStoreByUserId.mockResolvedValue(existingStore);
    mockedStoreRepository.updateById.mockResolvedValue(updatedStore);
    mockedNewsFeedClient.syncBestEffort.mockResolvedValue(undefined);

    await storeService.updateMyStore('user-123', payload);

    expect(mockedNewsFeedClient.syncBestEffort).toHaveBeenCalledWith({
      events: [expectedEvent],
      refreshMetrics: expectedRefreshMetrics,
    });
  });

  it('publishes explicit events for location, image, delivery, min order, and phone number changes', async () => {
    const existingStore = buildStoreRecord();
    const updatedStore = buildStoreRecord({
      location: 'Mall Road',
      image: updatedStoreImageBase64,
      delivery: '45 mins',
      minOrderRs: '700',
      phoneNumber: '03112223344',
    });

    mockedStoreRepository.findStoreByUserId.mockResolvedValue(existingStore);
    mockedStoreRepository.updateById.mockResolvedValue(updatedStore);
    mockedNewsFeedClient.syncBestEffort.mockResolvedValue(undefined);

    await storeService.updateMyStore('user-123', {
      location: 'Mall Road',
      image: updatedStoreImageBase64,
      delivery: '45 mins',
      minOrderRs: '700',
      phoneNumber: '03112223344',
    });

    expect(mockedNewsFeedClient.syncBestEffort).toHaveBeenCalledWith({
      events: [
        {
          type: 'STORE_LOCATION_UPDATED',
          storeId: 18,
          storeName: 'Fresh Mart2',
          title: 'Fresh Mart2 changed location.',
          description: 'See where they are now.',
          metadata: {
            previousLocation: 'Main Road',
            nextLocation: 'Mall Road',
          },
        },
        {
          type: 'STORE_IMAGE_UPDATED',
          storeId: 18,
          storeName: 'Fresh Mart2',
          title: 'Fresh Mart2 updated their store photo.',
          description: 'See their latest look.',
          metadata: {
            previousImage: storeImageBase64,
            nextImage: updatedStoreImageBase64,
          },
        },
        {
          type: 'STORE_DELIVERY_UPDATED',
          storeId: 18,
          storeName: 'Fresh Mart2',
          title: 'Fresh Mart2 updated their delivery details.',
          description: "Check what's changed before you order.",
          metadata: {
            previousDelivery: '30 mins',
            nextDelivery: '45 mins',
          },
        },
        {
          type: 'STORE_MIN_ORDER_UPDATED',
          storeId: 18,
          storeName: 'Fresh Mart2',
          title: 'Fresh Mart2 updated their minimum order.',
          description: 'Take a look before your next order.',
          metadata: {
            previousMinOrderRs: '500',
            nextMinOrderRs: '700',
          },
        },
        {
          type: 'STORE_CONTACT_UPDATED',
          storeId: 18,
          storeName: 'Fresh Mart2',
          title: 'Fresh Mart2 updated their phone number.',
          description: 'Check their latest contact details.',
          metadata: {
            previousContact: '03001234567',
            nextContact: '03112223344',
          },
        },
      ],
      refreshMetrics: ['MOST_ACTIVE_STORE'],
    });
  });

  it('publishes a rating event when an authenticated user rates a store', async () => {
    const existingStore = buildStoreRecord();
    const updatedStore = buildStoreRecord({
      rating: '4.6',
    });

    mockedStoreRepository.findStoreById.mockResolvedValue(existingStore);
    mockedStoreRepository.addRatingForUser.mockResolvedValue(updatedStore);
    mockedNewsFeedClient.syncBestEffort.mockResolvedValue(undefined);

    const store = await storeService.rateStore('user-999', 18, {
      rating: 5,
    });

    expect(mockedStoreRepository.addRatingForUser).toHaveBeenCalledWith(18, 'user-999', 5);
    expect(store.rating).toBe('4.6');
    expect(mockedNewsFeedClient.syncBestEffort).toHaveBeenCalledWith({
      events: [
        {
          type: 'STORE_RATING_UPDATED',
          storeId: 18,
          storeName: 'Fresh Mart2',
          title: 'Fresh Mart2 got a new rating update.',
          description: 'See how the community is rating them now.',
          metadata: {
            previousRating: '4.2',
            nextRating: '4.6',
          },
        },
      ],
      refreshMetrics: ['MOST_ACTIVE_STORE', 'POPULAR_STORE'],
    });
  });

  it('still publishes a profile event when only badges change', async () => {
    const existingStore = buildStoreRecord({
      badges: ['Featured'],
    });
    const updatedStore = buildStoreRecord({
      badges: ['Featured', 'Fast Delivery'],
    });

    mockedStoreRepository.findStoreByUserId.mockResolvedValue(existingStore);
    mockedStoreRepository.updateById.mockResolvedValue(updatedStore);
    mockedNewsFeedClient.syncBestEffort.mockResolvedValue(undefined);

    await storeService.updateMyStore('user-123', {
      badges: ['Featured', 'Fast Delivery'],
    });

    expect(mockedNewsFeedClient.syncBestEffort).toHaveBeenCalledWith({
      events: [
        {
          type: 'STORE_PROFILE_UPDATED',
          storeId: 18,
          storeName: 'Fresh Mart2',
          title: 'Fresh Mart2 updated their store profile.',
          description: "Take a look at what's new.",
          metadata: {
            changedFields: ['badges'],
            changes: {
              badges: {
                previous: ['Featured'],
                current: ['Featured', 'Fast Delivery'],
              },
            },
          },
        },
      ],
      refreshMetrics: ['MOST_ACTIVE_STORE'],
    });
  });

  it('publishes a profile event when store hours change', async () => {
    const existingStore = buildStoreRecord();
    const updatedStore = buildStoreRecord({
      openingTime: '10:00',
      closingTime: '23:00',
    });

    mockedStoreRepository.findStoreByUserId.mockResolvedValue(existingStore);
    mockedStoreRepository.updateById.mockResolvedValue(updatedStore);
    mockedNewsFeedClient.syncBestEffort.mockResolvedValue(undefined);

    await storeService.updateMyStore('user-123', {
      openingTime: '10:00',
      closingTime: '23:00',
    });

    expect(mockedNewsFeedClient.syncBestEffort).toHaveBeenCalledWith({
      events: [
        {
          type: 'STORE_PROFILE_UPDATED',
          storeId: 18,
          storeName: 'Fresh Mart2',
          title: 'Fresh Mart2 updated their store profile.',
          description: "Take a look at what's new.",
          metadata: {
            changedFields: ['openingTime', 'closingTime'],
            changes: {
              openingTime: {
                previous: '09:00',
                current: '10:00',
              },
              closingTime: {
                previous: '22:00',
                current: '23:00',
              },
            },
          },
        },
      ],
      refreshMetrics: ['MOST_ACTIVE_STORE'],
    });
  });

  it('keeps a generic profile event when badges change alongside another meaningful update', async () => {
    const existingStore = buildStoreRecord({
      badges: ['Featured'],
    });
    const updatedStore = buildStoreRecord({
      location: 'Mall Road',
      badges: ['Featured', 'Fast Delivery'],
    });

    mockedStoreRepository.findStoreByUserId.mockResolvedValue(existingStore);
    mockedStoreRepository.updateById.mockResolvedValue(updatedStore);
    mockedNewsFeedClient.syncBestEffort.mockResolvedValue(undefined);

    await storeService.updateMyStore('user-123', {
      location: 'Mall Road',
      badges: ['Featured', 'Fast Delivery'],
    });

    expect(mockedNewsFeedClient.syncBestEffort).toHaveBeenCalledWith({
      events: [
        {
          type: 'STORE_LOCATION_UPDATED',
          storeId: 18,
          storeName: 'Fresh Mart2',
          title: 'Fresh Mart2 changed location.',
          description: 'See where they are now.',
          metadata: {
            previousLocation: 'Main Road',
            nextLocation: 'Mall Road',
          },
        },
        {
          type: 'STORE_PROFILE_UPDATED',
          storeId: 18,
          storeName: 'Fresh Mart2',
          title: 'Fresh Mart2 updated their store profile.',
          description: "Take a look at what's new.",
          metadata: {
            changedFields: ['badges'],
            changes: {
              badges: {
                previous: ['Featured'],
                current: ['Featured', 'Fast Delivery'],
              },
            },
          },
        },
      ],
      refreshMetrics: ['MOST_ACTIVE_STORE'],
    });
  });

  it('publishes a friendly product-added event when a new product appears', async () => {
    const existingStore = buildStoreRecord();
    const updatedStore = buildStoreRecord({
      products: [buildProductRecord({ id: 'prod-2', name: 'Chocolate Cake', price: '900', tag: 'Dessert' })],
    });

    mockedStoreRepository.findStoreByUserId.mockResolvedValue(existingStore);
    mockedStoreRepository.updateById.mockResolvedValue(updatedStore);
    mockedNewsFeedClient.syncBestEffort.mockResolvedValue(undefined);

    await storeService.updateMyStore('user-123', {
      products: [
        {
          name: 'Chocolate Cake',
          price: '900',
          image: 'https://example.com/chocolate-cake.png',
          tag: 'Dessert',
        },
      ],
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
              id: undefined,
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

  it('publishes a friendly product-updated event when an item changes', async () => {
    const existingStore = buildStoreRecord({
      products: [buildProductRecord()],
    });
    const updatedStore = buildStoreRecord({
      products: [
        buildProductRecord({
          price: '550',
        }),
      ],
    });

    mockedStoreRepository.findStoreByUserId.mockResolvedValue(existingStore);
    mockedStoreRepository.updateById.mockResolvedValue(updatedStore);
    mockedNewsFeedClient.syncBestEffort.mockResolvedValue(undefined);

    await storeService.updateMyStore('user-123', {
      products: [
        {
          id: 'prod-1',
          name: 'Orange Juice',
          price: '550',
          image: 'https://example.com/orange-juice.png',
          tag: 'Fresh',
        },
      ],
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

  it('ignores trivial or unchanged fields when deciding whether to publish store activity', async () => {
    const existingStore = buildStoreRecord();
    const updatedStore = buildStoreRecord({
      updatedAt: new Date('2026-03-15T08:00:00.000Z'),
    });

    mockedStoreRepository.findStoreByUserId.mockResolvedValue(existingStore);
    mockedStoreRepository.updateById.mockResolvedValue(updatedStore);
    mockedNewsFeedClient.syncBestEffort.mockResolvedValue(undefined);

    await storeService.updateMyStore(
      'user-123',
      {
        name: 'Fresh Mart2',
        updatedAt: '2026-03-15T08:00:00.000Z',
        searchCount: 99,
      } as never,
    );

    expect(mockedNewsFeedClient.syncBestEffort).toHaveBeenCalledWith({
      events: undefined,
      refreshMetrics: undefined,
    });
  });
});
