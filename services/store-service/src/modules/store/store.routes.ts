import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth';
import { asyncHandler } from '../../shared/async-handler';
import { validate } from '../../middleware/validate';
import {
  createMyStore,
  deleteMyStore,
  favoriteStore,
  getMyStore,
  getMyStoreProducts,
  listFavoriteStores,
  listStores,
  listStoresForAdmin,
  rateStore,
  unfavoriteStore,
  updateStoreActivation,
  updateMyStore,
} from './store.controller';
import {
  createStoreBodySchema,
  createStoreRatingBodySchema,
  listStoresForAdminQuerySchema,
  listStoresQuerySchema,
  storeIdParamSchema,
  updateStoreActivationBodySchema,
  updateStoreBodySchema,
} from './store.schemas';

const storeRouter = Router();

storeRouter.get('/', validate({ query: listStoresQuerySchema }), asyncHandler(listStores));
storeRouter.get(
  '/favorites',
  requireAuth,
  validate({ query: listStoresQuerySchema }),
  asyncHandler(listFavoriteStores),
);
storeRouter.get(
  '/admin',
  requireAuth,
  validate({ query: listStoresForAdminQuerySchema }),
  asyncHandler(listStoresForAdmin),
);
storeRouter.get('/me', requireAuth, asyncHandler(getMyStore));
storeRouter.get('/me/products', requireAuth, asyncHandler(getMyStoreProducts));
storeRouter.post(
  '/',
  requireAuth,
  validate({ body: createStoreBodySchema }),
  asyncHandler(createMyStore),
);
storeRouter.patch(
  '/me',
  requireAuth,
  validate({ body: updateStoreBodySchema }),
  asyncHandler(updateMyStore),
);
storeRouter.patch(
  '/:storeId/status',
  requireAuth,
  validate({ params: storeIdParamSchema, body: updateStoreActivationBodySchema }),
  asyncHandler(updateStoreActivation),
);
storeRouter.post(
  '/:storeId/favorite',
  requireAuth,
  validate({ params: storeIdParamSchema }),
  asyncHandler(favoriteStore),
);
storeRouter.delete(
  '/:storeId/favorite',
  requireAuth,
  validate({ params: storeIdParamSchema }),
  asyncHandler(unfavoriteStore),
);
storeRouter.post(
  '/:storeId/ratings',
  requireAuth,
  validate({ params: storeIdParamSchema, body: createStoreRatingBodySchema }),
  asyncHandler(rateStore),
);
storeRouter.delete('/me', requireAuth, asyncHandler(deleteMyStore));

export { storeRouter };
