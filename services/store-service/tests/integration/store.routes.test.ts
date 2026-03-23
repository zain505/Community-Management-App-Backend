jest.mock('../../src/modules/store/store.service', () => ({
  storeService: {
    createMyStore: jest.fn(),
    rateStore: jest.fn(),
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

  it('accepts large base64 store images for store creation', async () => {
    mockedStoreService.createMyStore.mockResolvedValue({
      id: 18,
      name: 'Fresh Mart',
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
      location: 'Main Road',
      rating: '4.5',
      image: 'data:image/png;base64,aGVsbG8=',
      badges: [],
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
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.rating).toBe('4.5');
    expect(mockedStoreService.rateStore).toHaveBeenCalledWith('user_123', 18, {
      rating: 4.5,
    });
  });
});
