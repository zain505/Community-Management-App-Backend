import type { UserPublic } from './auth';
import type { StoreSummary } from './store';

export const NEWS_FEED_EVENT_TYPES = {
  STORE_CREATED: 'STORE_CREATED',
  STORE_NAME_UPDATED: 'STORE_NAME_UPDATED',
  STORE_LOCATION_UPDATED: 'STORE_LOCATION_UPDATED',
  STORE_RATING_UPDATED: 'STORE_RATING_UPDATED',
  STORE_IMAGE_UPDATED: 'STORE_IMAGE_UPDATED',
  STORE_DELIVERY_UPDATED: 'STORE_DELIVERY_UPDATED',
  STORE_MIN_ORDER_UPDATED: 'STORE_MIN_ORDER_UPDATED',
  STORE_CONTACT_UPDATED: 'STORE_CONTACT_UPDATED',
  STORE_PROFILE_UPDATED: 'STORE_PROFILE_UPDATED',
  STORE_DELETED: 'STORE_DELETED',
  PRODUCT_ADDED: 'PRODUCT_ADDED',
  PRODUCT_UPDATED: 'PRODUCT_UPDATED',
  PRODUCT_DELETED: 'PRODUCT_DELETED',
  ANNOUNCEMENT_CREATED: 'ANNOUNCEMENT_CREATED',
  ANNOUNCEMENT_UPDATED: 'ANNOUNCEMENT_UPDATED',
  ANNOUNCEMENT_DELETED: 'ANNOUNCEMENT_DELETED',
  EVENT_MANAGEMENT_CREATED: 'EVENT_MANAGEMENT_CREATED',
  EVENT_MANAGEMENT_UPDATED: 'EVENT_MANAGEMENT_UPDATED',
  EVENT_MANAGEMENT_DELETED: 'EVENT_MANAGEMENT_DELETED',
  USER_POST: 'USER_POST',
  POPULAR_STORE_CHANGED: 'POPULAR_STORE_CHANGED',
  MOST_ACTIVE_STORE_CHANGED: 'MOST_ACTIVE_STORE_CHANGED',
  MOST_SEARCHED_STORE_CHANGED: 'MOST_SEARCHED_STORE_CHANGED',
} as const;

export type NewsFeedEventType = (typeof NEWS_FEED_EVENT_TYPES)[keyof typeof NEWS_FEED_EVENT_TYPES];

export const NEWS_FEED_SOURCES = {
  SYSTEM: 'SYSTEM',
  USER_POST: 'USER_POST',
} as const;

export type NewsFeedSource = (typeof NEWS_FEED_SOURCES)[keyof typeof NEWS_FEED_SOURCES];

export const NEWS_FEED_APPROVAL_STATUSES = {
  APPROVED: 'APPROVED',
  DISAPPROVED: 'DISAPPROVED',
  PENDING: 'PENDING',
} as const;

export type NewsFeedApprovalStatus =
  (typeof NEWS_FEED_APPROVAL_STATUSES)[keyof typeof NEWS_FEED_APPROVAL_STATUSES];

export const NEWS_FEED_METRICS = {
  POPULAR_STORE: 'POPULAR_STORE',
  MOST_ACTIVE_STORE: 'MOST_ACTIVE_STORE',
  MOST_SEARCHED_STORE: 'MOST_SEARCHED_STORE',
} as const;

export type NewsFeedMetric = (typeof NEWS_FEED_METRICS)[keyof typeof NEWS_FEED_METRICS];

export interface NewsFeedProductSnapshot {
  id?: string;
  name: string;
  price: string;
  image: string;
  tag?: string;
  description?: string;
}

export interface NewsFeedItem {
  id: string;
  type: NewsFeedEventType;
  source: NewsFeedSource;
  approvalStatus: NewsFeedApprovalStatus;
  title: string;
  description: string;
  image?: string;
  authorUserId?: string;
  author?: UserPublic;
  storeId?: number;
  storeName?: string;
  store?: StoreSummary;
  storeOwner?: UserPublic;
  product?: NewsFeedProductSnapshot;
  metadata?: Record<string, unknown>;
  likesCount: number;
  createdAt: string;
}

export interface NewsFeedLikeResponse {
  id: string;
  likesCount: number;
}

export interface SavedNewsFeedItem extends NewsFeedItem {
  savedAt: string;
  expiresAt: string;
}

export interface NewsFeedListResponse {
  items: NewsFeedItem[];
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface SavedNewsFeedListResponse {
  items: SavedNewsFeedItem[];
  page: number;
  limit: number;
}

export interface NewsFeedDeleteResponse {
  id: string;
  message: string;
}

export interface NewsFeedListQuery {
  page?: number;
  limit?: number;
}

export interface NewsFeedAdminListQuery extends NewsFeedListQuery {
  status?: NewsFeedApprovalStatus;
}

export interface CreateNewsFeedPostRequest {
  title: string;
  description: string;
  image?: string;
}

export interface ReviewNewsFeedPostRequest {
  status: Exclude<NewsFeedApprovalStatus, 'PENDING'>;
}

export interface NewsFeedSyncEvent {
  type: NewsFeedEventType;
  title: string;
  description: string;
  image?: string;
  storeId?: number;
  storeName?: string;
  metadata?: Record<string, unknown>;
}

export interface NewsFeedSyncRequest {
  events?: NewsFeedSyncEvent[];
  refreshMetrics?: NewsFeedMetric[];
}
