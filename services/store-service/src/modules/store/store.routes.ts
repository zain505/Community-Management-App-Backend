import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth';
import { asyncHandler } from '../../shared/async-handler';
import { validate } from '../../middleware/validate';
import {
  createMyStore,
  deleteMyStore,
  getMyStore,
  getMyStoreProducts,
  listStores,
  rateStore,
  updateMyStore,
} from './store.controller';
import {
  createStoreBodySchema,
  createStoreRatingBodySchema,
  listStoresQuerySchema,
  storeIdParamSchema,
  updateStoreBodySchema,
} from './store.schemas';

const storeRouter = Router();

storeRouter.get('/', validate({ query: listStoresQuerySchema }), asyncHandler(listStores));
storeRouter.get('/me', requireAuth, asyncHandler(getMyStore));
storeRouter.get('/me/products', requireAuth, asyncHandler(getMyStoreProducts));
storeRouter.post('/', requireAuth, validate({ body: createStoreBodySchema }), asyncHandler(createMyStore));
storeRouter.patch('/me', requireAuth, validate({ body: updateStoreBodySchema }), asyncHandler(updateMyStore));
storeRouter.post(
  '/:storeId/ratings',
  requireAuth,
  validate({ params: storeIdParamSchema, body: createStoreRatingBodySchema }),
  asyncHandler(rateStore),
);
storeRouter.delete('/me', requireAuth, asyncHandler(deleteMyStore));

export { storeRouter };
