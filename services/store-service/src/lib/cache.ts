import { logger } from '../config/logger';
import { getRedisClient } from './redis';

function logCacheFailure(action: string, key: string, error: unknown): void {
  logger.warn({ err: error, cacheKey: key }, `Redis cache ${action} failed`);
}

export async function getJsonCache<T>(key: string): Promise<T | null> {
  const client = getRedisClient();

  if (!client) {
    return null;
  }

  try {
    const payload = await client.get(key);

    if (!payload) {
      return null;
    }

    return JSON.parse(payload) as T;
  } catch (error) {
    logCacheFailure('read', key, error);
    return null;
  }
}

export async function setJsonCache<T>(
  key: string,
  value: T,
  ttlSeconds: number,
  options?: {
    maxPayloadBytes?: number;
  },
): Promise<boolean> {
  const client = getRedisClient();

  if (!client) {
    return false;
  }

  try {
    const payload = JSON.stringify(value);

    if (
      options?.maxPayloadBytes !== undefined &&
      Buffer.byteLength(payload, 'utf8') > options.maxPayloadBytes
    ) {
      logger.debug(
        {
          cacheKey: key,
          maxPayloadBytes: options.maxPayloadBytes,
          payloadBytes: Buffer.byteLength(payload, 'utf8'),
        },
        'Skipped Redis cache write because payload exceeds configured size limit',
      );
      return false;
    }

    await client.set(key, payload, {
      EX: ttlSeconds,
    });
    return true;
  } catch (error) {
    logCacheFailure('write', key, error);
    return false;
  }
}

export async function getCacheVersion(key: string): Promise<number> {
  const client = getRedisClient();

  if (!client) {
    return 0;
  }

  try {
    const value = await client.get(key);

    if (!value) {
      return 0;
    }

    const parsedValue = Number.parseInt(value, 10);
    return Number.isFinite(parsedValue) ? parsedValue : 0;
  } catch (error) {
    logCacheFailure('version-read', key, error);
    return 0;
  }
}

export async function bumpCacheVersion(key: string): Promise<number | null> {
  const client = getRedisClient();

  if (!client) {
    return null;
  }

  try {
    return await client.incr(key);
  } catch (error) {
    logCacheFailure('version-bump', key, error);
    return null;
  }
}

export async function acquireDebounceWindow(key: string, ttlSeconds: number): Promise<boolean> {
  const client = getRedisClient();

  if (!client) {
    return true;
  }

  try {
    const result = await client.set(key, '1', {
      EX: ttlSeconds,
      NX: true,
    });

    return result === 'OK';
  } catch (error) {
    logCacheFailure('debounce-acquire', key, error);
    return true;
  }
}
