import { z } from 'zod';

const mobileNumberSchema = z
  .string()
  .trim()
  .regex(/^\+?[1-9]\d{7,14}$/, 'Mobile phone number must be in international format');

export const registerBodySchema = z.object({
  name: z.string().trim().min(2).max(80),
  mobileNumber: mobileNumberSchema,
  password: z.string().min(8).max(128),
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
