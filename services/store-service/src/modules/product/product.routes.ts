import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth';
import { asyncHandler } from '../../shared/async-handler';
import { validate } from '../../middleware/validate';
import {
  createMyProduct,
  deleteMyProduct,
  getMyProduct,
  listMyProducts,
  listStoreProducts,
  updateMyProduct,
} from './product.controller';
import {
  createProductBodySchema,
  listProductsQuerySchema,
  productIdParamSchema,
  storeIdParamSchema,
  updateProductBodySchema,
} from './product.schemas';

const productRouter = Router();

productRouter.get('/', requireAuth, validate({ query: listProductsQuerySchema }), asyncHandler(listMyProducts));
productRouter.get(
  '/store/:storeId',
  validate({ params: storeIdParamSchema, query: listProductsQuerySchema }),
  asyncHandler(listStoreProducts),
);
productRouter.get('/:id', requireAuth, validate({ params: productIdParamSchema }), asyncHandler(getMyProduct));
productRouter.post('/', requireAuth, validate({ body: createProductBodySchema }), asyncHandler(createMyProduct));
productRouter.patch(
  '/:id',
  requireAuth,
  validate({ params: productIdParamSchema, body: updateProductBodySchema }),
  asyncHandler(updateMyProduct),
);
productRouter.delete(
  '/:id',
  requireAuth,
  validate({ params: productIdParamSchema }),
  asyncHandler(deleteMyProduct),
);

export { productRouter };
