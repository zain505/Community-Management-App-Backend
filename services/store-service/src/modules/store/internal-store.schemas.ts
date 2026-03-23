import { z } from 'zod';

export const storeIdParamSchema = z.object({
  storeId: z.coerce.number().int().positive(),
});
