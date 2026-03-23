export interface ExistingStoreProductLike {
  id: string;
  name: string;
  price: string;
  image: string;
  tag: string | null;
}

export interface IncomingStoreProductLike {
  id?: string;
  name: string;
  price: string;
  image: string;
  tag?: string;
}

export interface MatchedStoreProductPair<
  TExisting extends ExistingStoreProductLike,
  TIncoming extends IncomingStoreProductLike,
> {
  previous: TExisting;
  next: TIncoming;
}

export interface MatchedStoreProductsResult<
  TExisting extends ExistingStoreProductLike,
  TIncoming extends IncomingStoreProductLike,
> {
  matched: MatchedStoreProductPair<TExisting, TIncoming>[];
  created: TIncoming[];
  deleted: TExisting[];
}

function normalizeText(value: string | null | undefined): string {
  return (value ?? '').trim().toLowerCase();
}

export function hasStoreProductContentChanged<
  TExisting extends ExistingStoreProductLike,
  TIncoming extends IncomingStoreProductLike,
>(existingProduct: TExisting, nextProduct: TIncoming): boolean {
  return (
    existingProduct.name !== nextProduct.name ||
    existingProduct.price !== nextProduct.price ||
    existingProduct.image !== nextProduct.image ||
    normalizeText(existingProduct.tag) !== normalizeText(nextProduct.tag)
  );
}

export function matchStoreProducts<
  TExisting extends ExistingStoreProductLike,
  TIncoming extends IncomingStoreProductLike,
>(
  existingProducts: TExisting[],
  nextProducts: TIncoming[],
): MatchedStoreProductsResult<TExisting, TIncoming> {
  const existingById = new Map(existingProducts.map((product) => [product.id, product]));
  const consumedExistingIds = new Set<string>();
  const matched: MatchedStoreProductPair<TExisting, TIncoming>[] = [];
  const created: TIncoming[] = [];

  for (const nextProduct of nextProducts) {
    let matchingExistingProduct: TExisting | undefined;

    if (nextProduct.id) {
      matchingExistingProduct = existingById.get(nextProduct.id);
    }

    if (!matchingExistingProduct) {
      matchingExistingProduct = existingProducts.find((existingProduct) => {
        if (consumedExistingIds.has(existingProduct.id)) {
          return false;
        }

        return normalizeText(existingProduct.name) === normalizeText(nextProduct.name);
      });
    }

    if (!matchingExistingProduct) {
      created.push(nextProduct);
      continue;
    }

    consumedExistingIds.add(matchingExistingProduct.id);
    matched.push({
      previous: matchingExistingProduct,
      next: nextProduct,
    });
  }

  return {
    matched,
    created,
    deleted: existingProducts.filter((existingProduct) => !consumedExistingIds.has(existingProduct.id)),
  };
}
