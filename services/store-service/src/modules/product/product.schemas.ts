import { z } from 'zod';

const productPayloadSchema = z.object({
  id: z.string().trim().min(1).max(64).optional(),
  name: z.string().trim().min(1).max(120),
  price: z.string().trim().min(1).max(40),
  image: z.string().trim().url(),
  tag: z.string().trim().min(1).max(40).optional(),
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
