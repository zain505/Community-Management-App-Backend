import { Router } from 'express';
import { asyncHandler } from '../../shared/async-handler';
import { validate } from '../../middleware/validate';
import {
  getMostSearchedStoreSnapshot,
  getStoreBasicSnapshot,
  getStoreSummary,
  listStoreRankingSnapshots,
} from './internal-store.controller';
import { storeIdParamSchema } from './internal-store.schemas';

const internalStoreRouter = Router();

internalStoreRouter.get('/ranking', asyncHandler(listStoreRankingSnapshots));
internalStoreRouter.get('/most-searched', asyncHandler(getMostSearchedStoreSnapshot));
internalStoreRouter.get(
  '/:storeId/basic',
  validate({ params: storeIdParamSchema }),
  asyncHandler(getStoreBasicSnapshot),
);
internalStoreRouter.get(
  '/:storeId/summary',
  validate({ params: storeIdParamSchema }),
  asyncHandler(getStoreSummary),
);

export { internalStoreRouter };
