import { Router } from 'express';
import { asyncHandler } from '../../shared/async-handler';
import { validate } from '../../middleware/validate';
import {
  getMostSearchedStoreSnapshot,
  getStoreBasicSnapshot,
  getStoreSummary,
  listStoreSummaries,
  listStoreRankingSnapshots,
} from './internal-store.controller';
import { storeIdParamSchema, storeIdsQuerySchema } from './internal-store.schemas';

const internalStoreRouter = Router();

internalStoreRouter.get('/ranking', asyncHandler(listStoreRankingSnapshots));
internalStoreRouter.get('/most-searched', asyncHandler(getMostSearchedStoreSnapshot));
internalStoreRouter.get('/summaries', validate({ query: storeIdsQuerySchema }), asyncHandler(listStoreSummaries));
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
