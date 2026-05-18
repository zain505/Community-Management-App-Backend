import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth';
import { asyncHandler } from '../../shared/async-handler';
import { validate } from '../../middleware/validate';
import {
  createCategory,
  deleteCategory,
  getCategory,
  listCategories,
  updateCategory,
} from './category.controller';
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
  categoryIdParamSchema,
  createCategoryBodySchema,
  updateCategoryBodySchema,
} from './category.schemas';
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

storeRouter.get('/categories', asyncHandler(listCategories));
storeRouter.get(
  '/categories/:categoryId',
  validate({ params: categoryIdParamSchema }),
  asyncHandler(getCategory),
);
storeRouter.post(
  '/categories',
  requireAuth,
  validate({ body: createCategoryBodySchema }),
  asyncHandler(createCategory),
);
storeRouter.patch(
  '/categories/:categoryId',
  requireAuth,
  validate({ params: categoryIdParamSchema, body: updateCategoryBodySchema }),
  asyncHandler(updateCategory),
);
storeRouter.delete(
  '/categories/:categoryId',
  requireAuth,
  validate({ params: categoryIdParamSchema }),
  asyncHandler(deleteCategory),
);
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
