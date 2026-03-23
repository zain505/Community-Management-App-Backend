import type {
  NewsFeedMetric,
  NewsFeedSyncEvent,
  StoreProductInput,
  UpdateStoreRequest,
} from '@community/contracts';
import type { Prisma } from '../../generated/prisma';
import {
  hasStoreProductContentChanged,
  type MatchedStoreProductsResult,
} from './store-product-matcher';
import { storeNewsFeedCopy } from './store-newsfeed-copy';
import type { StoreWithProductsRecord } from './store.repository';

export function parseStoreBadges(value: Prisma.JsonValue | null): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((badge): badge is string => typeof badge === 'string');
}

function areStringArraysDifferent(left: string[], right: string[]): boolean {
  if (left.length !== right.length) {
    return true;
  }

  return left.some((value, index) => value !== right[index]);
}

export function hasStoreBadgesChanged(
  existingStore: StoreWithProductsRecord,
  payload: UpdateStoreRequest,
): boolean {
  return (
    payload.badges !== undefined &&
    areStringArraysDifferent(payload.badges, parseStoreBadges(existingStore.badges))
  );
}

interface AddedProductChange {
  type: 'added';
  next: StoreProductInput;
}

interface UpdatedProductChange {
  type: 'updated';
  previous: StoreWithProductsRecord['products'][number];
  next: StoreProductInput;
}

export type ProductChange = AddedProductChange | UpdatedProductChange;

interface ProductEventStore {
  id: number;
  name: string;
}

interface ProductEventSnapshot {
  id?: string;
  name: string;
  price: string;
  image: string;
  tag?: string | null;
}

export function buildProductChanges(
  productMatches: MatchedStoreProductsResult<
    StoreWithProductsRecord['products'][number],
    StoreProductInput
  >,
): ProductChange[] {
  const changes: ProductChange[] = [];

  for (const nextProduct of productMatches.created) {
    changes.push({
      type: 'added',
      next: nextProduct,
    });
  }

  for (const productMatch of productMatches.matched) {
    if (!hasStoreProductContentChanged(productMatch.previous, productMatch.next)) {
      continue;
    }

    changes.push({
      type: 'updated',
      previous: productMatch.previous,
      next: productMatch.next,
    });
  }

  return changes;
}

type TrackedStoreField =
  | 'name'
  | 'location'
  | 'rating'
  | 'image'
  | 'delivery'
  | 'minOrderRs'
  | 'phoneNumber';

type StoreFieldEventType =
  | 'STORE_NAME_UPDATED'
  | 'STORE_LOCATION_UPDATED'
  | 'STORE_RATING_UPDATED'
  | 'STORE_IMAGE_UPDATED'
  | 'STORE_DELIVERY_UPDATED'
  | 'STORE_MIN_ORDER_UPDATED'
  | 'STORE_CONTACT_UPDATED';

type StoreHoursProfileField = 'openingTime' | 'closingTime';
type MeaningfulStoreProfileField = 'badges' | StoreHoursProfileField;

interface StoreFieldEventDescriptor<K extends TrackedStoreField = TrackedStoreField> {
  field: K;
  type: StoreFieldEventType;
  buildCopy: (
    previousStore: StoreWithProductsRecord,
    updatedStore: StoreWithProductsRecord,
  ) => Pick<NewsFeedSyncEvent, 'title' | 'description'>;
  buildMetadata: (
    previousStore: StoreWithProductsRecord,
    updatedStore: StoreWithProductsRecord,
  ) => Record<string, unknown>;
  refreshMetrics?: NewsFeedMetric[];
}

interface BuildStoreUpdateActivitySyncParams {
  existingStore: StoreWithProductsRecord;
  updatedStore: StoreWithProductsRecord;
  badgesChanged: boolean;
  productChanges: ProductChange[];
}

interface StoreProfileChangeDescriptor<K extends MeaningfulStoreProfileField = MeaningfulStoreProfileField> {
  field: K;
  hasChanged: (params: BuildStoreUpdateActivitySyncParams) => boolean;
  buildMetadata: (params: BuildStoreUpdateActivitySyncParams) => Record<string, unknown>;
}

interface StoreProfileChange<K extends MeaningfulStoreProfileField = MeaningfulStoreProfileField> {
  field: K;
  metadata: Record<string, unknown>;
}

