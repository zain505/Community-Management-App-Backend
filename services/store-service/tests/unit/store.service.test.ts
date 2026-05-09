import fs from 'node:fs/promises';
import path from 'node:path';
jest.mock('../../src/modules/store/store.repository', () => ({
  storeRepository: {
    createForUser: jest.fn(),
    listStores: jest.fn(),
    listStoresForAdmin: jest.fn(),
    incrementSearchCountByIds: jest.fn(),
    findStoreById: jest.fn(),
    findStoreByUserId: jest.fn(),
    deleteById: jest.fn(),
    addRatingForUser: jest.fn(),
    updateById: jest.fn(),
    updateActiveStatusById: jest.fn(),
  },
}));

jest.mock('../../src/modules/auth/auth-client', () => ({
  authClient: {
    getManagedUserStatus: jest.fn(),
  },
}));

jest.mock('../../src/modules/newsfeed/newsfeed.client', () => ({
  newsFeedClient: {
    syncBestEffort: jest.fn(),
  },
}));

jest.mock('../../src/modules/store/store.cache', () => ({
  invalidateStoreListCache: jest.fn(),
  readStoreListCache: jest.fn(),
  shouldSyncMostSearchedMetric: jest.fn(),
  writeStoreListCache: jest.fn(),
}));

import { authClient } from '../../src/modules/auth/auth-client';
import { newsFeedClient } from '../../src/modules/newsfeed/newsfeed.client';
import * as storeCache from '../../src/modules/store/store.cache';
import { storeRepository } from '../../src/modules/store/store.repository';
import { storeService } from '../../src/modules/store/store.service';

const mockedAuthClient = jest.mocked(authClient);
const mockedStoreRepository = jest.mocked(storeRepository);
const mockedNewsFeedClient = jest.mocked(newsFeedClient);
const mockedStoreCache = jest.mocked(storeCache);
const uploadsRoot = path.resolve(__dirname, '../../uploads');

const storeImageBase64 = `data:image/png;base64,${Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00,
]).toString('base64')}`;
const updatedStoreImageBase64 = `data:image/png;base64,${Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x01,
]).toString('base64')}`;
const publicBaseUrl = process.env.PUBLIC_BASE_URL ?? 'https://public.example.test';
const storeImageUrl = '/uploads/store-images/store-image.png';
const updatedStoreImageUrl = '/uploads/store-images/store-image-updated.png';
const absoluteStoreImageUrl = `${publicBaseUrl}${storeImageUrl}`;

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
    ownerUserId: 'user-123',
    name: 'Fresh Mart2',
    active: true,
    location: 'Main Road',
    rating: '4.2',
    image: storeImageUrl,
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
    ratings: [],
    ...overrides,
  } as never;
}

function buildStoreReview(overrides: Record<string, unknown> = {}) {
  return {
    id: 7,
    rating: 4.5,
    description: 'Fresh produce and helpful staff.',
    createdAt: new Date('2026-03-14T10:00:00.000Z'),
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
      image: updatedStoreImageUrl,
    },
    expectedEvent: {
      type: 'STORE_IMAGE_UPDATED',
      storeId: 18,
      storeName: 'Fresh Mart2',
      title: 'Fresh Mart2 updated their store photo.',
      description: 'See their latest look.',
      metadata: {
        previousImage: storeImageUrl,
        nextImage: updatedStoreImageUrl,
      },
    },
    expectedRefreshMetrics: ['MOST_ACTIVE_STORE'],
  },
] as const;

