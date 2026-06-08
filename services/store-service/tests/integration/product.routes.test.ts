jest.mock('../../src/modules/product/product.service', () => ({
  productService: {
    listProductsByStoreId: jest.fn(),
    listMyProducts: jest.fn(),
    getMyProduct: jest.fn(),
    createMyProduct: jest.fn(),
    updateMyProduct: jest.fn(),
    deleteMyProduct: jest.fn(),
  },
}));

import fs from 'node:fs/promises';
import path from 'node:path';
import request from 'supertest';
import { app } from '../../src/app';
import { signAccessToken } from '../../src/lib/token';
import { productService } from '../../src/modules/product/product.service';

const mockedProductService = jest.mocked(productService);
const uploadsRoot = path.resolve(__dirname, '../../uploads');
const productImageUrl = 'http://localhost:3000/uploads/product-images/product-image.png';
const pngImageBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);

function getAccessToken(): string {
  return signAccessToken({
    sub: 'user_123',
  });
}

describe('product routes', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(async () => {
    await fs.rm(uploadsRoot, { recursive: true, force: true });
  });

  it('creates a product', async () => {
    mockedProductService.createMyProduct.mockResolvedValue({
      id: 'prod-1',
      name: 'Orange Juice',
      price: '500',
      image: 'https://example.com/orange-juice.png',
      tag: 'Fresh',
      description: 'Freshly squeezed orange juice.',
    });

    const response = await request(app)
      .post('/v1/products')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .send({
        name: 'Orange Juice',
        price: '500',
        image: 'https://example.com/orange-juice.png',
        tag: 'Fresh',
        description: 'Freshly squeezed orange juice.',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe('prod-1');
    expect(mockedProductService.createMyProduct).toHaveBeenCalledWith('user_123', {
      name: 'Orange Juice',
      price: '500',
      image: 'https://example.com/orange-juice.png',
      tag: 'Fresh',
      description: 'Freshly squeezed orange juice.',
    });
  });

  it('accepts multipart product image uploads', async () => {
    mockedProductService.createMyProduct.mockResolvedValue({
      id: 'prod-1',
      name: 'Orange Juice',
      price: '500',
      image: productImageUrl,
      tag: 'Fresh',
      description: 'Freshly squeezed orange juice.',
    });

    const response = await request(app)
      .post('/v1/products')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .field('name', 'Orange Juice')
      .field('price', '500')
      .field('tag', 'Fresh')
      .field('description', 'Freshly squeezed orange juice.')
      .attach('image', pngImageBuffer, {
        filename: 'orange-juice.png',
        contentType: 'image/png',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.image).toBe(productImageUrl);
    expect(mockedProductService.createMyProduct).toHaveBeenCalledWith('user_123', {
      name: 'Orange Juice',
      price: '500',
      image: expect.stringContaining('/uploads/product-images/'),
      tag: 'Fresh',
      description: 'Freshly squeezed orange juice.',
    });
  });

  it('lists products', async () => {
    mockedProductService.listMyProducts.mockResolvedValue([
      {
        id: 'prod-1',
        name: 'Orange Juice',
        price: '500',
        image: 'https://example.com/orange-juice.png',
        tag: 'Fresh',
        description: 'Freshly squeezed orange juice.',
      },
    ]);

    const response = await request(app)
      .get('/v1/products?search=Orange&page=2')
      .set('Authorization', `Bearer ${getAccessToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
    expect(mockedProductService.listMyProducts).toHaveBeenCalledWith('user_123', 'Orange', 2);
  });

  it('lists products for a store', async () => {
    mockedProductService.listProductsByStoreId.mockResolvedValue([
      {
        id: 'prod-1',
        name: 'Orange Juice',
        price: '500',
        image: 'https://example.com/orange-juice.png',
        tag: 'Fresh',
        description: 'Freshly squeezed orange juice.',
      },
    ]);

    const response = await request(app).get('/v1/products/store/18?search=Orange&page=2');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
    expect(mockedProductService.listProductsByStoreId).toHaveBeenCalledWith(18, 'Orange', 2);
  });

  it('gets a single product', async () => {
    mockedProductService.getMyProduct.mockResolvedValue({
      id: 'prod-1',
      name: 'Orange Juice',
      price: '500',
      image: 'https://example.com/orange-juice.png',
      tag: 'Fresh',
      description: 'Freshly squeezed orange juice.',
    });

    const response = await request(app)
      .get('/v1/products/prod-1')
      .set('Authorization', `Bearer ${getAccessToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe('prod-1');
    expect(mockedProductService.getMyProduct).toHaveBeenCalledWith('user_123', 'prod-1');
  });

  it('updates a product', async () => {
    mockedProductService.updateMyProduct.mockResolvedValue({
      id: 'prod-1',
      name: 'Orange Juice',
      price: '550',
      image: 'https://example.com/orange-juice.png',
      tag: 'Fresh',
      description: 'Freshly squeezed orange juice.',
    });

    const response = await request(app)
      .patch('/v1/products/prod-1')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .send({
        price: '550',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.price).toBe('550');
    expect(mockedProductService.updateMyProduct).toHaveBeenCalledWith('user_123', 'prod-1', {
      price: '550',
    });
  });

  it('deletes a product', async () => {
    mockedProductService.deleteMyProduct.mockResolvedValue(undefined);

    const response = await request(app)
      .delete('/v1/products/prod-1')
      .set('Authorization', `Bearer ${getAccessToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.message).toBe('Product deleted');
    expect(mockedProductService.deleteMyProduct).toHaveBeenCalledWith('user_123', 'prod-1');
  });

  it.each([
    ['POST', '/v1/products'],
    ['PATCH', '/v1/products/prod-1'],
    ['DELETE', '/v1/products/prod-1'],
  ])('requires access token for restricted product action %s %s', async (method, path) => {
    const response = await request(app)[method.toLowerCase() as 'post' | 'patch' | 'delete'](path).send({
      name: 'Orange Juice',
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('UNAUTHORIZED');
  });

  it('returns repo-standard validation errors for invalid product payloads', async () => {
    const response = await request(app)
      .post('/v1/products')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .send({
        name: '',
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('VALIDATION_ERROR');
    expect(response.body.message).toBe('Request validation failed');
    expect(response.body.details).toBeTruthy();
  });

  it('validates store id when listing store products', async () => {
    const response = await request(app).get('/v1/products/store/0');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('VALIDATION_ERROR');
  });
});
