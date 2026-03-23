import { z } from 'zod';

const announcementPayloadSchema = z.object({
  title: z.string().trim().min(1).max(160),
  content: z.string().trim().min(1).max(5_000),
});

export const createAnnouncementBodySchema = announcementPayloadSchema;

export const updateAnnouncementBodySchema = announcementPayloadSchema.partial().refine(
  (payload) => Object.keys(payload).length > 0,
  {
    message: 'At least one field is required',
  },
);

export const listAnnouncementsQuerySchema = z.object({
  search: z.string().trim().min(1).max(160).optional(),
  page: z.coerce.number().int().positive().default(1),
});

export const announcementIdParamSchema = z.object({
  id: z.string().trim().min(1).max(64),
});