describe('store service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockedStoreCache.invalidateStoreListCache.mockResolvedValue(undefined);
    mockedStoreCache.readStoreListCache.mockResolvedValue(null);
    mockedStoreCache.shouldSyncMostSearchedMetric.mockResolvedValue(true);
    mockedStoreCache.writeStoreListCache.mockResolvedValue(false);
  });

  afterEach(async () => {
    await removeUploadsDirectory();
  });

  it('includes phoneNumber and reviews in store list responses', async () => {
    mockedStoreRepository.listStores.mockResolvedValue([
      buildStoreRecord({
        ratings: [
          buildStoreReview({
            description: null,
          }),
        ],
      }),
    ]);

    const stores = await storeService.listStores(undefined, 1);

    expect(stores).toEqual([
      expect.objectContaining({
        id: 18,
        name: 'Fresh Mart2',
        active: true,
        image: absoluteStoreImageUrl,
        openingTime: '09:00',
        closingTime: '22:00',
        phoneNumber: '03001234567',
        reviews: [
          {
            id: 7,
            rating: 4.5,
            description: null,
            createdAt: '2026-03-14T10:00:00.000Z',
          },
        ],
      }),
    ]);
    expect(mockedStoreRepository.incrementSearchCountByIds).not.toHaveBeenCalled();
    expect(mockedStoreCache.writeStoreListCache).toHaveBeenCalledWith(
      undefined,
      1,
      expect.any(Array),
    );
  });

  it('returns cached public store lists without hitting the repository', async () => {
    mockedStoreCache.readStoreListCache.mockResolvedValue([
      {
        id: 18,
        name: 'Fresh Mart2',
        active: true,
        location: 'Main Road',
        rating: '4.2',
        image: storeImageUrl,
        badges: [],
        delivery: '30 mins',
        minOrderRs: '500',
        openingTime: '09:00',
        closingTime: '22:00',
        phoneNumber: '03001234567',
        reviews: [],
      },
    ]);

    const stores = await storeService.listStores(undefined, 1);

    expect(stores).toEqual([
      expect.objectContaining({
        id: 18,
        name: 'Fresh Mart2',
        image: absoluteStoreImageUrl,
      }),
    ]);
    expect(mockedStoreRepository.listStores).not.toHaveBeenCalled();
    expect(mockedStoreCache.writeStoreListCache).not.toHaveBeenCalled();
  });

  it('bypasses the list cache for search queries and debounces metric sync', async () => {
    mockedStoreRepository.listStores.mockResolvedValue([buildStoreRecord()]);
    mockedNewsFeedClient.syncBestEffort.mockResolvedValue(undefined);

    const stores = await storeService.listStores('Fresh', 1);

    expect(stores).toEqual([
      expect.objectContaining({
        id: 18,
        name: 'Fresh Mart2',
      }),
    ]);
    expect(mockedStoreCache.readStoreListCache).not.toHaveBeenCalled();
    expect(mockedStoreRepository.incrementSearchCountByIds).toHaveBeenCalledWith([18]);
    expect(mockedStoreCache.shouldSyncMostSearchedMetric).toHaveBeenCalled();
    expect(mockedNewsFeedClient.syncBestEffort).toHaveBeenCalledWith({
      events: undefined,
      refreshMetrics: ['MOST_SEARCHED_STORE'],
    });
    expect(mockedStoreCache.writeStoreListCache).not.toHaveBeenCalled();
  });

  it('allows active admin users to list stores for management without affecting search metrics', async () => {
    mockedAuthClient.getManagedUserStatus.mockResolvedValue({
      id: 'admin-123',
      mobileNumber: '+923001234567',
      name: 'Community Admin',
      usertype: 1,
      profile: {
        image: null,
      },
      isActive: true,
      createdAt: '2026-03-15T09:00:00.000Z',
    });
    mockedStoreRepository.listStoresForAdmin.mockResolvedValue([
      buildStoreRecord({
        id: 19,
        active: false,
        name: 'Fresh Mart Closed',
      }),
    ]);

    const stores = await storeService.listStoresForAdmin('admin-123', 'fresh', 2, false);

    expect(stores).toEqual([
      expect.objectContaining({
        id: 19,
        name: 'Fresh Mart Closed',
        active: false,
      }),
    ]);
    expect(mockedStoreRepository.listStoresForAdmin).toHaveBeenCalledWith('fresh', 2, false);
    expect(mockedStoreRepository.incrementSearchCountByIds).not.toHaveBeenCalled();
  });

  it('publishes only a store-created event when creating a store', async () => {
    mockedStoreRepository.findStoreByUserId.mockResolvedValue(null);
    mockedStoreRepository.createForUser.mockResolvedValue({
      id: 18,
      name: 'Fresh Mart2',
      active: true,
      location: 'Main Road',
      rating: '0',
      image: storeImageUrl,
      badges: [],
      delivery: '30 mins',
      minOrderRs: '500',
      openingTime: '09:00',
      closingTime: '22:00',
      phoneNumber: '03001234567',
      products: [],
    } as never);
    mockedNewsFeedClient.syncBestEffort.mockResolvedValue(undefined);

    const store = await storeService.createMyStore('user-123', {
      name: 'Fresh Mart2',
      location: 'Main Road',
      image: storeImageBase64,
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
    expect(store.image).toBe(absoluteStoreImageUrl);
    expect(mockedStoreCache.invalidateStoreListCache).toHaveBeenCalled();
    expect(mockedStoreRepository.createForUser).toHaveBeenCalledWith('user-123', {
      name: 'Fresh Mart2',
      location: 'Main Road',
      image: expect.stringMatching(/^\/uploads\/store-images\//),
      badges: [],
      delivery: '30 mins',
      minOrderRs: '500',
      openingTime: '09:00',
      closingTime: '22:00',
      phoneNumber: '03001234567',
      products: [],
    });
  });

  it('allows active admin users to deactivate a store without publishing a newsfeed update', async () => {
    mockedAuthClient.getManagedUserStatus.mockResolvedValue({
      id: 'admin-123',
      mobileNumber: '+923001234567',
      name: 'Community Admin',
      usertype: 1,
      profile: {
        image: null,
      },
      isActive: true,
      createdAt: '2026-03-15T09:00:00.000Z',
    });
    mockedStoreRepository.findStoreById.mockResolvedValue(buildStoreRecord());
    mockedStoreRepository.updateActiveStatusById.mockResolvedValue(
      buildStoreRecord({
        active: false,
      }),
    );
    mockedNewsFeedClient.syncBestEffort.mockResolvedValue(undefined);

    const store = await storeService.updateStoreActivation('admin-123', 18, false);

    expect(store.active).toBe(false);
    expect(store.image).toBe(absoluteStoreImageUrl);
    expect(mockedStoreRepository.updateActiveStatusById).toHaveBeenCalledWith(18, false);
    expect(mockedNewsFeedClient.syncBestEffort).not.toHaveBeenCalled();
  });

  it('rejects store activation changes from non-admin users', async () => {
    mockedAuthClient.getManagedUserStatus.mockResolvedValue({
      id: 'user-123',
      mobileNumber: '+923001234567',
      name: 'Community User',
      usertype: 2,
      profile: {
        image: null,
      },
      isActive: true,
      createdAt: '2026-03-15T09:00:00.000Z',
    });

    await expect(storeService.updateStoreActivation('user-123', 18, false)).rejects.toMatchObject({
      code: 'STORE_ADMIN_REQUIRED',
      statusCode: 403,
    });

    expect(mockedStoreRepository.findStoreById).not.toHaveBeenCalled();
  });

  it('rejects store management list access from non-admin users', async () => {
    mockedAuthClient.getManagedUserStatus.mockResolvedValue({
      id: 'user-123',
      mobileNumber: '+923001234567',
      name: 'Community User',
      usertype: 2,
      profile: {
        image: null,
      },
      isActive: true,
      createdAt: '2026-03-15T09:00:00.000Z',
    });

    await expect(storeService.listStoresForAdmin('user-123')).rejects.toMatchObject({
      code: 'STORE_ADMIN_REQUIRED',
      statusCode: 403,
    });

    expect(mockedStoreRepository.listStoresForAdmin).not.toHaveBeenCalled();
  });

  it('refreshes derived metrics after deleting a store', async () => {
    mockedStoreRepository.findStoreByUserId.mockResolvedValue(
      buildStoreRecord({
        id: 7,
        name: 'Fresh Mart2',
      }),
    );
    mockedStoreRepository.deleteById.mockResolvedValue({} as never);
    mockedNewsFeedClient.syncBestEffort.mockResolvedValue(undefined);

    await storeService.deleteMyStore('user-123');

    expect(mockedStoreRepository.deleteById).toHaveBeenCalledWith(7);
    expect(mockedStoreCache.invalidateStoreListCache).toHaveBeenCalled();
    expect(mockedNewsFeedClient.syncBestEffort).toHaveBeenCalledWith({
      events: [
        {
          type: 'STORE_DELETED',
          storeName: 'Fresh Mart2',
          title: 'Fresh Mart2 removed their store.',
          description: 'Fresh Mart2 is no longer available.',
          metadata: {
            deletedStoreId: 7,
          },
        },
      ],
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

  it.each(storeFieldChangeCases)(
    '$name',
    async ({ payload, updatedStoreOverrides, expectedEvent, expectedRefreshMetrics }) => {
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
    },
  );

  it('publishes explicit events for location, image, delivery, min order, and phone number changes', async () => {
    const existingStore = buildStoreRecord();
    const updatedStore = buildStoreRecord({
      location: 'Mall Road',
      image: updatedStoreImageUrl,
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

    expect(mockedStoreRepository.updateById).toHaveBeenCalledWith(
      18,
      expect.objectContaining({
        image: expect.stringMatching(/^\/uploads\/store-images\//),
      }),
      [],
    );
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
            previousImage: storeImageUrl,
            nextImage: updatedStoreImageUrl,
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

  it('publishes rating and badge profile events when an authenticated user rates a store with a new badge', async () => {
    const existingStore = buildStoreRecord({
      badges: ['Featured'],
    });
    const updatedStore = buildStoreRecord({
      rating: '4.6',
      badges: ['Featured', 'Fast Delivery'],
      ratings: [
        buildStoreReview({
          id: 12,
          rating: 5,
          description: 'Fresh groceries with a really smooth checkout.',
          createdAt: new Date('2026-03-14T11:30:00.000Z'),
        }),
      ],
    });

    mockedStoreRepository.findStoreById.mockResolvedValue(existingStore);
    mockedStoreRepository.addRatingForUser.mockResolvedValue(updatedStore);
    mockedNewsFeedClient.syncBestEffort.mockResolvedValue(undefined);

    const store = await storeService.rateStore('user-999', 18, {
      rating: 5,
      badges: ['Fast Delivery'],
      description: 'Fresh groceries with a really smooth checkout.',
    });

    expect(mockedStoreRepository.addRatingForUser).toHaveBeenCalledWith(
      18,
      'user-999',
      5,
      ['Featured', 'Fast Delivery'],
      'Fresh groceries with a really smooth checkout.',
    );
    expect(store.rating).toBe('4.6');
    expect(store.badges).toEqual(['Featured', 'Fast Delivery']);
    expect(mockedStoreCache.invalidateStoreListCache).toHaveBeenCalled();
    expect(store.reviews).toEqual([
      {
        id: 12,
        rating: 5,
        description: 'Fresh groceries with a really smooth checkout.',
        createdAt: '2026-03-14T11:30:00.000Z',
      },
    ]);
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
      refreshMetrics: ['MOST_ACTIVE_STORE', 'POPULAR_STORE'],
    });
  });

  it('does not publish a badge profile event when a rating only repeats existing badges', async () => {
    const existingStore = buildStoreRecord({
      badges: ['Featured'],
    });

    mockedStoreRepository.findStoreById.mockResolvedValue(existingStore);
    mockedStoreRepository.addRatingForUser.mockResolvedValue(
      buildStoreRecord({
        rating: '4.6',
        badges: ['Featured'],
      }),
    );
    mockedNewsFeedClient.syncBestEffort.mockResolvedValue(undefined);

    await storeService.rateStore('user-123', 18, {
      rating: 5,
      badges: ['Featured'],
      description: 'Reliable every time.',
    });

    expect(mockedStoreRepository.addRatingForUser).toHaveBeenCalledWith(
      18,
      'user-123',
      5,
      ['Featured'],
      'Reliable every time.',
    );
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

  it('rejects ratings for inactive stores', async () => {
    mockedStoreRepository.findStoreById.mockResolvedValue(
      buildStoreRecord({
        active: false,
      }),
    );

    await expect(
      storeService.rateStore('user-123', 18, {
        rating: 5,
      }),
    ).rejects.toMatchObject({
      code: 'STORE_NOT_FOUND',
      statusCode: 404,
    });

    expect(mockedStoreRepository.addRatingForUser).not.toHaveBeenCalled();
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

  it('publishes a friendly product-added event when a new product appears', async () => {
    const existingStore = buildStoreRecord();
    const updatedStore = buildStoreRecord({
      products: [
        buildProductRecord({ id: 'prod-2', name: 'Chocolate Cake', price: '900', tag: 'Dessert' }),
      ],
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

    await storeService.updateMyStore('user-123', {
      name: 'Fresh Mart2',
      updatedAt: '2026-03-15T08:00:00.000Z',
      searchCount: 99,
    } as never);

    expect(mockedNewsFeedClient.syncBestEffort).toHaveBeenCalledWith({
      events: undefined,
      refreshMetrics: undefined,
    });
  });
});
