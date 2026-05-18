import { z } from 'zod';

const categoryNameSchema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .transform((value) => value.replace(/\s+/g, ' '));

export const createCategoryBodySchema = z.object({
  name: categoryNameSchema,
});

export const updateCategoryBodySchema = z.object({
  name: categoryNameSchema,
});

export const categoryIdParamSchema = z.object({
  categoryId: z.coerce.number().int().positive(),
});
