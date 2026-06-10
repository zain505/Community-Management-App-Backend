import { z } from 'zod';

const mobileNumberSchema = z
  .string()
  .trim()
  .regex(
    /^(?:\+?[1-9]\d{7,14}|03\d{9})$/,
    'Mobile phone number must be in international format or local format like 03074029959',
  );
const nameSchema = z.string().trim().min(2).max(80);
const passwordSchema = z.string().min(8).max(128);
const currentPasswordSchema = z.string().min(4).max(128);
const reservedAdminNamePattern = /\b(?:super\s+admin|admin)\b/i;
const assignableUserTypeSchema = z.union([z.literal(1), z.literal(2)]);
const isActiveSchema = z.union([z.boolean(), z.literal(0), z.literal(1)]).transform((value) => value === true || value === 1);

export const registerBodySchema = z.object({
  name: nameSchema,
  mobileNumber: mobileNumberSchema,
  password: passwordSchema,
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
  password: currentPasswordSchema,
});

export const refreshBodySchema = z.object({
  refreshToken: z.string().min(10),
});

export const logoutBodySchema = z.object({
  refreshToken: z.string().min(10),
});

export const updateUserActivationBodySchema = z.object({
  isActive: isActiveSchema,
});

export const updateUserTypeBodySchema = z.object({
  usertype: assignableUserTypeSchema,
});

export const updateUserNameBodySchema = z.object({
  name: nameSchema,
});

export const changePasswordBodySchema = z
  .object({
    currentPassword: currentPasswordSchema,
    newPassword: passwordSchema,
  })
  .superRefine((value, ctx) => {
    if (value.currentPassword === value.newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['newPassword'],
        message: 'New password must be different from current password',
      });
    }
  });

export const adminResetUserPasswordBodySchema = z.object({
  mobileNumber: mobileNumberSchema,
  newPassword: passwordSchema,
});

export const userIdParamSchema = z.object({
  id: z.string().trim().min(1).max(64),
});

export const userIdsQuerySchema = z.object({
  ids: z
    .string()
    .trim()
    .min(1)
    .transform((value, ctx) => {
      const ids = value
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean);

      if (ids.length === 0 || ids.some((id) => id.length === 0 || id.length > 64)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'ids must be a comma-separated list of user ids',
        });

        return z.NEVER;
      }

      return [...new Set(ids)];
    }),
});
