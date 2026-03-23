import type { Prisma } from '../../generated/prisma';
import { prisma } from '../../lib/prisma';

const PRODUCTS_PER_PAGE = 10;

const productSelect = {
  id: true,
  name: true,
  price: true,
  image: true,
  tag: true,
  storeId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.StoreProductSelect;

export type ProductRecord = Prisma.StoreProductGetPayload<{
  select: typeof productSelect;
}>;

interface CreateProductRecordInput {
  id?: string;
  name: string;
  price: string;
  image: string;
  tag?: string;
}

interface UpdateProductRecordInput {
  name?: string;
  price?: string;
  image?: string;
  tag?: string;
}

export const productRepository = {
  listByStoreId(storeId: number, search?: string, page = 1): Promise<ProductRecord[]> {
    return prisma.storeProduct.findMany({
      where: {
        storeId,
        ...(search
          ? {
              name: {
                contains: search,
              },
            }
          : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * PRODUCTS_PER_PAGE,
      take: PRODUCTS_PER_PAGE,
      select: productSelect,
    });
  },

  findByIdForStore(productId: string, storeId: number): Promise<ProductRecord | null> {
    return prisma.storeProduct.findFirst({
      where: {
        id: productId,
        storeId,
      },
      select: productSelect,
    });
  },

  createForStore(storeId: number, payload: CreateProductRecordInput): Promise<ProductRecord> {
    const data: Prisma.StoreProductUncheckedCreateInput = {
      name: payload.name,
      price: payload.price,
      image: payload.image,
      tag: payload.tag,
      storeId,
    };

    if (payload.id) {
      data.id = payload.id;
    }

    return prisma.storeProduct.create({
      data,
      select: productSelect,
    });
  },

  updateById(productId: string, payload: UpdateProductRecordInput): Promise<ProductRecord> {
    const data: Prisma.StoreProductUpdateInput = {};

    if (payload.name !== undefined) data.name = payload.name;
    if (payload.price !== undefined) data.price = payload.price;
    if (payload.image !== undefined) data.image = payload.image;
    if (payload.tag !== undefined) data.tag = payload.tag;

    return prisma.storeProduct.update({
      where: {
        id: productId,
      },
      data,
      select: productSelect,
    });
  },

  deleteById(productId: string): Promise<ProductRecord> {
    return prisma.storeProduct.delete({
      where: {
        id: productId,
      },
      select: productSelect,
    });
  },
};
