import type { NewsFeedListResponse } from '@community/contracts';
import { env } from '../../config/env';
import { bumpCacheVersion, getCacheVersion, getJsonCache, setJsonCache } from '../../lib/cache';

const NEWSFEED_LIST_CACHE_VERSION_KEY = 'newsfeed:list:version';

async function buildNewsFeedListCacheKey(page: number, limit: number): Promise<string> {
  const version = await getCacheVersion(NEWSFEED_LIST_CACHE_VERSION_KEY);
  return `newsfeed:list:v2:${version}:page=${page}:limit=${limit}`;
}

export async function readNewsFeedListCache(
  page: number,
  limit: number,
): Promise<NewsFeedListResponse | null> {
  const cacheKey = await buildNewsFeedListCacheKey(page, limit);
  return getJsonCache<NewsFeedListResponse>(cacheKey);
}

export async function writeNewsFeedListCache(
  page: number,
  limit: number,
  payload: NewsFeedListResponse,
): Promise<boolean> {
  const cacheKey = await buildNewsFeedListCacheKey(page, limit);
  return setJsonCache(cacheKey, payload, env.NEWSFEED_LIST_CACHE_TTL_SECONDS, {
    maxPayloadBytes: env.NEWSFEED_LIST_CACHE_MAX_PAYLOAD_BYTES,
  });
}

export async function invalidateNewsFeedListCache(): Promise<void> {
  await bumpCacheVersion(NEWSFEED_LIST_CACHE_VERSION_KEY);
}