const storeFieldEventDescriptors: StoreFieldEventDescriptor[] = [
  {
    field: 'name',
    type: 'STORE_NAME_UPDATED',
    buildCopy: (previousStore, updatedStore) =>
      storeNewsFeedCopy.storeNameUpdated(previousStore.name, updatedStore.name),
    buildMetadata: (previousStore, updatedStore) => ({
      previousName: previousStore.name,
      nextName: updatedStore.name,
    }),
  },
  {
    field: 'location',
    type: 'STORE_LOCATION_UPDATED',
    buildCopy: (_previousStore, updatedStore) => storeNewsFeedCopy.storeLocationUpdated(updatedStore.name),
    buildMetadata: (previousStore, updatedStore) => ({
      previousLocation: previousStore.location,
      nextLocation: updatedStore.location,
    }),
  },
  {
    field: 'rating',
    type: 'STORE_RATING_UPDATED',
    buildCopy: (_previousStore, updatedStore) => storeNewsFeedCopy.storeRatingUpdated(updatedStore.name),
    buildMetadata: (previousStore, updatedStore) => ({
      previousRating: previousStore.rating,
      nextRating: updatedStore.rating,
    }),
    refreshMetrics: ['POPULAR_STORE'],
  },
  {
    field: 'image',
    type: 'STORE_IMAGE_UPDATED',
    buildCopy: (_previousStore, updatedStore) => storeNewsFeedCopy.storeImageUpdated(updatedStore.name),
    buildMetadata: (previousStore, updatedStore) => ({
      previousImage: previousStore.image,
      nextImage: updatedStore.image,
    }),
  },
  {
    field: 'delivery',
    type: 'STORE_DELIVERY_UPDATED',
    buildCopy: (_previousStore, updatedStore) => storeNewsFeedCopy.storeDeliveryUpdated(updatedStore.name),
    buildMetadata: (previousStore, updatedStore) => ({
      previousDelivery: previousStore.delivery,
      nextDelivery: updatedStore.delivery,
    }),
  },
  {
    field: 'minOrderRs',
    type: 'STORE_MIN_ORDER_UPDATED',
    buildCopy: (_previousStore, updatedStore) => storeNewsFeedCopy.storeMinOrderUpdated(updatedStore.name),
    buildMetadata: (previousStore, updatedStore) => ({
      previousMinOrderRs: previousStore.minOrderRs,
      nextMinOrderRs: updatedStore.minOrderRs,
    }),
  },
  {
    field: 'phoneNumber',
    type: 'STORE_CONTACT_UPDATED',
    buildCopy: (_previousStore, updatedStore) => storeNewsFeedCopy.storeContactUpdated(updatedStore.name),
    buildMetadata: (previousStore, updatedStore) => ({
      previousContact: previousStore.phoneNumber,
      nextContact: updatedStore.phoneNumber,
    }),
  },
];

const storeProfileChangeDescriptors: StoreProfileChangeDescriptor[] = [
  {
    field: 'badges',
    hasChanged: (params) => params.badgesChanged,
    buildMetadata: (params) => ({
      previous: parseStoreBadges(params.existingStore.badges),
      current: parseStoreBadges(params.updatedStore.badges),
    }),
  },
  {
    field: 'openingTime',
    hasChanged: (params) => params.existingStore.openingTime !== params.updatedStore.openingTime,
    buildMetadata: (params) => ({
      previous: params.existingStore.openingTime,
      current: params.updatedStore.openingTime,
    }),
  },
  {
    field: 'closingTime',
    hasChanged: (params) => params.existingStore.closingTime !== params.updatedStore.closingTime,
    buildMetadata: (params) => ({
      previous: params.existingStore.closingTime,
      current: params.updatedStore.closingTime,
    }),
  },
];

function hasStoreFieldChanged(
  previousStore: StoreWithProductsRecord,
  updatedStore: StoreWithProductsRecord,
  field: TrackedStoreField,
): boolean {
  return previousStore[field] !== updatedStore[field];
}

function buildStoreFieldEvents(
  params: BuildStoreUpdateActivitySyncParams,
): {
  events: NewsFeedSyncEvent[];
  refreshMetrics: NewsFeedMetric[];
} {
  const events: NewsFeedSyncEvent[] = [];
  const refreshMetrics: NewsFeedMetric[] = [];

  for (const descriptor of storeFieldEventDescriptors) {
    if (!hasStoreFieldChanged(params.existingStore, params.updatedStore, descriptor.field)) {
      continue;
    }

    events.push({
      type: descriptor.type,
      storeId: params.updatedStore.id,
      storeName: params.updatedStore.name,
      ...descriptor.buildCopy(params.existingStore, params.updatedStore),
      metadata: descriptor.buildMetadata(params.existingStore, params.updatedStore),
    });

    if (descriptor.refreshMetrics) {
      refreshMetrics.push(...descriptor.refreshMetrics);
    }
  }

  return {
    events,
    refreshMetrics,
  };
}

