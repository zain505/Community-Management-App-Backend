import type {
  CreateStoreRequest,
  CreateStoreRatingRequest,
  StoreListQuery,
  UpdateStoreRequest,
} from '@community/contracts';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendSuccess } from '../../lib/http';
import { AppError } from '../../shared/app-error';
import { storeService } from './store.service';

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

function getStoreId(req: Request): number {
  return Number((req.params as { storeId: string }).storeId);
}

export async function listStores(req: Request, res: Response): Promise<void> {
  const query = req.query as StoreListQuery;
  const stores = await storeService.listStores(query.search, query.page);
  sendSuccess(res, StatusCodes.OK, stores);
}

export async function getMyStore(req: Request, res: Response): Promise<void> {
  const store = await storeService.getMyStore(getAuthenticatedUserId(req));
  sendSuccess(res, StatusCodes.OK, store);
}

export async function getMyStoreProducts(req: Request, res: Response): Promise<void> {
  const products = await storeService.getMyStoreProducts(getAuthenticatedUserId(req));
  sendSuccess(res, StatusCodes.OK, products);
}

export async function createMyStore(req: Request, res: Response): Promise<void> {
  const store = await storeService.createMyStore(
    getAuthenticatedUserId(req),
    req.body as CreateStoreRequest,
  );
  sendSuccess(res, StatusCodes.CREATED, store);
}

export async function updateMyStore(req: Request, res: Response): Promise<void> {
  const store = await storeService.updateMyStore(
    getAuthenticatedUserId(req),
    req.body as UpdateStoreRequest,
  );
  sendSuccess(res, StatusCodes.OK, store);
}

export async function rateStore(req: Request, res: Response): Promise<void> {
  const store = await storeService.rateStore(
    getAuthenticatedUserId(req),
    getStoreId(req),
    req.body as CreateStoreRatingRequest,
  );
  sendSuccess(res, StatusCodes.CREATED, store);
}

export async function deleteMyStore(req: Request, res: Response): Promise<void> {
  await storeService.deleteMyStore(getAuthenticatedUserId(req));
  sendSuccess(res, StatusCodes.OK, {
    message: 'Store deleted',
  });
}
