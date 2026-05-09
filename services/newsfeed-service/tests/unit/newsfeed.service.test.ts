import fs from 'node:fs/promises';
import path from 'node:path';
jest.mock('../../src/modules/newsfeed/newsfeed.repository', () => ({
  newsFeedRepository: {
    createEntry: jest.fn(),
    createUserPost: jest.fn(),
    listEntries: jest.fn(),
    listUserSubmittedEntries: jest.fn(),
    deleteEntriesOlderThan: jest.fn(),
    deleteExpiredSavedEntries: jest.fn(),
    saveEntry: jest.fn(),
    listSavedEntries: jest.fn(),
    likeEntry: jest.fn(),
    updateApprovalStatus: jest.fn(),
    getMetricStateStoreId: jest.fn(),
    upsertMetricState: jest.fn(),
    findMostActiveStoreId: jest.fn(),
  },
}));

jest.mock('../../src/modules/store/store.client', () => ({
  storeClient: {
    listStoresForPopularityRanking: jest.fn(),
    findStoreSummariesByIds: jest.fn(),
    findStoreBasicById: jest.fn(),
    findStoreSummaryById: jest.fn(),
    findMostSearchedStore: jest.fn(),
  },
}));

jest.mock('../../src/modules/auth/auth.client', () => ({
  authClient: {
    findUsersPublicByIds: jest.fn(),
    findUserPublicById: jest.fn(),
    getManagedUserStatus: jest.fn(),
  },
}));

jest.mock('../../src/modules/newsfeed/newsfeed.cache', () => ({
  invalidateNewsFeedListCache: jest.fn(),
  readNewsFeedListCache: jest.fn(),
  writeNewsFeedListCache: jest.fn(),
}));

import { authClient } from '../../src/modules/auth/auth.client';
import * as newsFeedCache from '../../src/modules/newsfeed/newsfeed.cache';
import { newsFeedRepository } from '../../src/modules/newsfeed/newsfeed.repository';
import { newsFeedService } from '../../src/modules/newsfeed/newsfeed.service';
import { storeClient } from '../../src/modules/store/store.client';

const mockedAuthClient = jest.mocked(authClient);
const mockedNewsFeedCache = jest.mocked(newsFeedCache);
const mockedNewsFeedRepository = jest.mocked(newsFeedRepository);
const mockedStoreClient = jest.mocked(storeClient);
const uploadsRoot = path.resolve(__dirname, '../../uploads');
const pngImageBase64 = `data:image/png;base64,${Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00,
]).toString('base64')}`;
const pngImageBase64Alt = `data:image/png;base64,${Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x01,
]).toString('base64')}`;

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

