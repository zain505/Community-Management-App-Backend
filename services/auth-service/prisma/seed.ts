import type { Prisma } from '../src/generated/prisma';
import { PrismaClient } from '../src/generated/prisma';
import { hashPassword, verifyPassword } from '../src/lib/password';

const prisma = new PrismaClient();
const defaultSuperAdmin = {
  mobileNumber: '03074029959',
  name: 'Super Admin',
  usertype: 0,
  isActive: true,
  password: 'root',
} as const;
const legacyDefaultMobileNumbers = ['+923000000000'] as const;
const legacyDefaultPassword = 'AdminPass123!';

async function shouldResetDefaultPassword(passwordHash: string): Promise<boolean> {
  if (await verifyPassword(defaultSuperAdmin.password, passwordHash)) {
    return false;
  }

  return verifyPassword(legacyDefaultPassword, passwordHash);
}

async function main(): Promise<void> {
  const existingUsers = await prisma.user.findMany({
    where: {
      mobileNumber: {
        in: [defaultSuperAdmin.mobileNumber, ...legacyDefaultMobileNumbers],
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
  const existing =
    existingUsers.find((user) => user.mobileNumber === defaultSuperAdmin.mobileNumber) ??
    existingUsers[0];

  if (!existing) {
    await prisma.user.create({
      data: {
        mobileNumber: defaultSuperAdmin.mobileNumber,
        name: defaultSuperAdmin.name,
        usertype: defaultSuperAdmin.usertype,
        isActive: defaultSuperAdmin.isActive,
        profile: {
          image: null,
        },
        passwordHash: await hashPassword(defaultSuperAdmin.password),
      },
    });

    return;
  }

  const updateData: Prisma.UserUpdateInput = {};

  if (existing.name !== defaultSuperAdmin.name) {
    updateData.name = defaultSuperAdmin.name;
  }

  if (existing.mobileNumber !== defaultSuperAdmin.mobileNumber) {
    updateData.mobileNumber = defaultSuperAdmin.mobileNumber;
  }

  if (existing.usertype !== defaultSuperAdmin.usertype) {
    updateData.usertype = defaultSuperAdmin.usertype;
  }

  if (existing.isActive !== defaultSuperAdmin.isActive) {
    updateData.isActive = defaultSuperAdmin.isActive;
  }

  if (await shouldResetDefaultPassword(existing.passwordHash)) {
    updateData.passwordHash = await hashPassword(defaultSuperAdmin.password);
  }

  if (Object.keys(updateData).length === 0) {
    return;
  }

  await prisma.user.update({
    where: { id: existing.id },
    data: updateData,
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
