import type { StoreProduct, StoreProductInput } from './store';

export interface Product extends StoreProduct {}

export interface CreateProductRequest extends StoreProductInput {}

export interface UpdateProductRequest {
  name?: string;
  price?: string;
  image?: string;
  tag?: string;
}

export interface ProductListQuery {
  search?: string;
  page?: number;
}
