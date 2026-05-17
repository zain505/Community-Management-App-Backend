jest.mock('../../src/modules/store/store.service', () => ({
  storeService: {
    createMyStore: jest.fn(),
    favoriteStore: jest.fn(),
    listFavoriteStores: jest.fn(),
    listStores: jest.fn(),
    listStoresForAdmin: jest.fn(),
    rateStore: jest.fn(),
    unfavoriteStore: jest.fn(),
    updateStoreActivation: jest.fn(),
  },
}));

import request from 'supertest';
import { app } from '../../src/app';
import { signAccessToken } from '../../src/lib/token';
import { storeService } from '../../src/modules/store/store.service';

const mockedStoreService = jest.mocked(storeService);
const largeStoreImageBase64 = `data:image/png;base64,${'a'.repeat(160_000)}`;

function getAccessToken(): string {
  return signAccessToken({
    sub: 'user_123',
  });
}

describe('store routes', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns store reviews in the public store list response', async () => {
    mockedStoreService.listStores.mockResolvedValue([
      {
        id: 18,
        name: 'Fresh Mart',
        active: true,
        location: 'Main Road',
        rating: '4.5',
        image: 'data:image/png;base64,aGVsbG8=',
        badges: ['Best Seller'],
        delivery: '30 mins',
        minOrderRs: '500',
        openingTime: '09:00',
        closingTime: '22:00',
        phoneNumber: '03001234567',
        reviews: [
          {
            id: 3,
            rating: 5,
            description: 'Fresh produce and helpful staff.',
            createdAt: '2026-03-14T10:00:00.000Z',
          },
        ],
      },
    ]);

    const response = await request(app).get('/v1/stores');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data[0].reviews).toEqual([
      {
        id: 3,
        rating: 5,
        description: 'Fresh produce and helpful staff.',
        createdAt: '2026-03-14T10:00:00.000Z',
      },
    ]);
    expect(mockedStoreService.listStores).toHaveBeenCalledWith(undefined, 1);
  });

  it('treats an empty public store search query as no search filter', async () => {
    mockedStoreService.listStores.mockResolvedValue([]);

    const response = await request(app).get('/v1/stores?search=');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(mockedStoreService.listStores).toHaveBeenCalledWith(undefined, 1);
  });

  it('passes a trimmed public store search query through to the service', async () => {
    mockedStoreService.listStores.mockResolvedValue([]);

    const response = await request(app).get('/v1/stores?search=%20fresh%20mart%20&page=1');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(mockedStoreService.listStores).toHaveBeenCalledWith('fresh mart', 1);
  });

  it('passes admin store-list queries through for authenticated users', async () => {
    mockedStoreService.listStoresForAdmin.mockResolvedValue([
      {
        id: 19,
        name: 'Fresh Mart Closed',
        active: false,
        location: 'Main Road',
        rating: '4.5',
        image: 'data:image/png;base64,aGVsbG8=',
        badges: ['Best Seller'],
        delivery: '30 mins',
        minOrderRs: '500',
        openingTime: '09:00',
        closingTime: '22:00',
        phoneNumber: '03001234567',
        reviews: [],
      },
    ]);

    const response = await request(app)
      .get('/v1/stores/admin?search=fresh&page=2&active=0')
      .set('Authorization', `Bearer ${getAccessToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual([
      expect.objectContaining({
        id: 19,
        active: false,
      }),
    ]);
    expect(mockedStoreService.listStoresForAdmin).toHaveBeenCalledWith(
      'user_123',
      'fresh',
      2,
      false,
    );
  });

  it('accepts large base64 store images for store creation', async () => {
    mockedStoreService.createMyStore.mockResolvedValue({
      id: 18,
      name: 'Fresh Mart',
      active: true,
      location: 'Main Road',
      rating: '0',
      image: largeStoreImageBase64,
      badges: [],
      delivery: '30 mins',
      minOrderRs: '500',
      openingTime: '09:00',
      closingTime: '22:00',
      phoneNumber: '03001234567',
      products: [],
    });

    const response = await request(app)
      .post('/v1/stores')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .send({
        name: 'Fresh Mart',
        location: 'Main Road',
        image: largeStoreImageBase64,
        delivery: '30 mins',
        minOrderRs: '500',
        openingTime: '09:00',
        closingTime: '22:00',
        phoneNumber: '03001234567',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.image).toBe(largeStoreImageBase64);
    expect(mockedStoreService.createMyStore).toHaveBeenCalledWith('user_123', {
      name: 'Fresh Mart',
      location: 'Main Road',
      image: largeStoreImageBase64,
      delivery: '30 mins',
      minOrderRs: '500',
      openingTime: '09:00',
      closingTime: '22:00',
      phoneNumber: '03001234567',
    });
  });

  it('requires authentication before a user can list favorite stores', async () => {
    const response = await request(app).get('/v1/stores/favorites');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('UNAUTHORIZED');
  });

  it('lists favorite stores for an authenticated user', async () => {
    mockedStoreService.listFavoriteStores.mockResolvedValue([
      {
        id: 18,
        name: 'Fresh Mart',
        active: true,
        location: 'Main Road',
        rating: '4.5',
        image: 'data:image/png;base64,aGVsbG8=',
        badges: ['Best Seller'],
        delivery: '30 mins',
        minOrderRs: '500',
        openingTime: '09:00',
        closingTime: '22:00',
        phoneNumber: '03001234567',
        isFavorite: true,
        reviews: [],
      },
    ]);

    const response = await request(app)
      .get('/v1/stores/favorites?search=%20fresh%20&page=2')
      .set('Authorization', `Bearer ${getAccessToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data[0].isFavorite).toBe(true);
    expect(mockedStoreService.listFavoriteStores).toHaveBeenCalledWith('user_123', 'fresh', 2);
  });

  it('marks a store as favorite for an authenticated user', async () => {
    mockedStoreService.favoriteStore.mockResolvedValue({
      id: 18,
      name: 'Fresh Mart',
      active: true,
      location: 'Main Road',
      rating: '4.5',
      image: 'data:image/png;base64,aGVsbG8=',
      badges: ['Best Seller'],
      delivery: '30 mins',
      minOrderRs: '500',
      openingTime: '09:00',
      closingTime: '22:00',
      phoneNumber: '03001234567',
      isFavorite: true,
      reviews: [],
    });

    const response = await request(app)
      .post('/v1/stores/18/favorite')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .send({});

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.isFavorite).toBe(true);
    expect(mockedStoreService.favoriteStore).toHaveBeenCalledWith('user_123', 18);
  });

  it('removes a store from favorites for an authenticated user', async () => {
    mockedStoreService.unfavoriteStore.mockResolvedValue(undefined);

    const response = await request(app)
      .delete('/v1/stores/18/favorite')
      .set('Authorization', `Bearer ${getAccessToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual({
      message: 'Store removed from favorites',
    });
    expect(mockedStoreService.unfavoriteStore).toHaveBeenCalledWith('user_123', 18);
  });

  it('requires authentication before a user can rate a store', async () => {
    const response = await request(app).post('/v1/stores/18/ratings').send({
      rating: 4.5,
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('UNAUTHORIZED');
  });

  it('creates a store rating for an authenticated user', async () => {
    mockedStoreService.rateStore.mockResolvedValue({
      id: 18,
      name: 'Fresh Mart',
      active: true,
      location: 'Main Road',
      rating: '4.5',
      image: 'data:image/png;base64,aGVsbG8=',
      badges: ['Best Seller'],
      delivery: '30 mins',
      minOrderRs: '500',
      openingTime: '09:00',
      closingTime: '22:00',
      phoneNumber: '03001234567',
      products: [],
    });

    const response = await request(app)
      .post('/v1/stores/18/ratings')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .send({
        rating: 4.5,
        badges: ['Best Seller'],
        description: 'Fresh produce and helpful staff.',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.rating).toBe('4.5');
    expect(response.body.data.badges).toEqual(['Best Seller']);
    expect(mockedStoreService.rateStore).toHaveBeenCalledWith('user_123', 18, {
      rating: 4.5,
      badges: ['Best Seller'],
      description: 'Fresh produce and helpful staff.',
    });
  });

  it('allows authenticated admins to update a store activation state', async () => {
    mockedStoreService.updateStoreActivation.mockResolvedValue({
      id: 18,
      name: 'Fresh Mart',
      active: false,
      location: 'Main Road',
      rating: '4.5',
      image: 'data:image/png;base64,aGVsbG8=',
      badges: ['Best Seller'],
      delivery: '30 mins',
      minOrderRs: '500',
      openingTime: '09:00',
      closingTime: '22:00',
      phoneNumber: '03001234567',
      products: [],
    });

    const response = await request(app)
      .patch('/v1/stores/18/status')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .send({
        active: 0,
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.active).toBe(false);
    expect(mockedStoreService.updateStoreActivation).toHaveBeenCalledWith('user_123', 18, false);
  });
});
