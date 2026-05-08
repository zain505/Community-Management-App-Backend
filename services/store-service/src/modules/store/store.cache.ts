import type { StoreSummary } from '@community/contracts';
import { env } from '../../config/env';
import {
  acquireDebounceWindow,
  bumpCacheVersion,
  getCacheVersion,
  getJsonCache,
  setJsonCache,
} from '../../lib/cache';

const STORE_LIST_CACHE_VERSION_KEY = 'store:list:version';
const MOST_SEARCHED_SYNC_DEBOUNCE_KEY = 'store:newsfeed:most-searched-sync';

function normalizeSearch(search?: string): string {
  if (typeof search !== 'string') {
    return '';
  }

  return search.trim();
}

async function buildStoreListCacheKey(search: string | undefined, page: number): Promise<string> {
  const version = await getCacheVersion(STORE_LIST_CACHE_VERSION_KEY);
  const normalizedSearch = normalizeSearch(search);
  const searchSegment = normalizedSearch.length > 0 ? encodeURIComponent(normalizedSearch) : '_';

  return `store:list:v1:${version}:search=${searchSegment}:page=${page}`;
}

export async function readStoreListCache(
  search: string | undefined,
  page: number,
): Promise<StoreSummary[] | null> {
  const cacheKey = await buildStoreListCacheKey(search, page);
  return getJsonCache<StoreSummary[]>(cacheKey);
}

export async function writeStoreListCache(
  search: string | undefined,
  page: number,
  stores: StoreSummary[],
): Promise<boolean> {
  const cacheKey = await buildStoreListCacheKey(search, page);
  return setJsonCache(cacheKey, stores, env.STORE_LIST_CACHE_TTL_SECONDS);
}

export async function invalidateStoreListCache(): Promise<void> {
  await bumpCacheVersion(STORE_LIST_CACHE_VERSION_KEY);
}

export async function shouldSyncMostSearchedMetric(): Promise<boolean> {
  return acquireDebounceWindow(
    MOST_SEARCHED_SYNC_DEBOUNCE_KEY,
    env.STORE_SEARCH_SYNC_DEBOUNCE_SECONDS,
  );
}
