import {
  createProductBodySchema,
  listProductsQuerySchema,
  updateProductBodySchema,
} from '../../src/modules/product/product.schemas';

describe('product schemas', () => {
  it('accepts a valid product payload', () => {
    const payload = createProductBodySchema.parse({
      id: 'prod-1',
      name: 'Fresh Sada Naan',
      price: 'Rs.30',
      image: 'https://snappy.pk/wp-content/uploads/2025/07/Snappy-ka-Sada-Naan.webp',
      tag: 'Popular',
      description: 'Freshly baked naan served hot.',
    });

    expect(payload.id).toBe('prod-1');
    expect(payload.name).toBe('Fresh Sada Naan');
    expect(payload.description).toBe('Freshly baked naan served hot.');
  });

  it('accepts a product image as a base64 data URI', () => {
    const payload = createProductBodySchema.parse({
      name: 'Fresh Sada Naan',
      price: 'Rs.30',
      image: 'data:image/png;base64,aGVsbG8=',
      tag: 'Popular',
      description: 'Freshly baked naan served hot.',
    });

    expect(payload.image).toBe('data:image/png;base64,aGVsbG8=');
  });

  it('rejects empty update payload', () => {
    const result = updateProductBodySchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('defaults product list page to 1', () => {
    const query = listProductsQuerySchema.parse({});
    expect(query.page).toBe(1);
  });

  it('rejects non-positive product list page', () => {
    const result = listProductsQuerySchema.safeParse({
      page: 0,
    });
    expect(result.success).toBe(false);
  });

  it('rejects product descriptions longer than 100 characters', () => {
    const result = createProductBodySchema.safeParse({
      name: 'Fresh Sada Naan',
      price: 'Rs.30',
      image: 'https://snappy.pk/wp-content/uploads/2025/07/Snappy-ka-Sada-Naan.webp',
      description: 'x'.repeat(101),
    });

    expect(result.success).toBe(false);
  });
});
