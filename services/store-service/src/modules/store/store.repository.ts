import { Prisma, type Store } from '../../generated/prisma';
import { prisma } from '../../lib/prisma';
import { hasStoreProductContentChanged, matchStoreProducts } from './store-product-matcher';

const STORES_PER_PAGE = 10;

const storeReviewSelect = {
  id: true,
  rating: true,
  description: true,
  createdAt: true,
} satisfies Prisma.StoreRatingSelect;

const storeListInclude = {
  ratings: {
    select: storeReviewSelect,
    orderBy: {
      createdAt: 'desc',
    },
  },
} satisfies Prisma.StoreInclude;

const storeWithProductsInclude = {
  products: {
    orderBy: {
      createdAt: 'asc',
    },
  },
  ratings: {
    select: storeReviewSelect,
    orderBy: {
      createdAt: 'desc',
    },
  },
} satisfies Prisma.StoreInclude;

const storeRankingSelect = {
  id: true,
  name: true,
  rating: true,
  searchCount: true,
  updatedAt: true,
} satisfies Prisma.StoreSelect;

const storeBasicSelect = {
  id: true,
  name: true,
} satisfies Prisma.StoreSelect;

const storeSummaryWithOwnerSelect = {
  id: true,
  ownerUserId: true,
  name: true,
  location: true,
  rating: true,
  image: true,
  badges: true,
  delivery: true,
  minOrderRs: true,
  openingTime: true,
  closingTime: true,
  phoneNumber: true,
} satisfies Prisma.StoreSelect;

const mostSearchedStoreSelect = {
  id: true,
  name: true,
  searchCount: true,
} satisfies Prisma.StoreSelect;

export type StoreWithProductsRecord = Prisma.StoreGetPayload<{
  include: typeof storeWithProductsInclude;
}>;

export type StoreListRecord = Prisma.StoreGetPayload<{
  include: typeof storeListInclude;
}>;

export type StoreReviewRecord = Prisma.StoreRatingGetPayload<{
  select: typeof storeReviewSelect;
}>;

export type StoreRankingRecord = Prisma.StoreGetPayload<{
  select: typeof storeRankingSelect;
}>;

export type StoreBasicRecord = Prisma.StoreGetPayload<{
  select: typeof storeBasicSelect;
}>;

export type StoreSummaryWithOwnerRecord = Prisma.StoreGetPayload<{
  select: typeof storeSummaryWithOwnerSelect;
}>;

export type MostSearchedStoreRecord = Prisma.StoreGetPayload<{
  select: typeof mostSearchedStoreSelect;
}>;

interface StoreProductWriteInput {
  id?: string;
  name: string;
  price: string;
  image: string;
  tag?: string;
  description?: string;
}

interface CreateStoreRecordInput {
  name: string;
  location: string;
  image: string;
  badges: string[];
  delivery: string;
  minOrderRs: string;
  openingTime: string;
  closingTime: string;
  phoneNumber: string;
  products: StoreProductWriteInput[];
}

interface UpdateStoreRecordInput {
  name?: string;
  location?: string;
  image?: string;
  delivery?: string;
  minOrderRs?: string;
  openingTime?: string;
  closingTime?: string;
  phoneNumber?: string;
  products?: StoreProductWriteInput[];
}

function toProductCreateInput(product: StoreProductWriteInput): Prisma.StoreProductCreateWithoutStoreInput {
  const data: Prisma.StoreProductCreateWithoutStoreInput = {
    name: product.name,
    price: product.price,
    image: product.image,
    tag: product.tag,
    description: product.description,
  };

  if (product.id) {
    data.id = product.id;
  }

  return data;
}

function formatStoreRating(value: number): string {
  return Number(value.toFixed(2)).toString();
}

function toProductUpdateInput(product: StoreProductWriteInput): Prisma.StoreProductUpdateWithoutStoreInput {
  return {
    name: product.name,
    price: product.price,
    image: product.image,
    tag: product.tag,
    description: product.description,
  };
}

function buildProductRelationUpdate(
  existingProducts: StoreWithProductsRecord['products'],
  nextProducts: StoreProductWriteInput[],
): Prisma.StoreProductUpdateManyWithoutStoreNestedInput {
  const productMatches = matchStoreProducts(existingProducts, nextProducts);
  const changedProductMatches = productMatches.matched.filter((productMatch) =>
    hasStoreProductContentChanged(productMatch.previous, productMatch.next),
  );
  const data: Prisma.StoreProductUpdateManyWithoutStoreNestedInput = {};

  if (productMatches.deleted.length > 0) {
    data.deleteMany = {
      id: {
        in: productMatches.deleted.map((product) => product.id),
      },
    };
  }

  if (changedProductMatches.length > 0) {
    data.update = changedProductMatches.map((productMatch) => ({
      where: {
        id: productMatch.previous.id,
      },
      data: toProductUpdateInput(productMatch.next),
    }));
  }

  if (productMatches.created.length > 0) {
    data.create = productMatches.created.map(toProductCreateInput);
  }

  return data;
}

