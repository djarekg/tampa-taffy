import { generateHash } from '#app/crypto/hash.ts';
import type { PrismaClient } from '#app/generated/prisma/client.ts';
import { Role } from '#app/generated/prisma/enums.ts';
import { faker } from './faker-context.ts';

export const createUserCredential = async (prisma: PrismaClient) => {
  console.log('Seeding UserCredential...');

  const adminUserIds = await prisma.user.findMany({
    select: {
      id: true,
    },
    where: {
      firstName: 'Admin',
    },
  });

  const createAdminCredential = () =>
    prisma.userCredential.createMany({
      data: adminUserIds.map(({ id }) => ({
        id: faker.string.uuid(),
        userId: id,
        password: generateHash('admin'),
        role: Role.ADMIN,
      })),
    });

  const userIds: { id: string }[] = await prisma.user.findMany({
    select: {
      id: true,
    },
    where: {
      firstName: {
        not: 'Admin',
      },
    },
  });

  const createUsersCredential = () =>
    prisma.userCredential.createMany({
      data: userIds.map(({ id }) => ({
        id: faker.string.uuid(),
        userId: id,
        password: generateHash(faker.internet.password()),
        role: faker.helpers.enumValue(Role),
      })),
    });

  await createAdminCredential();
  await createUsersCredential();
};
