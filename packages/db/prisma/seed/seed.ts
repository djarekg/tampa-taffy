// import prisma from '#app/client/index.ts';
import { createProductColors } from '#prisma/seed/product-color.ts';
import { createProductInventories } from '#prisma/seed/product-inventory.ts';
import { createProductSales } from '#prisma/seed/product-sale.ts';
import { createProducts } from '#prisma/seed/product.ts';
import { createUserCredential } from '#prisma/seed/user-credential.ts';
import { createCustomerContacts } from './customer-contact.ts';
import { createCustomers } from './customer.ts';
import { createStates } from './state.ts';
import { createUsers } from './user.ts';
import { createPrismaClient } from '#app/client/index.ts';

const prisma = createPrismaClient();

const load = async () => {
  // await reset(prisma);
  await createStates(prisma);
  await createUsers(prisma);
  await createUserCredential(prisma);
  await createCustomers(prisma);
  await createCustomerContacts(prisma);
  await createProducts(prisma);
  await createProductColors(prisma);
  await createProductInventories(prisma);
  await createProductSales(prisma);
};

load()
  .then(() => {
    console.log('Seed completed');
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    // Disconnecting needs to wait at least 1 second to ensure all
    // operations are completed.
    setTimeout(async () => {
      await prisma.$disconnect();
    }, 1000);
  });
