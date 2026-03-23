export interface StoreProduct {
  id: string;
  name: string;
  price: string;
  image: string;
  tag?: string;
}

export interface StoreProductInput {
  id?: string;
  name: string;
  price: string;
  image: string;
  tag?: string;
}

export interface StoreSummary {
  id: number;
  name: string;
  location: string;
  rating: string;
  image: string;
  badges: string[];
  delivery: string;
  minOrderRs: string;
  openingTime: string;
  closingTime: string;
  phoneNumber: string;
}

export interface StoreSummaryWithOwner extends StoreSummary {
  ownerUserId: string;
}

export interface StoreDetails extends StoreSummary {
  products: StoreProduct[];
}

export interface CreateStoreRequest {
  name: string;
  location: string;
  image: string;
  badges?: string[];
  delivery: string;
  minOrderRs: string;
  openingTime: string;
  closingTime: string;
  phoneNumber: string;
  products?: StoreProductInput[];
}

export interface UpdateStoreRequest {
  name?: string;
  location?: string;
  image?: string;
  badges?: string[];
  delivery?: string;
  minOrderRs?: string;
  openingTime?: string;
  closingTime?: string;
  phoneNumber?: string;
  products?: StoreProductInput[];
}

export interface CreateStoreRatingRequest {
  rating: number;
}

export interface StoreListQuery {
  search?: string;
  page?: number;
}

export interface StoreBasicSnapshot {
  id: number;
  name: string;
}

export interface StoreRankingSnapshot extends StoreBasicSnapshot {
  rating: string;
  updatedAt: string;
}

export interface MostSearchedStoreSnapshot extends StoreBasicSnapshot {
  searchCount: number;
}
