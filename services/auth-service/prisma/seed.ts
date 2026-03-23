import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/password';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const mobileNumber = '+923000000000';
  const existing = await prisma.user.findFirst({ where: { mobileNumber } });

  if (existing) {
    return;
  }

  await prisma.user.create({
    data: {
      mobileNumber,
      name: 'Community Admin',
      profile: {
        image: null,
      },
      passwordHash: await hashPassword('AdminPass123!'),
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
