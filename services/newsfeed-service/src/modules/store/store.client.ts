import type {
  ApiSuccess,
  MostSearchedStoreSnapshot,
  StoreBasicSnapshot,
  StoreRankingSnapshot,
  StoreSummaryWithOwner,
} from '@community/contracts';
import axios from 'axios';
import { env } from '../../config/env';

async function getInternalStoreData<T>(path: string): Promise<T> {
  const response = await axios.get(`${env.STORE_SERVICE_BASE_URL}${path}`, {
    timeout: env.STORE_SERVICE_TIMEOUT_MS,
    validateStatus: () => true,
  });

  if (response.status >= 400) {
    throw new Error(`Store service request failed with status ${response.status}`);
  }

  return (response.data as ApiSuccess<T>).data;
}

export const storeClient = {
  listStoresForPopularityRanking(): Promise<StoreRankingSnapshot[]> {
    return getInternalStoreData<StoreRankingSnapshot[]>('/internal/stores/ranking');
  },

  findStoreBasicById(storeId: number): Promise<StoreBasicSnapshot | null> {
    return getInternalStoreData<StoreBasicSnapshot | null>(`/internal/stores/${storeId}/basic`);
  },

  findStoreSummaryById(storeId: number): Promise<StoreSummaryWithOwner | null> {
    return getInternalStoreData<StoreSummaryWithOwner | null>(`/internal/stores/${storeId}/summary`);
  },

  findMostSearchedStore(): Promise<MostSearchedStoreSnapshot | null> {
    return getInternalStoreData<MostSearchedStoreSnapshot | null>('/internal/stores/most-searched');
  },
};
