import { z } from 'zod';

export const storeIdParamSchema = z.object({
  storeId: z.coerce.number().int().positive(),
});

export const storeIdsQuerySchema = z.object({
  ids: z
    .string()
    .trim()
    .min(1)
    .transform((value, ctx) => {
      const ids = value
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) => Number(part));

      if (ids.length === 0 || ids.some((id) => !Number.isInteger(id) || id <= 0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'ids must be a comma-separated list of positive integers',
        });

        return z.NEVER;
      }

      return [...new Set(ids)];
    }),
});
