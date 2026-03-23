import type {
  CreateProductRequest,
  ProductListQuery,
  UpdateProductRequest,
} from '@community/contracts';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendSuccess } from '../../lib/http';
import { AppError } from '../../shared/app-error';
import { productService } from './product.service';

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

function getProductId(req: Request): string {
  return (req.params as { id: string }).id;
}

function getStoreId(req: Request): number {
  return Number((req.params as { storeId: string }).storeId);
}

export async function listMyProducts(req: Request, res: Response): Promise<void> {
  const query = req.query as ProductListQuery;
  const products = await productService.listMyProducts(getAuthenticatedUserId(req), query.search, query.page);
  sendSuccess(res, StatusCodes.OK, products);
}

export async function listStoreProducts(req: Request, res: Response): Promise<void> {
  const query = req.query as ProductListQuery;
  const products = await productService.listProductsByStoreId(getStoreId(req), query.search, query.page);
  sendSuccess(res, StatusCodes.OK, products);
}

export async function getMyProduct(req: Request, res: Response): Promise<void> {
  const product = await productService.getMyProduct(getAuthenticatedUserId(req), getProductId(req));
  sendSuccess(res, StatusCodes.OK, product);
}

export async function createMyProduct(req: Request, res: Response): Promise<void> {
  const product = await productService.createMyProduct(
    getAuthenticatedUserId(req),
    req.body as CreateProductRequest,
  );
  sendSuccess(res, StatusCodes.CREATED, product);
}

export async function updateMyProduct(req: Request, res: Response): Promise<void> {
  const product = await productService.updateMyProduct(
    getAuthenticatedUserId(req),
    getProductId(req),
    req.body as UpdateProductRequest,
  );
  sendSuccess(res, StatusCodes.OK, product);
}

export async function deleteMyProduct(req: Request, res: Response): Promise<void> {
  await productService.deleteMyProduct(getAuthenticatedUserId(req), getProductId(req));
  sendSuccess(res, StatusCodes.OK, {
    message: 'Product deleted',
  });
}
