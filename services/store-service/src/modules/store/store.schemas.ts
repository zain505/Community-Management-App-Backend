import { z } from 'zod';

const base64Pattern = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

function isBase64Image(value: string): boolean {
  const trimmedValue = value.trim();
  const dataUriMatch = trimmedValue.match(/^data:image\/[a-zA-Z0-9.+-]+;base64,(.+)$/);
  const base64Value = dataUriMatch ? dataUriMatch[1] : trimmedValue;

  return base64Value.length >= 8 && base64Pattern.test(base64Value);
}

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

const base64ImageSchema = z
  .string()
  .trim()
  .refine(isBase64Image, {
    message: 'Image must be a base64 string or data URI',
  });

const storeProductSchema = z.object({
  id: z.string().trim().min(1).max(64).optional(),
  name: z.string().trim().min(1).max(120),
  price: z.string().trim().min(1).max(40),
  image: z.string().trim().url(),
  tag: z.string().trim().min(1).max(40).optional(),
});

const storePayloadFields = {
  name: z.string().trim().min(2).max(120),
  location: z.string().trim().min(2).max(120),
  image: base64ImageSchema,
  badges: z.array(z.string().trim().min(1).max(40)).max(20).optional(),
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

const storePayloadSchema = z.object(storePayloadFields);

export const createStoreBodySchema = storePayloadSchema.refine(
  (payload) => typeof payload.phoneNumber === 'string' || typeof payload.contact === 'string',
  {
    message: 'Phone number is required',
    path: ['phoneNumber'],
  },
).transform(normalizeStorePayload);

export const updateStoreBodySchema = storePayloadSchema
  .partial()
  .refine((payload) => Object.keys(payload).length > 0, {
    message: 'At least one field is required',
  })
  .transform(normalizeStorePayload);

export const createStoreRatingBodySchema = z.object({
  rating: z.coerce.number().gt(0).lte(5),
});

export const storeIdParamSchema = z.object({
  storeId: z.coerce.number().int().positive(),
});

export const listStoresQuerySchema = z.object({
  search: z.string().trim().min(1).max(120).optional(),
  page: z.coerce.number().int().positive().default(1),
});
