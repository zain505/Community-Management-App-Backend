import type { UserPublic } from './auth';
import type { StoreSummary } from './store';
export declare const NEWS_FEED_EVENT_TYPES: {
    readonly STORE_CREATED: "STORE_CREATED";
    readonly STORE_NAME_UPDATED: "STORE_NAME_UPDATED";
    readonly STORE_RATING_UPDATED: "STORE_RATING_UPDATED";
    readonly STORE_PROFILE_UPDATED: "STORE_PROFILE_UPDATED";
    readonly PRODUCT_ADDED: "PRODUCT_ADDED";
    readonly PRODUCT_UPDATED: "PRODUCT_UPDATED";
    readonly POPULAR_STORE_CHANGED: "POPULAR_STORE_CHANGED";
    readonly MOST_ACTIVE_STORE_CHANGED: "MOST_ACTIVE_STORE_CHANGED";
    readonly MOST_SEARCHED_STORE_CHANGED: "MOST_SEARCHED_STORE_CHANGED";
};
export type NewsFeedEventType = (typeof NEWS_FEED_EVENT_TYPES)[keyof typeof NEWS_FEED_EVENT_TYPES];
export declare const NEWS_FEED_METRICS: {
    readonly POPULAR_STORE: "POPULAR_STORE";
    readonly MOST_ACTIVE_STORE: "MOST_ACTIVE_STORE";
    readonly MOST_SEARCHED_STORE: "MOST_SEARCHED_STORE";
};
export type NewsFeedMetric = (typeof NEWS_FEED_METRICS)[keyof typeof NEWS_FEED_METRICS];
export interface NewsFeedProductSnapshot {
    id?: string;
    name: string;
    price: string;
    image: string;
    tag?: string;
}
export interface NewsFeedItem {
    id: string;
    type: NewsFeedEventType;
    title: string;
    description: string;
    storeId?: number;
    storeName?: string;
    store?: StoreSummary;
    storeOwner?: UserPublic;
    product?: NewsFeedProductSnapshot;
    metadata?: Record<string, unknown>;
    createdAt: string;
}
export interface NewsFeedListResponse {
    items: NewsFeedItem[];
    page: number;
    limit: number;
}
export interface NewsFeedListQuery {
    page?: number;
    limit?: number;
}
export interface NewsFeedSyncEvent {
    type: NewsFeedEventType;
    title: string;
    description: string;
    storeId?: number;
    storeName?: string;
    metadata?: Record<string, unknown>;
}
export interface NewsFeedSyncRequest {
    events?: NewsFeedSyncEvent[];
    refreshMetrics?: NewsFeedMetric[];
}
//# sourceMappingURL=newsfeed.d.ts.map
