jest.mock('../../src/modules/store/category.repository', () => ({
  categoryRepository: {
    create: jest.fn(),
    deleteById: jest.fn(),
    findById: jest.fn(),
    findByIdWithStoreCount: jest.fn(),
    list: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock('../../src/modules/auth/auth-client', () => ({
  authClient: {
    getManagedUserStatus: jest.fn(),
  },
}));

jest.mock('../../src/modules/store/store.cache', () => ({
  invalidateStoreListCache: jest.fn(),
  readStoreListCache: jest.fn(),
  shouldSyncMostSearchedMetric: jest.fn(),
  writeStoreListCache: jest.fn(),
}));

import { authClient } from '../../src/modules/auth/auth-client';
import { categoryRepository } from '../../src/modules/store/category.repository';
import { categoryService } from '../../src/modules/store/category.service';
import * as storeCache from '../../src/modules/store/store.cache';

const mockedAuthClient = jest.mocked(authClient);
const mockedCategoryRepository = jest.mocked(categoryRepository);
const mockedStoreCache = jest.mocked(storeCache);

function buildManagedUserStatus(overrides: Record<string, unknown> = {}) {
  return {
    id: 'super-123',
    mobileNumber: '+923000000001',
    name: 'Super Admin',
    usertype: 0,
    profile: {
      image: null,
    },
    isActive: true,
    createdAt: '2026-03-15T09:00:00.000Z',
    ...overrides,
  } as never;
}

describe('category service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockedStoreCache.invalidateStoreListCache.mockResolvedValue(undefined);
  });

  it('lists categories', async () => {
    mockedCategoryRepository.list.mockResolvedValue([
      {
        id: 3,
        name: 'Groceries',
      },
      {
        id: 4,
        name: 'Pharmacy',
      },
    ] as never);

    const categories = await categoryService.listCategories();

    expect(categories).toEqual([
      {
        id: 3,
        name: 'Groceries',
      },
      {
        id: 4,
        name: 'Pharmacy',
      },
    ]);
  });

  it('gets a category by id', async () => {
    mockedCategoryRepository.findById.mockResolvedValue({
      id: 4,
      name: 'Pharmacy',
    } as never);

    const category = await categoryService.getCategoryById(4);

    expect(category).toEqual({
      id: 4,
      name: 'Pharmacy',
    });
  });

  it('rejects reads for missing categories', async () => {
    mockedCategoryRepository.findById.mockResolvedValue(null);

    await expect(categoryService.getCategoryById(99)).rejects.toMatchObject({
      code: 'CATEGORY_NOT_FOUND',
      statusCode: 404,
    });
  });

  it('allows active super admins to create categories', async () => {
    mockedAuthClient.getManagedUserStatus.mockResolvedValue(buildManagedUserStatus());
    mockedCategoryRepository.create.mockResolvedValue({
      id: 8,
      name: 'Fresh Grocery',
    } as never);

    const category = await categoryService.createCategory('super-123', {
      name: '  Fresh   Grocery  ',
    });

    expect(mockedCategoryRepository.create).toHaveBeenCalledWith('Fresh Grocery');
    expect(mockedStoreCache.invalidateStoreListCache).toHaveBeenCalled();
    expect(category).toEqual({
      id: 8,
      name: 'Fresh Grocery',
    });
  });

  it('rejects category creation from non-super-admin users', async () => {
    mockedAuthClient.getManagedUserStatus.mockResolvedValue(
      buildManagedUserStatus({
        id: 'admin-123',
        usertype: 1,
        name: 'Community Admin',
      }),
    );

    await expect(
      categoryService.createCategory('admin-123', {
        name: 'Bakery',
      }),
    ).rejects.toMatchObject({
      code: 'SUPER_ADMIN_REQUIRED',
      statusCode: 403,
    });

    expect(mockedCategoryRepository.create).not.toHaveBeenCalled();
  });

  it('allows active super admins to update categories', async () => {
    mockedAuthClient.getManagedUserStatus.mockResolvedValue(buildManagedUserStatus());
    mockedCategoryRepository.findById.mockResolvedValue({
      id: 5,
      name: 'Bakery',
    } as never);
    mockedCategoryRepository.update.mockResolvedValue({
      id: 5,
      name: 'Fresh Bakery',
    } as never);

    const category = await categoryService.updateCategory('super-123', 5, {
      name: '  Fresh   Bakery ',
    });

    expect(mockedCategoryRepository.update).toHaveBeenCalledWith(5, 'Fresh Bakery');
    expect(mockedStoreCache.invalidateStoreListCache).toHaveBeenCalled();
    expect(category).toEqual({
      id: 5,
      name: 'Fresh Bakery',
    });
  });

  it('rejects category updates for missing categories', async () => {
    mockedAuthClient.getManagedUserStatus.mockResolvedValue(buildManagedUserStatus());
    mockedCategoryRepository.findById.mockResolvedValue(null);

    await expect(
      categoryService.updateCategory('super-123', 77, {
        name: 'Updated',
      }),
    ).rejects.toMatchObject({
      code: 'CATEGORY_NOT_FOUND',
      statusCode: 404,
    });

    expect(mockedCategoryRepository.update).not.toHaveBeenCalled();
  });

  it('rejects deleting categories that still have stores', async () => {
    mockedAuthClient.getManagedUserStatus.mockResolvedValue(buildManagedUserStatus());
    mockedCategoryRepository.findByIdWithStoreCount.mockResolvedValue({
      id: 6,
      name: 'Pharmacy',
      _count: {
        stores: 2,
      },
    } as never);

    await expect(categoryService.deleteCategory('super-123', 6)).rejects.toMatchObject({
      code: 'CATEGORY_IN_USE',
      statusCode: 409,
    });

    expect(mockedCategoryRepository.deleteById).not.toHaveBeenCalled();
  });

  it('allows active super admins to delete empty categories', async () => {
    mockedAuthClient.getManagedUserStatus.mockResolvedValue(buildManagedUserStatus());
    mockedCategoryRepository.findByIdWithStoreCount.mockResolvedValue({
      id: 6,
      name: 'Pharmacy',
      _count: {
        stores: 0,
      },
    } as never);
    mockedCategoryRepository.deleteById.mockResolvedValue({} as never);

    await categoryService.deleteCategory('super-123', 6);

    expect(mockedCategoryRepository.deleteById).toHaveBeenCalledWith(6);
    expect(mockedStoreCache.invalidateStoreListCache).toHaveBeenCalled();
  });
});
