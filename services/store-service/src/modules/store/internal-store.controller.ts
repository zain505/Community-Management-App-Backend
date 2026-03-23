import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendSuccess } from '../../lib/http';
import { storeService } from './store.service';

export async function listStoreRankingSnapshots(_req: Request, res: Response): Promise<void> {
  const stores = await storeService.listStoresForPopularityRanking();
  sendSuccess(res, StatusCodes.OK, stores);
}

export async function getStoreBasicSnapshot(req: Request, res: Response): Promise<void> {
  const store = await storeService.findStoreBasicById(Number(req.params.storeId));
  sendSuccess(res, StatusCodes.OK, store);
}

export async function getStoreSummary(req: Request, res: Response): Promise<void> {
  const store = await storeService.findStoreSummaryById(Number(req.params.storeId));
  sendSuccess(res, StatusCodes.OK, store);
}

export async function getMostSearchedStoreSnapshot(_req: Request, res: Response): Promise<void> {
  const store = await storeService.findMostSearchedStore();
  sendSuccess(res, StatusCodes.OK, store);
}
