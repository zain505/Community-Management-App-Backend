import { z } from 'zod';
import { base64ImageSchema, productImageSchema } from '../../shared/image-schema';

const phoneNumberSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/[\s()-]/g, ''))
  .refine((value) => /^\+?\d{8,15}$/.test(value), {
    message: 'Phone number must contain 8 to 15 digits and may start with +',
  });

const storeTimeSchema = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'Time must be in HH:mm format',
  });

const storeBadgeSchema = z.string().trim().min(1).max(40);
const activeStoreSchema = z
  .union([z.boolean(), z.literal(0), z.literal(1)])
  .transform((value) => value === true || value === 1);
const activeStoreQuerySchema = z.preprocess((value) => {
  if (value === true || value === 1 || value === 'true' || value === '1') {
    return true;
  }

  if (value === false || value === 0 || value === 'false' || value === '0') {
    return false;
  }

  return value;
}, z.boolean());
const searchQuerySchema = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : undefined;
}, z.string().min(1).max(120).optional());

const storeProductSchema = z.object({
  id: z.string().trim().min(1).max(64).optional(),
  name: z.string().trim().min(1).max(120),
  price: z.string().trim().min(1).max(40),
  image: productImageSchema,
  tag: z.string().trim().min(1).max(40).optional(),
  description: z.string().trim().min(1).max(100).optional(),
});

const storePayloadFields = {
  name: z.string().trim().min(2).max(120),
  location: z.string().trim().min(2).max(120),
  image: base64ImageSchema,
  delivery: z.string().trim().min(1).max(80),
  minOrderRs: z.string().trim().min(1).max(40),
  openingTime: storeTimeSchema,
  closingTime: storeTimeSchema,
  phoneNumber: phoneNumberSchema.optional(),
  contact: phoneNumberSchema.optional(),
  products: z.array(storeProductSchema).max(500).optional(),
};

function normalizeStorePayload<T extends { contact?: string; phoneNumber?: string }>(
  payload: T,
): Omit<T, 'contact'> & { phoneNumber?: string } {
  const { contact, phoneNumber, ...rest } = payload;

  return {
    ...rest,
    ...(phoneNumber !== undefined || contact !== undefined
      ? { phoneNumber: phoneNumber ?? contact }
      : {}),
  } as Omit<T, 'contact'> & { phoneNumber?: string };
}

const storePayloadSchema = z.object(storePayloadFields).strict();

export const createStoreBodySchema = storePayloadSchema
  .refine(
    (payload) => typeof payload.phoneNumber === 'string' || typeof payload.contact === 'string',
    {
      message: 'Phone number is required',
      path: ['phoneNumber'],
    },
  )
  .transform(normalizeStorePayload);

export const updateStoreBodySchema = storePayloadSchema
  .partial()
  .refine((payload) => Object.keys(payload).length > 0, {
    message: 'At least one field is required',
  })
  .transform(normalizeStorePayload);

export const createStoreRatingBodySchema = z.object({
  rating: z.coerce.number().gt(0).lte(5),
  badges: z.array(storeBadgeSchema).max(20).optional(),
  description: z.string().trim().min(1).max(100).optional(),
});

export const updateStoreActivationBodySchema = z.object({
  active: activeStoreSchema,
});

export const storeIdParamSchema = z.object({
  storeId: z.coerce.number().int().positive(),
});

export const listStoresQuerySchema = z.object({
  search: searchQuerySchema,
  page: z.coerce.number().int().positive().default(1),
});

export const listStoresForAdminQuerySchema = listStoresQuerySchema.extend({
  active: activeStoreQuerySchema.optional(),
});
