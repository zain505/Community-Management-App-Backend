import { z } from 'zod';

const isoDateTimeSchema = z.string().trim().min(1).refine((value) => !Number.isNaN(Date.parse(value)), {
  message: 'Invalid datetime',
});

function hasValidTimeRange(startAt: string, endAt?: string | null): boolean {
  if (!endAt) {
    return true;
  }

  return Date.parse(endAt) >= Date.parse(startAt);
}

const eventManagementPayloadSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(5_000),
  location: z.string().trim().min(1).max(255),
  startAt: isoDateTimeSchema,
  endAt: isoDateTimeSchema.nullable().optional(),
});

export const createEventManagementBodySchema = eventManagementPayloadSchema.superRefine((payload, ctx) => {
  if (!hasValidTimeRange(payload.startAt, payload.endAt)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['endAt'],
      message: 'End time must be after the start time',
    });
  }
});

export const updateEventManagementBodySchema = eventManagementPayloadSchema
  .partial()
  .refine((payload) => Object.keys(payload).length > 0, {
    message: 'At least one field is required',
  })
  .superRefine((payload, ctx) => {
    if (payload.startAt === undefined || payload.endAt === undefined || payload.endAt === null) {
      return;
    }

    if (!hasValidTimeRange(payload.startAt, payload.endAt)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endAt'],
        message: 'End time must be after the start time',
      });
    }
  });

export const listEventManagementQuerySchema = z.object({
  search: z.string().trim().min(1).max(160).optional(),
  page: z.coerce.number().int().positive().default(1),
});

export const eventManagementIdParamSchema = z.object({
  id: z.string().trim().min(1).max(64),
});
