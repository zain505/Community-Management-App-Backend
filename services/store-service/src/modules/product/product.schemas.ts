import { z } from 'zod';
import { productImageSchema } from '../../shared/image-schema';

const productPayloadSchema = z.object({
  id: z.string().trim().min(1).max(64).optional(),
  name: z.string().trim().min(1).max(120),
  price: z.string().trim().min(1).max(40),
  image: productImageSchema,
  tag: z.string().trim().min(1).max(40).optional(),
  description: z.string().trim().min(1).max(100).optional(),
});

export const createProductBodySchema = productPayloadSchema;

export const updateProductBodySchema = productPayloadSchema
  .omit({ id: true })
  .partial()
  .refine((payload) => Object.keys(payload).length > 0, {
    message: 'At least one field is required',
  });

export const listProductsQuerySchema = z.object({
  search: z.string().trim().min(1).max(120).optional(),
  page: z.coerce.number().int().positive().default(1),
});

export const productIdParamSchema = z.object({
  id: z.string().trim().min(1).max(64),
});

export const storeIdParamSchema = z.object({
  storeId: z.coerce.number().int().positive(),
});
