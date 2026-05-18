import type {
  CreateStoreCategoryRequest,
  StoreCategory,
  UpdateStoreCategoryRequest,
} from '@community/contracts';
import { Prisma } from '../../generated/prisma';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../shared/app-error';
import { authClient } from '../auth/auth-client';
import { invalidateStoreListCache } from './store.cache';
import { categoryRepository, type StoreCategoryRecord } from './category.repository';

function normalizeCategoryName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

function toStoreCategory(category: StoreCategoryRecord): StoreCategory {
  return {
    id: category.id,
    name: category.name,
  };
}

function throwCategoryNotFound(): never {
  throw new AppError('Category not found', {
    statusCode: StatusCodes.NOT_FOUND,
    code: 'CATEGORY_NOT_FOUND',
  });
}

async function ensureActiveSuperAdmin(requesterId: string, action: string): Promise<void> {
  const requester = await authClient.getManagedUserStatus(requesterId);

  if (!requester || !requester.isActive || requester.usertype !== 0) {
    throw new AppError(`Only active super admins can ${action}`, {
      statusCode: StatusCodes.FORBIDDEN,
      code: 'SUPER_ADMIN_REQUIRED',
    });
  }
}

function handleCategoryPrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    throw new AppError('Category name is already in use', {
      statusCode: StatusCodes.CONFLICT,
      code: 'CATEGORY_ALREADY_EXISTS',
    });
  }

  throw error;
}

export const categoryService = {
  async listCategories(): Promise<StoreCategory[]> {
    const categories = await categoryRepository.list();
    return categories.map(toStoreCategory);
  },

  async getCategoryById(categoryId: number): Promise<StoreCategory> {
    const category = await categoryRepository.findById(categoryId);

    if (!category) {
      throwCategoryNotFound();
    }

    return toStoreCategory(category);
  },

  async createCategory(
    requesterId: string,
    payload: CreateStoreCategoryRequest,
  ): Promise<StoreCategory> {
    await ensureActiveSuperAdmin(requesterId, 'create categories');

    try {
      const category = await categoryRepository.create(normalizeCategoryName(payload.name));
      await invalidateStoreListCache();
      return toStoreCategory(category);
    } catch (error) {
      handleCategoryPrismaError(error);
    }
  },

  async updateCategory(
    requesterId: string,
    categoryId: number,
    payload: UpdateStoreCategoryRequest,
  ): Promise<StoreCategory> {
    await ensureActiveSuperAdmin(requesterId, 'update categories');

    const existingCategory = await categoryRepository.findById(categoryId);

    if (!existingCategory) {
      throwCategoryNotFound();
    }

    try {
      const category = await categoryRepository.update(categoryId, normalizeCategoryName(payload.name));
      await invalidateStoreListCache();
      return toStoreCategory(category);
    } catch (error) {
      handleCategoryPrismaError(error);
    }
  },

  async deleteCategory(requesterId: string, categoryId: number): Promise<void> {
    await ensureActiveSuperAdmin(requesterId, 'delete categories');

    const category = await categoryRepository.findByIdWithStoreCount(categoryId);

    if (!category) {
      throwCategoryNotFound();
    }

    if (category._count.stores > 0) {
      throw new AppError('Category cannot be deleted while stores are assigned to it', {
        statusCode: StatusCodes.CONFLICT,
        code: 'CATEGORY_IN_USE',
      });
    }

    await categoryRepository.deleteById(categoryId);
    await invalidateStoreListCache();
  },
};
