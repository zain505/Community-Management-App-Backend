import type { NewsFeedSyncRequest } from '@community/contracts';
import axios from 'axios';
import { env } from '../../config/env';
import { logger } from '../../config/logger';

function hasSyncWork(payload: NewsFeedSyncRequest): boolean {
  return Boolean(payload.events?.length || payload.refreshMetrics?.length);
}

async function sync(payload: NewsFeedSyncRequest): Promise<void> {
  if (!hasSyncWork(payload)) {
    return;
  }

  const response = await axios.post(`${env.NEWSFEED_SERVICE_BASE_URL}/internal/newsfeed/sync`, payload, {
    timeout: env.NEWSFEED_SERVICE_TIMEOUT_MS,
    validateStatus: () => true,
  });

  if (response.status >= 400) {
    throw new Error(`Newsfeed sync failed with status ${response.status}`);
  }
}

async function syncBestEffort(payload: NewsFeedSyncRequest): Promise<void> {
  try {
    await sync(payload);
  } catch (error) {
    logger.error(
      {
        err: error,
        eventCount: payload.events?.length ?? 0,
        refreshMetrics: payload.refreshMetrics,
      },
      'Newsfeed sync failed',
    );
  }
}

export const newsFeedClient = {
  sync,
  syncBestEffort,
};