export const storeRepository = {
  listStores(search?: string, page = 1): Promise<StoreListRecord[]> {
    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { location: { contains: search } },
          ],
        }
      : undefined;

    return prisma.store.findMany({
      where,
      skip: (page - 1) * STORES_PER_PAGE,
      take: STORES_PER_PAGE,
      orderBy: {
        createdAt: 'desc',
      },
      include: storeListInclude,
    });
  },

  async incrementSearchCountByIds(storeIds: number[]): Promise<void> {
    if (storeIds.length === 0) {
      return;
    }

    await prisma.store.updateMany({
      where: {
        id: {
          in: storeIds,
        },
      },
      data: {
        searchCount: {
          increment: 1,
        },
      },
    });
  },

  findStoreByUserId(ownerUserId: string): Promise<StoreWithProductsRecord | null> {
    return prisma.store.findUnique({
      where: { ownerUserId },
      include: storeWithProductsInclude,
    });
  },

  findStoreById(storeId: number): Promise<StoreWithProductsRecord | null> {
    return prisma.store.findUnique({
      where: { id: storeId },
      include: storeWithProductsInclude,
    });
  },

  findStoreBasicByUserId(ownerUserId: string): Promise<StoreBasicRecord | null> {
    return prisma.store.findUnique({
      where: { ownerUserId },
      select: storeBasicSelect,
    });
  },

  createForUser(ownerUserId: string, payload: CreateStoreRecordInput): Promise<StoreWithProductsRecord> {
    return prisma.store.create({
      data: {
        name: payload.name,
        location: payload.location,
        rating: '0',
        image: payload.image,
        badges: payload.badges as Prisma.InputJsonValue,
        delivery: payload.delivery,
        minOrderRs: payload.minOrderRs,
        openingTime: payload.openingTime,
        closingTime: payload.closingTime,
        phoneNumber: payload.phoneNumber,
        ownerUserId,
        products:
          payload.products.length > 0
            ? {
                create: payload.products.map(toProductCreateInput),
              }
            : undefined,
      },
      include: storeWithProductsInclude,
    });
  },

  listStoresForPopularityRanking(): Promise<StoreRankingRecord[]> {
    return prisma.store.findMany({
      select: storeRankingSelect,
    });
  },

  findMostSearchedStore(): Promise<MostSearchedStoreRecord | null> {
    return prisma.store.findFirst({
      orderBy: [
        {
          searchCount: 'desc',
        },
        {
          updatedAt: 'desc',
        },
      ],
      select: mostSearchedStoreSelect,
    });
  },

  findStoreBasicById(storeId: number): Promise<StoreBasicRecord | null> {
    return prisma.store.findUnique({
      where: {
        id: storeId,
      },
      select: storeBasicSelect,
    });
  },

  findStoreSummaryById(storeId: number): Promise<StoreSummaryWithOwnerRecord | null> {
    return prisma.store.findUnique({
      where: {
        id: storeId,
      },
      select: storeSummaryWithOwnerSelect,
    });
  },

  findStoreSummariesByIds(storeIds: number[]): Promise<StoreSummaryWithOwnerRecord[]> {
    return prisma.store.findMany({
      where: {
        id: {
          in: storeIds,
        },
      },
      select: storeSummaryWithOwnerSelect,
    });
  },

  addRatingForUser(
    storeId: number,
    userId: string,
    rating: number,
    badges?: string[],
    description?: string,
  ): Promise<StoreWithProductsRecord> {
    return prisma.$transaction(async (transaction) => {
      await transaction.storeRating.create({
        data: {
          storeId,
          userId,
          rating: new Prisma.Decimal(rating),
          description,
        },
      });

      const ratingAggregate = await transaction.storeRating.aggregate({
        where: {
          storeId,
        },
        _avg: {
          rating: true,
        },
      });
      const nextRating = formatStoreRating(Number(ratingAggregate._avg.rating ?? 0));
      const data: Prisma.StoreUpdateInput = {
        rating: nextRating,
      };

      if (badges !== undefined) {
        data.badges = badges as Prisma.InputJsonValue;
      }

      return transaction.store.update({
        where: { id: storeId },
        data,
        include: storeWithProductsInclude,
      });
    });
  },

  updateById(
    storeId: number,
    payload: UpdateStoreRecordInput,
    existingProducts: StoreWithProductsRecord['products'],
  ): Promise<StoreWithProductsRecord> {
    const data: Prisma.StoreUpdateInput = {};

    if (payload.name !== undefined) data.name = payload.name;
    if (payload.location !== undefined) data.location = payload.location;
    if (payload.image !== undefined) data.image = payload.image;
    if (payload.delivery !== undefined) data.delivery = payload.delivery;
    if (payload.minOrderRs !== undefined) data.minOrderRs = payload.minOrderRs;
    if (payload.openingTime !== undefined) data.openingTime = payload.openingTime;
    if (payload.closingTime !== undefined) data.closingTime = payload.closingTime;
    if (payload.phoneNumber !== undefined) data.phoneNumber = payload.phoneNumber;

    if (payload.products !== undefined) {
      data.products = buildProductRelationUpdate(existingProducts, payload.products);
    }

    return prisma.store.update({
      where: { id: storeId },
      data,
      include: storeWithProductsInclude,
    });
  },

  deleteById(storeId: number): Promise<Store> {
    return prisma.store.delete({
      where: { id: storeId },
    });
  },
};
