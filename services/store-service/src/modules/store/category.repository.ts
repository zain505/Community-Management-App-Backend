import type { Prisma, Category } from '../../generated/prisma';
import { prisma } from '../../lib/prisma';

const categorySelect = {
  id: true,
  name: true,
} satisfies Prisma.CategorySelect;

const categoryWithStoreCountSelect = {
  id: true,
  name: true,
  _count: {
    select: {
      stores: true,
    },
  },
} satisfies Prisma.CategorySelect;

export type StoreCategoryRecord = Prisma.CategoryGetPayload<{
  select: typeof categorySelect;
}>;

export type StoreCategoryWithStoreCountRecord = Prisma.CategoryGetPayload<{
  select: typeof categoryWithStoreCountSelect;
}>;

export const categoryRepository = {
  list(): Promise<StoreCategoryRecord[]> {
    return prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
      select: categorySelect,
    });
  },

  findById(categoryId: number): Promise<StoreCategoryRecord | null> {
    return prisma.category.findUnique({
      where: { id: categoryId },
      select: categorySelect,
    });
  },

  findByName(name: string): Promise<StoreCategoryRecord | null> {
    return prisma.category.findUnique({
      where: { name },
      select: categorySelect,
    });
  },

  findByIdWithStoreCount(categoryId: number): Promise<StoreCategoryWithStoreCountRecord | null> {
    return prisma.category.findUnique({
      where: { id: categoryId },
      select: categoryWithStoreCountSelect,
    });
  },

  create(name: string): Promise<StoreCategoryRecord> {
    return prisma.category.create({
      data: { name },
      select: categorySelect,
    });
  },

  update(categoryId: number, name: string): Promise<StoreCategoryRecord> {
    return prisma.category.update({
      where: { id: categoryId },
      data: { name },
      select: categorySelect,
    });
  },

  deleteById(categoryId: number): Promise<Category> {
    return prisma.category.delete({
      where: { id: categoryId },
    });
  },
};
