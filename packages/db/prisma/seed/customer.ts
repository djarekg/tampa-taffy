import type { PrismaClient } from '#app/generated/prisma/client.ts';
import { faker } from './faker-context.ts';
import { getState } from './state.ts';

export const createCustomers = async (prisma: PrismaClient) => {
  console.log('Seeding Customer...');

  const { randomStateId } = await getState(prisma);

  const newCustomers = Array.from({ length: 120 }).map(() => {
    return {
      id: faker.string.uuid(),
      name: faker.company.name(),
      streetAddress: faker.location.streetAddress(),
      streetAddress2: faker.location.secondaryAddress(),
      city: faker.location.city(),
      stateId: randomStateId(),
      zip: faker.location.zipCode({ format: '#####' }),
      phone: faker.phone.number({ style: 'national' }),
      isActive: faker.datatype.boolean(0.8),
    };
  });

  await prisma.customer.createMany({ data: newCustomers });
};
