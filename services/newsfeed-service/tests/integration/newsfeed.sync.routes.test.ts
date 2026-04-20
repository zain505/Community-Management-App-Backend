jest.mock('../../src/modules/newsfeed/newsfeed.service', () => ({
  newsFeedService: {
    syncNewsFeed: jest.fn(),
  },
}));

import request from 'supertest';
import { app } from '../../src/app';
import { newsFeedService } from '../../src/modules/newsfeed/newsfeed.service';

const mockedNewsFeedService = jest.mocked(newsFeedService);

describe('internal newsfeed sync routes', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockedNewsFeedService.syncNewsFeed.mockResolvedValue(undefined);
  });

  it('accepts product sync events with large inline image metadata', async () => {
    const inlineImage = `data:image/png;base64,${'A'.repeat(150_000)}`;
    const payload = {
      events: [
        {
          type: 'PRODUCT_ADDED',
          title: 'Fresh Mart added a new product.',
          description: 'Check out Orange Juice.',
          storeId: 18,
          storeName: 'Fresh Mart',
          metadata: {
            product: {
              id: 'prod-1',
              name: 'Orange Juice',
              price: '500',
              image: inlineImage,
              tag: 'Fresh',
              description: 'Freshly squeezed orange juice.',
            },
          },
        },
      ],
      refreshMetrics: ['MOST_ACTIVE_STORE'],
    };

    const response = await request(app).post('/internal/newsfeed/sync').send(payload);

    expect(response.status).toBe(202);
    expect(response.body.success).toBe(true);
    expect(mockedNewsFeedService.syncNewsFeed).toHaveBeenCalledWith(payload);
  });
});