describe('newsfeed service', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-03-19T12:00:00.000Z'));
    jest.resetAllMocks();
    mockedNewsFeedCache.invalidateNewsFeedListCache.mockResolvedValue(undefined);
    mockedNewsFeedCache.readNewsFeedListCache.mockResolvedValue(null);
    mockedNewsFeedCache.writeNewsFeedListCache.mockResolvedValue(false);
    mockedNewsFeedRepository.createEntry.mockResolvedValue({
      id: 'feed-1',
      type: 'STORE_CREATED',
      source: 'SYSTEM',
      approvalStatus: 'APPROVED',
      title: 'placeholder',
      description: 'placeholder',
      image: null,
      authorUserId: null,
      storeId: 1,
      storeName: 'Store',
      metadata: null,
      _count: {
        likes: 0,
      },
      createdAt: new Date('2026-03-14T08:00:00.000Z'),
    } as never);
    mockedNewsFeedRepository.deleteEntriesOlderThan.mockResolvedValue([]);
    mockedNewsFeedRepository.deleteExpiredSavedEntries.mockResolvedValue(0);
    mockedNewsFeedRepository.upsertMetricState.mockResolvedValue(undefined);
  });

  afterEach(async () => {
    jest.useRealTimers();
    await removeUploadsDirectory();
  });

  it('returns cached public newsfeed pages without hitting the repository', async () => {
    mockedNewsFeedCache.readNewsFeedListCache.mockResolvedValue({
      items: [
        {
          id: 'feed-cached',
          type: 'STORE_CREATED',
          source: 'SYSTEM',
          approvalStatus: 'APPROVED',
          title: 'Cached feed',
          description: 'Returned from cache.',
          likesCount: 0,
          createdAt: '2026-03-14T08:00:00.000Z',
        },
      ],
      page: 1,
      limit: 10,
      hasMore: false,
    });

    const feed = await newsFeedService.listNewsFeed(1, 10);

    expect(feed).toEqual({
      items: [
        {
          id: 'feed-cached',
          type: 'STORE_CREATED',
          source: 'SYSTEM',
          approvalStatus: 'APPROVED',
          title: 'Cached feed',
          description: 'Returned from cache.',
          likesCount: 0,
          createdAt: '2026-03-14T08:00:00.000Z',
        },
      ],
      page: 1,
      limit: 10,
      hasMore: false,
    });
    expect(mockedNewsFeedRepository.listEntries).not.toHaveBeenCalled();
    expect(mockedNewsFeedCache.writeNewsFeedListCache).not.toHaveBeenCalled();
    expect(mockedNewsFeedRepository.deleteEntriesOlderThan).toHaveBeenCalledWith(
      new Date('2026-02-19T12:00:00.000Z'),
    );
  });

  it('attaches store data for store-only feed items', async () => {
    mockedNewsFeedRepository.listEntries.mockResolvedValue({
      items: [
        {
          id: 'feed-1',
          type: 'STORE_CREATED',
          title: 'A new store opened in your neighborhood.',
          description: 'Check out Fresh Mart.',
          storeId: 7,
          storeName: 'Fresh Mart',
          metadata: null,
          _count: {
            likes: 0,
          },
          createdAt: new Date('2026-03-14T08:00:00.000Z'),
        },
      ],
      hasMore: false,
    } as never);
    mockedStoreClient.findStoreSummariesByIds.mockResolvedValue([
      {
        id: 7,
        ownerUserId: 'user-123',
        name: 'Fresh Mart',
        active: true,
        location: 'Main Road',
        rating: '4.5',
        image: 'https://example.com/fresh-mart.png',
        badges: ['Popular'],
        delivery: '30 mins',
        minOrderRs: '500',
        openingTime: '09:00',
        closingTime: '22:00',
        phoneNumber: '03001234567',
      },
    ]);
    mockedAuthClient.findUsersPublicByIds.mockResolvedValue([
      {
        id: 'user-123',
        name: 'Store Owner',
        mobileNumber: '03009998888',
        profile: {
          image: null,
        },
        createdAt: '2026-03-01T08:00:00.000Z',
      },
    ]);

    const feed = await newsFeedService.listNewsFeed(1, 10);

    expect(feed.items).toEqual([
      {
        id: 'feed-1',
        type: 'STORE_CREATED',
        source: 'SYSTEM',
        approvalStatus: 'APPROVED',
        title: 'A new store opened in your neighborhood.',
        description: 'Check out Fresh Mart.',
        storeId: 7,
        storeName: 'Fresh Mart',
        store: {
          id: 7,
          name: 'Fresh Mart',
          active: true,
          location: 'Main Road',
          rating: '4.5',
          image: 'https://example.com/fresh-mart.png',
          badges: ['Popular'],
          delivery: '30 mins',
          minOrderRs: '500',
          openingTime: '09:00',
          closingTime: '22:00',
          phoneNumber: '03001234567',
        },
        storeOwner: {
          id: 'user-123',
          name: 'Store Owner',
          mobileNumber: '03009998888',
          profile: {
            image: null,
          },
          createdAt: '2026-03-01T08:00:00.000Z',
        },
        metadata: undefined,
        likesCount: 0,
        createdAt: '2026-03-14T08:00:00.000Z',
      },
    ]);
    expect(mockedStoreClient.findStoreSummariesByIds).toHaveBeenCalledWith([7]);
    expect(mockedAuthClient.findUsersPublicByIds).toHaveBeenCalledWith(['user-123']);
    expect(mockedNewsFeedCache.writeNewsFeedListCache).toHaveBeenCalledWith(
      1,
      10,
      expect.objectContaining({
        page: 1,
        limit: 10,
      }),
    );
  });

  it('attaches both store and product data for product feed items', async () => {
    mockedNewsFeedRepository.listEntries.mockResolvedValue({
      items: [
        {
          id: 'feed-2',
          type: 'PRODUCT_UPDATED',
          title: 'Fresh Mart updated a product.',
          description: "See what's new with Orange Juice.",
          storeId: 7,
          storeName: 'Fresh Mart',
          metadata: {
            current: {
              id: 'prod-1',
              name: 'Orange Juice',
              price: '550',
              image: 'https://example.com/orange-juice.png',
              tag: 'Fresh',
            },
          },
          _count: {
            likes: 1,
          },
          createdAt: new Date('2026-03-14T08:00:00.000Z'),
        },
      ],
      hasMore: false,
    } as never);
    mockedStoreClient.findStoreSummariesByIds.mockResolvedValue([
      {
        id: 7,
        ownerUserId: 'user-123',
        name: 'Fresh Mart',
        active: true,
        location: 'Main Road',
        rating: '4.5',
        image: 'https://example.com/fresh-mart.png',
        badges: ['Popular'],
        delivery: '30 mins',
        minOrderRs: '500',
        openingTime: '09:00',
        closingTime: '22:00',
        phoneNumber: '03001234567',
      },
    ]);
    mockedAuthClient.findUsersPublicByIds.mockResolvedValue([
      {
        id: 'user-123',
        name: 'Store Owner',
        mobileNumber: '03009998888',
        profile: {
          image: null,
        },
        createdAt: '2026-03-01T08:00:00.000Z',
      },
    ]);

    const feed = await newsFeedService.listNewsFeed(1, 10);

    expect(feed.items).toEqual([
      {
        id: 'feed-2',
        type: 'PRODUCT_UPDATED',
        source: 'SYSTEM',
        approvalStatus: 'APPROVED',
        title: 'Fresh Mart updated a product.',
        description: "See what's new with Orange Juice.",
        storeId: 7,
        storeName: 'Fresh Mart',
        store: {
          id: 7,
          name: 'Fresh Mart',
          active: true,
          location: 'Main Road',
          rating: '4.5',
          image: 'https://example.com/fresh-mart.png',
          badges: ['Popular'],
          delivery: '30 mins',
          minOrderRs: '500',
          openingTime: '09:00',
          closingTime: '22:00',
          phoneNumber: '03001234567',
        },
        storeOwner: {
          id: 'user-123',
          name: 'Store Owner',
          mobileNumber: '03009998888',
          profile: {
            image: null,
          },
          createdAt: '2026-03-01T08:00:00.000Z',
        },
        product: {
          id: 'prod-1',
          name: 'Orange Juice',
          price: '550',
          image: 'https://example.com/orange-juice.png',
          tag: 'Fresh',
        },
        metadata: {
          current: {
            id: 'prod-1',
            name: 'Orange Juice',
            price: '550',
            image: 'https://example.com/orange-juice.png',
            tag: 'Fresh',
          },
        },
        likesCount: 1,
        createdAt: '2026-03-14T08:00:00.000Z',
      },
    ]);
    expect(mockedStoreClient.findStoreSummariesByIds).toHaveBeenCalledWith([7]);
    expect(mockedAuthClient.findUsersPublicByIds).toHaveBeenCalledWith(['user-123']);
  });

  it('preserves inline image payloads in the newsfeed response', async () => {
    const inlineImage = `data:image/png;base64,${'A'.repeat(2048)}`;

    mockedNewsFeedRepository.listEntries.mockResolvedValue({
      items: [
        {
          id: 'feed-inline-images',
          type: 'PRODUCT_UPDATED',
          title: 'Fresh Mart updated a product.',
          description: 'Orange Juice image was refreshed.',
          storeId: 7,
          storeName: 'Fresh Mart',
          metadata: {
            current: {
              id: 'prod-1',
              name: 'Orange Juice',
              price: '550',
              image: inlineImage,
              tag: 'Fresh',
            },
            previousImage: inlineImage,
          },
          _count: {
            likes: 1,
          },
          createdAt: new Date('2026-03-14T08:00:00.000Z'),
        },
      ],
      hasMore: false,
    } as never);
    mockedStoreClient.findStoreSummariesByIds.mockResolvedValue([
      {
        id: 7,
        ownerUserId: 'user-123',
        name: 'Fresh Mart',
        active: true,
        location: 'Main Road',
        rating: '4.5',
        image: inlineImage,
        badges: ['Popular'],
        delivery: '30 mins',
        minOrderRs: '500',
        openingTime: '09:00',
        closingTime: '22:00',
        phoneNumber: '03001234567',
      },
    ]);
    mockedAuthClient.findUsersPublicByIds.mockResolvedValue([
      {
        id: 'user-123',
        name: 'Store Owner',
        mobileNumber: '03009998888',
        profile: {
          image: inlineImage,
        },
        createdAt: '2026-03-01T08:00:00.000Z',
      },
    ]);

    const feed = await newsFeedService.listNewsFeed(1, 10);

    expect(feed.items).toEqual([
      {
        id: 'feed-inline-images',
        type: 'PRODUCT_UPDATED',
        source: 'SYSTEM',
        approvalStatus: 'APPROVED',
        title: 'Fresh Mart updated a product.',
        description: 'Orange Juice image was refreshed.',
        storeId: 7,
        storeName: 'Fresh Mart',
        store: {
          id: 7,
          name: 'Fresh Mart',
          active: true,
          location: 'Main Road',
          rating: '4.5',
          image: inlineImage,
          badges: ['Popular'],
          delivery: '30 mins',
          minOrderRs: '500',
          openingTime: '09:00',
          closingTime: '22:00',
          phoneNumber: '03001234567',
        },
        storeOwner: {
          id: 'user-123',
          name: 'Store Owner',
          mobileNumber: '03009998888',
          profile: {
            image: inlineImage,
          },
          createdAt: '2026-03-01T08:00:00.000Z',
        },
        product: {
          id: 'prod-1',
          name: 'Orange Juice',
          price: '550',
          image: inlineImage,
          tag: 'Fresh',
        },
        metadata: {
          current: {
            id: 'prod-1',
            name: 'Orange Juice',
            price: '550',
            image: inlineImage,
            tag: 'Fresh',
          },
          previousImage: inlineImage,
        },
        likesCount: 1,
        createdAt: '2026-03-14T08:00:00.000Z',
      },
    ]);
  });

  it('stores base64 user post images as managed URLs and returns the pending post with author data', async () => {
    mockedNewsFeedRepository.createUserPost.mockResolvedValue({
      id: 'feed-user-1',
      type: 'USER_POST',
      source: 'USER_POST',
      approvalStatus: 'PENDING',
      title: 'Water outage notice',
      description: 'There will be a short outage tomorrow morning.',
      image: '/uploads/newsfeed-images/post-image.png',
      authorUserId: 'user-123',
      storeId: null,
      storeName: null,
      metadata: null,
      _count: {
        likes: 0,
      },
      createdAt: new Date('2026-03-19T12:00:00.000Z'),
    } as never);
    mockedAuthClient.findUsersPublicByIds.mockResolvedValue([
      {
        id: 'user-123',
        name: 'Community User',
        mobileNumber: '03009998888',
        profile: {
          image: null,
        },
        createdAt: '2026-03-01T08:00:00.000Z',
      },
    ]);

    const post = await newsFeedService.createNewsFeedPost('user-123', {
      title: 'Water outage notice',
      description: 'There will be a short outage tomorrow morning.',
      image: pngImageBase64,
    });

    expect(mockedNewsFeedRepository.createUserPost).toHaveBeenCalledWith({
      authorUserId: 'user-123',
      title: 'Water outage notice',
      description: 'There will be a short outage tomorrow morning.',
      image: expect.stringMatching(/^\/uploads\/newsfeed-images\//),
    });
    expect(post).toEqual({
      id: 'feed-user-1',
      type: 'USER_POST',
      source: 'USER_POST',
      approvalStatus: 'PENDING',
      title: 'Water outage notice',
      description: 'There will be a short outage tomorrow morning.',
      image: '/uploads/newsfeed-images/post-image.png',
      authorUserId: 'user-123',
      author: {
        id: 'user-123',
        name: 'Community User',
        mobileNumber: '03009998888',
        profile: {
          image: null,
        },
        createdAt: '2026-03-01T08:00:00.000Z',
      },
      metadata: undefined,
      likesCount: 0,
      createdAt: '2026-03-19T12:00:00.000Z',
    });
  });

  it('stores inline sync images as managed URLs before saving the event', async () => {
    await newsFeedService.syncNewsFeed({
      events: [
        {
          type: 'PRODUCT_UPDATED',
          title: 'Fresh Mart updated a product.',
          description: 'Orange Juice image was refreshed.',
          metadata: {
            current: {
              id: 'prod-1',
              name: 'Orange Juice',
              price: '550',
              image: pngImageBase64,
            },
            previousImage: pngImageBase64Alt,
          },
        },
      ],
    });

    expect(mockedNewsFeedRepository.createEntry).toHaveBeenCalledWith({
      type: 'PRODUCT_UPDATED',
      title: 'Fresh Mart updated a product.',
      description: 'Orange Juice image was refreshed.',
      image: undefined,
      storeId: undefined,
      storeName: undefined,
      metadata: {
        current: {
          id: 'prod-1',
          name: 'Orange Juice',
          price: '550',
          image: expect.stringMatching(/^\/uploads\/newsfeed-images\//),
        },
        previousImage: expect.stringMatching(/^\/uploads\/newsfeed-images\//),
      },
    });
  });

  it('lists pending user posts for admins', async () => {
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
    mockedNewsFeedRepository.listUserSubmittedEntries.mockResolvedValue({
      items: [
        {
          id: 'feed-user-1',
          type: 'USER_POST',
          source: 'USER_POST',
          approvalStatus: 'PENDING',
          title: 'Water outage notice',
          description: 'There will be a short outage tomorrow morning.',
          image: '/uploads/newsfeed-images/post-image.png',
          authorUserId: 'user-123',
          storeId: null,
          storeName: null,
          metadata: null,
          _count: {
            likes: 0,
          },
          createdAt: new Date('2026-03-19T12:00:00.000Z'),
        },
      ],
      hasMore: false,
    } as never);
    mockedAuthClient.findUsersPublicByIds.mockResolvedValue([
      {
        id: 'user-123',
        name: 'Community User',
        mobileNumber: '03009998888',
        profile: {
          image: null,
        },
        createdAt: '2026-03-01T08:00:00.000Z',
      },
    ]);

    const posts = await newsFeedService.listUserSubmittedNewsFeed('admin-123', 1, 10, 'PENDING');

    expect(mockedNewsFeedRepository.listUserSubmittedEntries).toHaveBeenCalledWith(1, 10, 'PENDING');
    expect(posts).toEqual({
      items: [
        {
          id: 'feed-user-1',
          type: 'USER_POST',
          source: 'USER_POST',
          approvalStatus: 'PENDING',
          title: 'Water outage notice',
          description: 'There will be a short outage tomorrow morning.',
          image: '/uploads/newsfeed-images/post-image.png',
          authorUserId: 'user-123',
          author: {
            id: 'user-123',
            name: 'Community User',
            mobileNumber: '03009998888',
            profile: {
              image: null,
            },
            createdAt: '2026-03-01T08:00:00.000Z',
          },
          metadata: undefined,
          likesCount: 0,
          createdAt: '2026-03-19T12:00:00.000Z',
        },
      ],
      page: 1,
      limit: 10,
      hasMore: false,
    });
  });

  it('allows active admins to approve user posts', async () => {
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
    mockedNewsFeedRepository.updateApprovalStatus.mockResolvedValue({
      id: 'feed-user-1',
      type: 'USER_POST',
      source: 'USER_POST',
      approvalStatus: 'APPROVED',
      title: 'Water outage notice',
      description: 'There will be a short outage tomorrow morning.',
      image: '/uploads/newsfeed-images/post-image.png',
      authorUserId: 'user-123',
      storeId: null,
      storeName: null,
      metadata: null,
      _count: {
        likes: 0,
      },
      createdAt: new Date('2026-03-19T12:00:00.000Z'),
    } as never);
    mockedAuthClient.findUsersPublicByIds.mockResolvedValue([
      {
        id: 'user-123',
        name: 'Community User',
        mobileNumber: '03009998888',
        profile: {
          image: null,
        },
        createdAt: '2026-03-01T08:00:00.000Z',
      },
    ]);

    const post = await newsFeedService.reviewNewsFeedPost('admin-123', 'feed-user-1', 'APPROVED');

    expect(mockedNewsFeedRepository.updateApprovalStatus).toHaveBeenCalledWith(
      'feed-user-1',
      'APPROVED',
    );
    expect(mockedNewsFeedCache.invalidateNewsFeedListCache).toHaveBeenCalled();
    expect(post).toEqual({
      id: 'feed-user-1',
      type: 'USER_POST',
      source: 'USER_POST',
      approvalStatus: 'APPROVED',
      title: 'Water outage notice',
      description: 'There will be a short outage tomorrow morning.',
      image: '/uploads/newsfeed-images/post-image.png',
      authorUserId: 'user-123',
      author: {
        id: 'user-123',
        name: 'Community User',
        mobileNumber: '03009998888',
        profile: {
          image: null,
        },
        createdAt: '2026-03-01T08:00:00.000Z',
      },
      metadata: undefined,
      likesCount: 0,
      createdAt: '2026-03-19T12:00:00.000Z',
    });
  });

  it('rejects user-post moderation from non-admin users', async () => {
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

    await expect(
      newsFeedService.reviewNewsFeedPost('user-123', 'feed-user-1', 'APPROVED'),
    ).rejects.toMatchObject({
      code: 'NEWSFEED_ADMIN_REQUIRED',
      statusCode: 403,
    });

    expect(mockedNewsFeedRepository.updateApprovalStatus).not.toHaveBeenCalled();
  });

  it('saves a feed for one month and returns the enriched saved item', async () => {
    mockedNewsFeedRepository.saveEntry.mockResolvedValue({
      id: 'save-1',
      savedAt: new Date('2026-03-19T12:00:00.000Z'),
      expiresAt: new Date('2026-04-19T12:00:00.000Z'),
      newsFeedItem: {
        id: 'feed-3',
        type: 'STORE_CREATED',
        title: 'Fresh Mart opened nearby',
        description: 'Fresh Mart is now open in your area.',
        storeId: 7,
        storeName: 'Fresh Mart',
        metadata: null,
        _count: {
          likes: 2,
        },
        createdAt: new Date('2026-03-14T08:00:00.000Z'),
      },
    } as never);
    mockedStoreClient.findStoreSummariesByIds.mockResolvedValue([
      {
        id: 7,
        ownerUserId: 'user-123',
        name: 'Fresh Mart',
        active: true,
        location: 'Main Road',
        rating: '4.5',
        image: 'https://example.com/fresh-mart.png',
        badges: ['Popular'],
        delivery: '30 mins',
        minOrderRs: '500',
        openingTime: '09:00',
        closingTime: '22:00',
        phoneNumber: '03001234567',
      },
    ]);
    mockedAuthClient.findUsersPublicByIds.mockResolvedValue([
      {
        id: 'user-123',
        name: 'Store Owner',
        mobileNumber: '03009998888',
        profile: {
          image: null,
        },
        createdAt: '2026-03-01T08:00:00.000Z',
      },
    ]);

    const savedFeed = await newsFeedService.saveNewsFeed('user-123', 'feed-3');

    expect(savedFeed).toEqual({
      id: 'feed-3',
      type: 'STORE_CREATED',
      source: 'SYSTEM',
      approvalStatus: 'APPROVED',
      title: 'Fresh Mart opened nearby',
      description: 'Fresh Mart is now open in your area.',
      storeId: 7,
      storeName: 'Fresh Mart',
      store: {
        id: 7,
        name: 'Fresh Mart',
        active: true,
        location: 'Main Road',
        rating: '4.5',
        image: 'https://example.com/fresh-mart.png',
        badges: ['Popular'],
        delivery: '30 mins',
        minOrderRs: '500',
        openingTime: '09:00',
        closingTime: '22:00',
        phoneNumber: '03001234567',
      },
      storeOwner: {
        id: 'user-123',
        name: 'Store Owner',
        mobileNumber: '03009998888',
        profile: {
          image: null,
        },
        createdAt: '2026-03-01T08:00:00.000Z',
      },
      metadata: undefined,
      likesCount: 2,
      createdAt: '2026-03-14T08:00:00.000Z',
      savedAt: '2026-03-19T12:00:00.000Z',
      expiresAt: '2026-04-19T12:00:00.000Z',
    });
    expect(mockedNewsFeedRepository.deleteExpiredSavedEntries).toHaveBeenCalledWith(
      new Date('2026-03-19T12:00:00.000Z'),
    );
    expect(mockedNewsFeedRepository.saveEntry).toHaveBeenCalledWith(
      'feed-3',
      'user-123',
      new Date('2026-03-19T12:00:00.000Z'),
      new Date('2026-04-19T12:00:00.000Z'),
    );
  });

  it('lists saved feeds for a user and removes expired records first', async () => {
    mockedNewsFeedRepository.listSavedEntries.mockResolvedValue([
      {
        id: 'save-1',
        savedAt: new Date('2026-03-19T12:00:00.000Z'),
        expiresAt: new Date('2026-04-19T12:00:00.000Z'),
        newsFeedItem: {
          id: 'feed-4',
          type: 'PRODUCT_UPDATED',
          title: 'Fresh Mart updated a product.',
          description: 'Orange Juice price was updated.',
          storeId: 7,
          storeName: 'Fresh Mart',
          metadata: {
            current: {
              id: 'prod-1',
              name: 'Orange Juice',
              price: '550',
              image: 'https://example.com/orange-juice.png',
              tag: 'Fresh',
            },
          },
          _count: {
            likes: 4,
          },
          createdAt: new Date('2026-03-14T08:00:00.000Z'),
        },
      },
    ] as never);
    mockedStoreClient.findStoreSummariesByIds.mockResolvedValue([
      {
        id: 7,
        ownerUserId: 'user-123',
        name: 'Fresh Mart',
        active: true,
        location: 'Main Road',
        rating: '4.5',
        image: 'https://example.com/fresh-mart.png',
        badges: ['Popular'],
        delivery: '30 mins',
        minOrderRs: '500',
        openingTime: '09:00',
        closingTime: '22:00',
        phoneNumber: '03001234567',
      },
    ]);
    mockedAuthClient.findUsersPublicByIds.mockResolvedValue([
      {
        id: 'user-123',
        name: 'Store Owner',
        mobileNumber: '03009998888',
        profile: {
          image: null,
        },
        createdAt: '2026-03-01T08:00:00.000Z',
      },
    ]);

    const savedFeeds = await newsFeedService.listSavedNewsFeed('user-123', 1, 10);

    expect(savedFeeds).toEqual({
      items: [
        {
          id: 'feed-4',
          type: 'PRODUCT_UPDATED',
          source: 'SYSTEM',
          approvalStatus: 'APPROVED',
          title: 'Fresh Mart updated a product.',
          description: 'Orange Juice price was updated.',
          storeId: 7,
          storeName: 'Fresh Mart',
          store: {
            id: 7,
            name: 'Fresh Mart',
            active: true,
            location: 'Main Road',
            rating: '4.5',
            image: 'https://example.com/fresh-mart.png',
            badges: ['Popular'],
            delivery: '30 mins',
            minOrderRs: '500',
            openingTime: '09:00',
            closingTime: '22:00',
            phoneNumber: '03001234567',
          },
          storeOwner: {
            id: 'user-123',
            name: 'Store Owner',
            mobileNumber: '03009998888',
            profile: {
              image: null,
            },
            createdAt: '2026-03-01T08:00:00.000Z',
          },
          product: {
            id: 'prod-1',
            name: 'Orange Juice',
            price: '550',
            image: 'https://example.com/orange-juice.png',
            tag: 'Fresh',
          },
          metadata: {
            current: {
              id: 'prod-1',
              name: 'Orange Juice',
              price: '550',
              image: 'https://example.com/orange-juice.png',
              tag: 'Fresh',
            },
          },
          likesCount: 4,
          createdAt: '2026-03-14T08:00:00.000Z',
          savedAt: '2026-03-19T12:00:00.000Z',
          expiresAt: '2026-04-19T12:00:00.000Z',
        },
      ],
      page: 1,
      limit: 10,
    });
    expect(mockedNewsFeedRepository.deleteExpiredSavedEntries).toHaveBeenCalledWith(
      new Date('2026-03-19T12:00:00.000Z'),
    );
    expect(mockedNewsFeedRepository.listSavedEntries).toHaveBeenCalledWith(
      'user-123',
      new Date('2026-03-19T12:00:00.000Z'),
      1,
      10,
    );
  });

  it('updates most-active state without creating an extra metric feed for the same store update request', async () => {
    mockedNewsFeedRepository.getMetricStateStoreId.mockResolvedValue(null);
    mockedNewsFeedRepository.findMostActiveStoreId.mockResolvedValue(7);
    mockedStoreClient.findStoreBasicById.mockResolvedValue({
      id: 7,
      name: 'Fresh Mart23223',
    });

    await newsFeedService.syncNewsFeed({
      events: [
        {
          type: 'STORE_LOCATION_UPDATED',
          title: 'Fresh Mart23223 location updated',
          description: 'Fresh Mart23223 location changed from Main Road to Mall Road.',
          storeId: 7,
          storeName: 'Fresh Mart23223',
        },
      ],
      refreshMetrics: ['MOST_ACTIVE_STORE'],
    });

    expect(mockedNewsFeedRepository.createEntry).toHaveBeenCalledTimes(1);
    expect(mockedNewsFeedRepository.createEntry).toHaveBeenCalledWith({
      type: 'STORE_LOCATION_UPDATED',
      title: 'Fresh Mart23223 location updated',
      description: 'Fresh Mart23223 location changed from Main Road to Mall Road.',
      storeId: 7,
      storeName: 'Fresh Mart23223',
      metadata: undefined,
    });
    expect(mockedNewsFeedRepository.upsertMetricState).toHaveBeenCalledWith('MOST_ACTIVE_STORE', 7);
    expect(mockedNewsFeedCache.invalidateNewsFeedListCache).toHaveBeenCalled();
  });

  it('still creates a metric feed when the derived winner is a different store', async () => {
    mockedNewsFeedRepository.getMetricStateStoreId.mockResolvedValue(null);
    mockedNewsFeedRepository.findMostActiveStoreId.mockResolvedValue(9);
    mockedStoreClient.findStoreBasicById.mockResolvedValue({
      id: 9,
      name: 'Active Store',
    });

    await newsFeedService.syncNewsFeed({
      events: [
        {
          type: 'STORE_NAME_UPDATED',
          title: 'Fresh Mart23 is now Fresh Mart23223',
          description: 'Store name changed from Fresh Mart23 to Fresh Mart23223.',
          storeId: 7,
          storeName: 'Fresh Mart23223',
        },
      ],
      refreshMetrics: ['MOST_ACTIVE_STORE'],
    });

    expect(mockedNewsFeedRepository.createEntry).toHaveBeenCalledTimes(2);
    expect(mockedNewsFeedRepository.createEntry).toHaveBeenNthCalledWith(2, {
      type: 'MOST_ACTIVE_STORE_CHANGED',
      storeId: 9,
      storeName: 'Active Store',
      title: 'Active Store is now most active',
      description: 'Active Store has the highest recent store activity.',
      metadata: undefined,
    });
    expect(mockedNewsFeedRepository.upsertMetricState).toHaveBeenCalledWith('MOST_ACTIVE_STORE', 9);
    expect(mockedNewsFeedCache.invalidateNewsFeedListCache).toHaveBeenCalled();
  });

  it('returns the latest likes count after a user likes a feed item', async () => {
    mockedNewsFeedRepository.likeEntry.mockResolvedValue({
      id: 'feed-1',
      likesCount: 3,
    } as never);

    const likedFeed = await newsFeedService.likeNewsFeed('user-123', 'feed-1');

    expect(likedFeed).toEqual({
      id: 'feed-1',
      likesCount: 3,
    });
    expect(mockedNewsFeedRepository.likeEntry).toHaveBeenCalledWith('feed-1', 'user-123');
    expect(mockedNewsFeedCache.invalidateNewsFeedListCache).toHaveBeenCalled();
  });

  it('throws when saving a missing feed item', async () => {
    mockedNewsFeedRepository.saveEntry.mockResolvedValue(null as never);

    await expect(newsFeedService.saveNewsFeed('user-123', 'missing-feed')).rejects.toMatchObject({
      code: 'NEWSFEED_NOT_FOUND',
      statusCode: 404,
    });
  });

  it('throws when liking a missing feed item', async () => {
    mockedNewsFeedRepository.likeEntry.mockResolvedValue(null as never);

    await expect(newsFeedService.likeNewsFeed('user-123', 'missing-feed')).rejects.toMatchObject({
      code: 'NEWSFEED_NOT_FOUND',
      statusCode: 404,
    });
  });
});
