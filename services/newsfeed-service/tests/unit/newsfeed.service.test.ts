jest.mock('../../src/modules/newsfeed/newsfeed.repository', () => ({
  newsFeedRepository: {
    createEntry: jest.fn(),
    listEntries: jest.fn(),
    deleteExpiredSavedEntries: jest.fn(),
    saveEntry: jest.fn(),
    listSavedEntries: jest.fn(),
    likeEntry: jest.fn(),
    getMetricStateStoreId: jest.fn(),
    upsertMetricState: jest.fn(),
    findMostActiveStoreId: jest.fn(),
  },
}));

jest.mock('../../src/modules/store/store.client', () => ({
  storeClient: {
    listStoresForPopularityRanking: jest.fn(),
    findStoreBasicById: jest.fn(),
    findStoreSummaryById: jest.fn(),
    findMostSearchedStore: jest.fn(),
  },
}));

jest.mock('../../src/modules/auth/auth.client', () => ({
  authClient: {
    findUserPublicById: jest.fn(),
  },
}));

import { authClient } from '../../src/modules/auth/auth.client';
import { newsFeedRepository } from '../../src/modules/newsfeed/newsfeed.repository';
import { newsFeedService } from '../../src/modules/newsfeed/newsfeed.service';
import { storeClient } from '../../src/modules/store/store.client';

const mockedAuthClient = jest.mocked(authClient);
const mockedNewsFeedRepository = jest.mocked(newsFeedRepository);
const mockedStoreClient = jest.mocked(storeClient);

describe('newsfeed service', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-03-19T12:00:00.000Z'));
    jest.resetAllMocks();
    mockedNewsFeedRepository.createEntry.mockResolvedValue({
      id: 'feed-1',
      type: 'STORE_CREATED',
      title: 'placeholder',
      description: 'placeholder',
      storeId: 1,
      storeName: 'Store',
      metadata: null,
      _count: {
        likes: 0,
      },
      createdAt: new Date('2026-03-14T08:00:00.000Z'),
    } as never);
    mockedNewsFeedRepository.deleteExpiredSavedEntries.mockResolvedValue(0);
    mockedNewsFeedRepository.upsertMetricState.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('attaches store data for store-only feed items', async () => {
    mockedNewsFeedRepository.listEntries.mockResolvedValue([
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
    ] as never);
    mockedStoreClient.findStoreSummaryById.mockResolvedValue({
      id: 7,
      ownerUserId: 'user-123',
      name: 'Fresh Mart',
      location: 'Main Road',
      rating: '4.5',
      image: 'https://example.com/fresh-mart.png',
      badges: ['Popular'],
      delivery: '30 mins',
      minOrderRs: '500',
      openingTime: '09:00',
      closingTime: '22:00',
      phoneNumber: '03001234567',
    });
    mockedAuthClient.findUserPublicById.mockResolvedValue({
      id: 'user-123',
      name: 'Store Owner',
      mobileNumber: '03009998888',
      profile: {
        image: null,
      },
      createdAt: '2026-03-01T08:00:00.000Z',
    });

    const feed = await newsFeedService.listNewsFeed(1, 10);

    expect(feed.items).toEqual([
      {
        id: 'feed-1',
        type: 'STORE_CREATED',
        title: 'A new store opened in your neighborhood.',
        description: 'Check out Fresh Mart.',
        storeId: 7,
        storeName: 'Fresh Mart',
        store: {
          id: 7,
          name: 'Fresh Mart',
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
    expect(mockedStoreClient.findStoreSummaryById).toHaveBeenCalledWith(7);
    expect(mockedAuthClient.findUserPublicById).toHaveBeenCalledWith('user-123');
  });

  it('attaches both store and product data for product feed items', async () => {
    mockedNewsFeedRepository.listEntries.mockResolvedValue([
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
    ] as never);
    mockedStoreClient.findStoreSummaryById.mockResolvedValue({
      id: 7,
      ownerUserId: 'user-123',
      name: 'Fresh Mart',
      location: 'Main Road',
      rating: '4.5',
      image: 'https://example.com/fresh-mart.png',
      badges: ['Popular'],
      delivery: '30 mins',
      minOrderRs: '500',
      openingTime: '09:00',
      closingTime: '22:00',
      phoneNumber: '03001234567',
    });
    mockedAuthClient.findUserPublicById.mockResolvedValue({
      id: 'user-123',
      name: 'Store Owner',
      mobileNumber: '03009998888',
      profile: {
        image: null,
      },
      createdAt: '2026-03-01T08:00:00.000Z',
    });

    const feed = await newsFeedService.listNewsFeed(1, 10);

    expect(feed.items).toEqual([
      {
        id: 'feed-2',
        type: 'PRODUCT_UPDATED',
        title: 'Fresh Mart updated a product.',
        description: "See what's new with Orange Juice.",
        storeId: 7,
        storeName: 'Fresh Mart',
        store: {
          id: 7,
          name: 'Fresh Mart',
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
    expect(mockedStoreClient.findStoreSummaryById).toHaveBeenCalledWith(7);
    expect(mockedAuthClient.findUserPublicById).toHaveBeenCalledWith('user-123');
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
    mockedStoreClient.findStoreSummaryById.mockResolvedValue({
      id: 7,
      ownerUserId: 'user-123',
      name: 'Fresh Mart',
      location: 'Main Road',
      rating: '4.5',
      image: 'https://example.com/fresh-mart.png',
      badges: ['Popular'],
      delivery: '30 mins',
      minOrderRs: '500',
      openingTime: '09:00',
      closingTime: '22:00',
      phoneNumber: '03001234567',
    });
    mockedAuthClient.findUserPublicById.mockResolvedValue({
      id: 'user-123',
      name: 'Store Owner',
      mobileNumber: '03009998888',
      profile: {
        image: null,
      },
      createdAt: '2026-03-01T08:00:00.000Z',
    });

    const savedFeed = await newsFeedService.saveNewsFeed('user-123', 'feed-3');

    expect(savedFeed).toEqual({
      id: 'feed-3',
      type: 'STORE_CREATED',
      title: 'Fresh Mart opened nearby',
      description: 'Fresh Mart is now open in your area.',
      storeId: 7,
      storeName: 'Fresh Mart',
      store: {
        id: 7,
        name: 'Fresh Mart',
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
    mockedStoreClient.findStoreSummaryById.mockResolvedValue({
      id: 7,
      ownerUserId: 'user-123',
      name: 'Fresh Mart',
      location: 'Main Road',
      rating: '4.5',
      image: 'https://example.com/fresh-mart.png',
      badges: ['Popular'],
      delivery: '30 mins',
      minOrderRs: '500',
      openingTime: '09:00',
      closingTime: '22:00',
      phoneNumber: '03001234567',
    });
    mockedAuthClient.findUserPublicById.mockResolvedValue({
      id: 'user-123',
      name: 'Store Owner',
      mobileNumber: '03009998888',
      profile: {
        image: null,
      },
      createdAt: '2026-03-01T08:00:00.000Z',
    });

    const savedFeeds = await newsFeedService.listSavedNewsFeed('user-123', 1, 10);

    expect(savedFeeds).toEqual({
      items: [
        {
          id: 'feed-4',
          type: 'PRODUCT_UPDATED',
          title: 'Fresh Mart updated a product.',
          description: 'Orange Juice price was updated.',
          storeId: 7,
          storeName: 'Fresh Mart',
          store: {
            id: 7,
            name: 'Fresh Mart',
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
