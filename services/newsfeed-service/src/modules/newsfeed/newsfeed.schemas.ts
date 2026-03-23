import {
  NEWS_FEED_EVENT_TYPES,
  NEWS_FEED_METRICS,
  type NewsFeedEventType,
  type NewsFeedMetric,
} from '@community/contracts';
import { z } from 'zod';

export const listNewsFeedQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

export const newsFeedIdParamSchema = z.object({
  id: z.string().trim().min(1).max(64),
});

const newsFeedEventTypeSchema = z.enum(
  Object.values(NEWS_FEED_EVENT_TYPES) as [NewsFeedEventType, ...NewsFeedEventType[]],
);

const newsFeedMetricSchema = z.enum(
  Object.values(NEWS_FEED_METRICS) as [NewsFeedMetric, ...NewsFeedMetric[]],
);

const newsFeedSyncEventSchema = z.object({
  type: newsFeedEventTypeSchema,
  title: z.string().trim().min(1).max(191),
  description: z.string().trim().min(1).max(5_000),
  storeId: z.coerce.number().int().positive().optional(),
  storeName: z.string().trim().min(1).max(191).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const newsFeedSyncBodySchema = z
  .object({
    events: z.array(newsFeedSyncEventSchema).max(100).optional(),
    refreshMetrics: z.array(newsFeedMetricSchema).max(10).optional(),
  })
  .refine((payload) => Boolean(payload.events?.length || payload.refreshMetrics?.length), {
    message: 'At least one sync action is required',
  });
