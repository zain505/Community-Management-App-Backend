import type {
  CreateStoreCategoryRequest,
  UpdateStoreCategoryRequest,
} from '@community/contracts';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendSuccess } from '../../lib/http';
import { AppError } from '../../shared/app-error';
import { categoryService } from './category.service';

function getAuthenticatedUserId(req: Request): string {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('Access token is required', {
      statusCode: StatusCodes.UNAUTHORIZED,
      code: 'UNAUTHORIZED',
    });
  }

  return userId;
}

function getCategoryId(req: Request): number {
  return Number((req.params as { categoryId: string }).categoryId);
}

export async function listCategories(_req: Request, res: Response): Promise<void> {
  const categories = await categoryService.listCategories();
  sendSuccess(res, StatusCodes.OK, categories);
}

export async function getCategory(req: Request, res: Response): Promise<void> {
  const category = await categoryService.getCategoryById(getCategoryId(req));
  sendSuccess(res, StatusCodes.OK, category);
}

export async function createCategory(req: Request, res: Response): Promise<void> {
  const category = await categoryService.createCategory(
    getAuthenticatedUserId(req),
    req.body as CreateStoreCategoryRequest,
  );
  sendSuccess(res, StatusCodes.CREATED, category);
}

export async function updateCategory(req: Request, res: Response): Promise<void> {
  const category = await categoryService.updateCategory(
    getAuthenticatedUserId(req),
    getCategoryId(req),
    req.body as UpdateStoreCategoryRequest,
  );
  sendSuccess(res, StatusCodes.OK, category);
}

export async function deleteCategory(req: Request, res: Response): Promise<void> {
  await categoryService.deleteCategory(getAuthenticatedUserId(req), getCategoryId(req));
  sendSuccess(res, StatusCodes.OK, {
    message: 'Category deleted',
  });
}
