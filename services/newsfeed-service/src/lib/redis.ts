import { createClient } from 'redis';
import { env } from '../config/env';
import { logger } from '../config/logger';

type ServiceRedisClient = ReturnType<typeof createClient>;

let redisClient: ServiceRedisClient | null = null;
let redisListenersAttached = false;
let connectAttempted = false;

function attachRedisListeners(client: ServiceRedisClient): void {
  if (redisListenersAttached) {
    return;
  }

  redisListenersAttached = true;

  client.on('error', (error) => {
    logger.warn({ err: error }, 'Redis client error');
  });

  client.on('ready', () => {
    logger.info('Redis cache connection ready');
  });

  client.on('reconnecting', () => {
    logger.warn('Redis cache reconnecting');
  });

  client.on('end', () => {
    logger.warn('Redis cache connection closed');
  });
}

export async function connectRedis(): Promise<void> {
  if (!env.REDIS_ENABLED || connectAttempted) {
    return;
  }

  connectAttempted = true;

  const client = createClient({
    url: env.REDIS_URL,
    socket: {
      connectTimeout: env.REDIS_CONNECT_TIMEOUT_MS,
    },
  });

  attachRedisListeners(client);

  try {
    await client.connect();
    redisClient = client;
    logger.info({ redisUrl: env.REDIS_URL }, 'Redis cache enabled');
  } catch (error) {
    logger.warn(
      { err: error, redisUrl: env.REDIS_URL },
      'Redis unavailable, continuing without cache',
    );

    if (client.isOpen) {
      await client.disconnect().catch(() => undefined);
    }

    redisClient = null;
  }
}

export async function disconnectRedis(): Promise<void> {
  if (!redisClient) {
    return;
  }

  const client = redisClient;
  redisClient = null;
  connectAttempted = false;

  try {
    await client.quit();
  } catch (error) {
    logger.warn({ err: error }, 'Failed to close Redis connection cleanly');
  }
}

export function getRedisClient(): ServiceRedisClient | null {
  if (!redisClient?.isReady) {
    return null;
  }

  return redisClient;
}
