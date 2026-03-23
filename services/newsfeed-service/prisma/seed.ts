import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const existing = await prisma.newsFeedItem.findFirst({
    where: {
      type: 'STORE_CREATED',
      storeId: 1,
    },
  });

  if (existing) {
    return;
  }

  await prisma.newsFeedItem.create({
    data: {
      type: 'STORE_CREATED',
      title: 'New store: Seed Store',
      description: 'Seed Store joined the marketplace.',
      storeId: 1,
      storeName: 'Seed Store',
      metadata: {
        source: 'seed',
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error('Seed failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
