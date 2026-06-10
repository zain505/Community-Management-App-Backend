import { z } from 'zod';

const mobileNumberSchema = z
  .string()
  .trim()
  .regex(/^\+?[1-9]\d{7,14}$/, 'Mobile phone number must be in international format');
const reservedAdminNamePattern = /\b(?:super\s+admin|admin)\b/i;

export const registerBodySchema = z.object({
  name: z.string().trim().min(2).max(80),
  mobileNumber: mobileNumberSchema,
  password: z.string().min(8).max(128),
}).superRefine((value, ctx) => {
  const normalizedName = value.name.trim().replace(/\s+/g, ' ');

  if (reservedAdminNamePattern.test(normalizedName)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['name'],
      message: 'Normal users cannot use reserved admin words in their name',
    });
  }
});

export const loginBodySchema = z.object({
  mobileNumber: mobileNumberSchema,
  password: z.string().min(8).max(128),
});

export const refreshBodySchema = z.object({
  refreshToken: z.string().min(10),
});

export const logoutBodySchema = z.object({
  refreshToken: z.string().min(10),
});