function buildStoreProfileChanges(params: BuildStoreUpdateActivitySyncParams): StoreProfileChange[] {
  const changes: StoreProfileChange[] = [];

  for (const descriptor of storeProfileChangeDescriptors) {
    if (!descriptor.hasChanged(params)) {
      continue;
    }

    changes.push({
      field: descriptor.field,
      metadata: descriptor.buildMetadata(params),
    });
  }

  return changes;
}

function buildStoreProfileUpdatedEvent(
  store: Pick<StoreWithProductsRecord, 'id' | 'name'>,
  changes: StoreProfileChange[],
): NewsFeedSyncEvent {
  return {
    type: 'STORE_PROFILE_UPDATED',
    storeId: store.id,
    storeName: store.name,
    ...storeNewsFeedCopy.storeProfileUpdated(store.name),
    metadata: {
      changedFields: changes.map((change) => change.field),
      changes: Object.fromEntries(changes.map((change) => [change.field, change.metadata])),
    },
  };
}

export function buildStoreCreatedEvent(store: Pick<StoreWithProductsRecord, 'id' | 'name'>): NewsFeedSyncEvent {
  return {
    type: 'STORE_CREATED',
    storeId: store.id,
    storeName: store.name,
    ...storeNewsFeedCopy.storeCreated(store.name),
  };
}

function toProductMetadata(product: ProductEventSnapshot): Record<string, unknown> {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    tag: product.tag ?? undefined,
  };
}

export function buildProductAddedEvent(params: {
  store: ProductEventStore;
  product: ProductEventSnapshot;
}): NewsFeedSyncEvent {
  return {
    type: 'PRODUCT_ADDED',
    storeId: params.store.id,
    storeName: params.store.name,
    ...storeNewsFeedCopy.productAdded(params.store.name, params.product.name),
    metadata: {
      product: toProductMetadata(params.product),
    },
  };
}

export function buildProductUpdatedEvent(params: {
  store: ProductEventStore;
  previousProduct: ProductEventSnapshot;
  currentProduct: ProductEventSnapshot;
}): NewsFeedSyncEvent {
  return {
    type: 'PRODUCT_UPDATED',
    storeId: params.store.id,
    storeName: params.store.name,
    ...storeNewsFeedCopy.productUpdated(params.store.name, params.currentProduct.name),
    metadata: {
      previous: toProductMetadata(params.previousProduct),
      current: toProductMetadata(params.currentProduct),
    },
  };
}

export function buildProductDeletedEvent(params: {
  store: ProductEventStore;
  product: ProductEventSnapshot;
}): NewsFeedSyncEvent {
  return {
    type: 'PRODUCT_DELETED',
    storeId: params.store.id,
    storeName: params.store.name,
    ...storeNewsFeedCopy.productDeleted(params.store.name, params.product.name),
    metadata: {
      product: toProductMetadata(params.product),
    },
  };
}

export function buildStoreUpdateActivitySync(
  params: BuildStoreUpdateActivitySyncParams,
): {
  events: NewsFeedSyncEvent[];
  refreshMetrics: NewsFeedMetric[];
} {
  const { events: fieldEvents, refreshMetrics } = buildStoreFieldEvents(params);
  const profileChanges = buildStoreProfileChanges(params);
  const events = [...fieldEvents];

  if (profileChanges.length > 0) {
    events.push(buildStoreProfileUpdatedEvent(params.updatedStore, profileChanges));
  }

  for (const productChange of params.productChanges) {
    if (productChange.type === 'added') {
      events.push(
        buildProductAddedEvent({
          store: params.updatedStore,
          product: productChange.next,
        }),
      );
      continue;
    }

    events.push(
      buildProductUpdatedEvent({
        store: params.updatedStore,
        previousProduct: productChange.previous,
        currentProduct: {
          id: productChange.next.id ?? productChange.previous.id,
          name: productChange.next.name,
          price: productChange.next.price,
          image: productChange.next.image,
          tag: productChange.next.tag,
        },
      }),
    );
  }

  const orderedRefreshMetrics: NewsFeedMetric[] = [];

  if (fieldEvents.length > 0 || profileChanges.length > 0 || params.productChanges.length > 0) {
    orderedRefreshMetrics.push('MOST_ACTIVE_STORE');
  }

  orderedRefreshMetrics.push(...refreshMetrics);

  return {
    events,
    refreshMetrics: [...new Set(orderedRefreshMetrics)],
  };
}
