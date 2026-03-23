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
    });

    expect(payload.id).toBe('prod-1');
    expect(payload.name).toBe('Fresh Sada Naan');
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
});
