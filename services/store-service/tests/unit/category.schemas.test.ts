import {
  categoryIdParamSchema,
  createCategoryBodySchema,
  updateCategoryBodySchema,
} from '../../src/modules/store/category.schemas';

describe('category schemas', () => {
  it('normalizes category names on create', () => {
    const payload = createCategoryBodySchema.parse({
      name: '  Grocery   Stores  ',
    });

    expect(payload.name).toBe('Grocery Stores');
  });

  it('rejects empty category names', () => {
    const result = createCategoryBodySchema.safeParse({
      name: '   ',
    });

    expect(result.success).toBe(false);
  });

  it('accepts valid category updates', () => {
    const payload = updateCategoryBodySchema.parse({
      name: 'Fresh Produce',
    });

    expect(payload.name).toBe('Fresh Produce');
  });

  it('coerces valid category ids from route params', () => {
    const params = categoryIdParamSchema.parse({
      categoryId: '12',
    });

    expect(params.categoryId).toBe(12);
  });

  it('rejects non-positive category ids', () => {
    const result = categoryIdParamSchema.safeParse({
      categoryId: '0',
    });

    expect(result.success).toBe(false);
  });
});
