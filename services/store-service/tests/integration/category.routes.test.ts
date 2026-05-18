jest.mock('../../src/modules/store/category.service', () => ({
  categoryService: {
    createCategory: jest.fn(),
    deleteCategory: jest.fn(),
    getCategoryById: jest.fn(),
    listCategories: jest.fn(),
    updateCategory: jest.fn(),
  },
}));

import request from 'supertest';
import { app } from '../../src/app';
import { signAccessToken } from '../../src/lib/token';
import { categoryService } from '../../src/modules/store/category.service';

const mockedCategoryService = jest.mocked(categoryService);

function getAccessToken(): string {
  return signAccessToken({
    sub: 'user_123',
  });
}

describe('category routes', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('lists categories publicly', async () => {
    mockedCategoryService.listCategories.mockResolvedValue([
      {
        id: 3,
        name: 'Groceries',
      },
    ]);

    const response = await request(app).get('/v1/stores/categories');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual([
      {
        id: 3,
        name: 'Groceries',
      },
    ]);
    expect(mockedCategoryService.listCategories).toHaveBeenCalledTimes(1);
  });

  it('gets a category by id', async () => {
    mockedCategoryService.getCategoryById.mockResolvedValue({
      id: 4,
      name: 'Pharmacy',
    });

    const response = await request(app).get('/v1/stores/categories/4');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual({
      id: 4,
      name: 'Pharmacy',
    });
    expect(mockedCategoryService.getCategoryById).toHaveBeenCalledWith(4);
  });

  it('creates a category for an authenticated user', async () => {
    mockedCategoryService.createCategory.mockResolvedValue({
      id: 5,
      name: 'Bakery',
    });

    const response = await request(app)
      .post('/v1/stores/categories')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .send({
        name: 'Bakery',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual({
      id: 5,
      name: 'Bakery',
    });
    expect(mockedCategoryService.createCategory).toHaveBeenCalledWith('user_123', {
      name: 'Bakery',
    });
  });

  it('updates a category for an authenticated user', async () => {
    mockedCategoryService.updateCategory.mockResolvedValue({
      id: 5,
      name: 'Fresh Bakery',
    });

    const response = await request(app)
      .patch('/v1/stores/categories/5')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .send({
        name: 'Fresh Bakery',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual({
      id: 5,
      name: 'Fresh Bakery',
    });
    expect(mockedCategoryService.updateCategory).toHaveBeenCalledWith('user_123', 5, {
      name: 'Fresh Bakery',
    });
  });

  it('deletes a category for an authenticated user', async () => {
    mockedCategoryService.deleteCategory.mockResolvedValue(undefined);

    const response = await request(app)
      .delete('/v1/stores/categories/5')
      .set('Authorization', `Bearer ${getAccessToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual({
      message: 'Category deleted',
    });
    expect(mockedCategoryService.deleteCategory).toHaveBeenCalledWith('user_123', 5);
  });

  it('requires authentication before category creation', async () => {
    const response = await request(app).post('/v1/stores/categories').send({
      name: 'Bakery',
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('UNAUTHORIZED');
  });
});
