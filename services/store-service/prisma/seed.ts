import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const ownerUserId = 'seed-user-1';
  const category = await prisma.category.upsert({
    where: {
      name: 'General Store',
    },
    update: {},
    create: {
      name: 'General Store',
    },
  });
  const existing = await prisma.store.findUnique({ where: { ownerUserId } });

  if (existing) {
    return;
  }

  await prisma.store.create({
    data: {
      ownerUserId,
      name: 'Seed Store',
      location: 'Karachi',
      rating: '0',
      image: 'data:image/png;base64,aGVsbG8=',
      badges: ['Seed', 'Demo'],
      delivery: '25-35 min',
      minOrderRs: '500',
      openingTime: '09:00',
      closingTime: '22:00',
      phoneNumber: '+923000000000',
      category: {
        connect: {
          id: category.id,
        },
      },
      products: {
        create: [
          {
            name: 'Milk 1L',
            price: '320',
            image: 'https://example.com/products/milk.jpg',
            tag: 'Dairy',
          },
        ],
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
