import type { PrismaClient } from '#app/generated/prisma/client.ts';
import type { CustomerContactCreateManyInput } from '#app/index';
import { faker } from './faker-context.ts';
import { getState } from './state.ts';

export const createCustomerContacts = async (prisma: PrismaClient) => {
  console.log('Seeding CustomerContact...');

  // A wait is need for previous seeding to complete
  await new Promise(resolve => setTimeout(() => resolve(true)));

  const customers = await prisma.customer.findMany({
    select: {
      id: true,
    },
  });

  if (customers.length === 0) {
    console.warn('No customers found. Skipping customer contact seeding.');
    return;
  }

  const customerIds = customers.map(customer => customer.id);
  const customerContacts: CustomerContactCreateManyInput[] = [];

  for (let i = 0, len = customerIds.length; i < len; i++) {
    const customerId = customerIds[i];
    const { randomStateId } = await getState(prisma);

    const createCustomerContact = () =>
      customerContacts.push({
        id: faker.string.uuid(),
        customerId,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        streetAddress: faker.location.streetAddress(),
        streetAddress2: faker.location.secondaryAddress(),
        city: faker.location.city(),
        stateId: randomStateId(),
        zip: faker.location.zipCode({ format: '#####' }),
        phone: faker.phone.number({ style: 'national' }),
        imageId: faker.number.int({ min: 1, max: 99 }),
        isActive: faker.datatype.boolean(0.8),
      });

    Array.from({ length: 10 }).forEach(() => createCustomerContact());
  }

  await prisma.customerContact.createMany({ data: customerContacts });
};
