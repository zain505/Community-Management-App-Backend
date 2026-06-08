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

import fs from 'node:fs/promises';
import path from 'node:path';
import request from 'supertest';
import { app } from '../../src/app';
import { signAccessToken } from '../../src/lib/token';
import { storeService } from '../../src/modules/store/store.service';

const mockedStoreService = jest.mocked(storeService);
const uploadsRoot = path.resolve(__dirname, '../../uploads');
const storeImageUrl = 'http://localhost:3000/uploads/store-images/store-image.png';
const pngImageBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);

function getAccessToken(): string {
  return signAccessToken({
    sub: 'user_123',
  });
}

describe('store routes', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(async () => {
    await fs.rm(uploadsRoot, { recursive: true, force: true });
  });

  it('returns store reviews in the public store list response', async () => {
    mockedStoreService.listStores.mockResolvedValue([
      {
        id: 18,
        name: 'Fresh Mart',
        active: true,
        location: 'Main Road',
        rating: '4.5',
        image: storeImageUrl,
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
        image: storeImageUrl,
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

  it('accepts multipart store images for store creation', async () => {
    mockedStoreService.createMyStore.mockResolvedValue({
      id: 18,
      name: 'Fresh Mart',
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
      category: {
        id: 3,
        name: 'Groceries',
      },
      products: [],
    });

    const response = await request(app)
      .post('/v1/stores')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .field('name', 'Fresh Mart')
      .field('location', 'Main Road')
      .field('delivery', '30 mins')
      .field('minOrderRs', '500')
      .field('openingTime', '09:00')
      .field('closingTime', '22:00')
      .field('phoneNumber', '03001234567')
      .field('categoryId', '3')
      .attach('image', pngImageBuffer, {
        filename: 'store.png',
        contentType: 'image/png',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.image).toBe(storeImageUrl);
    expect(mockedStoreService.createMyStore).toHaveBeenCalledWith('user_123', {
      name: 'Fresh Mart',
      location: 'Main Road',
      image: expect.stringContaining('/uploads/store-images/'),
      delivery: '30 mins',
      minOrderRs: '500',
      openingTime: '09:00',
      closingTime: '22:00',
      phoneNumber: '03001234567',
      categoryId: 3,
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
        image: storeImageUrl,
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
      image: storeImageUrl,
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
      image: storeImageUrl,
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
      image: storeImageUrl,
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
