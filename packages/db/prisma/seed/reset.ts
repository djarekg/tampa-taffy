import type { PrismaClient } from '#app/generated/prisma/client.ts';

export const reset = async (prisma: PrismaClient) => {
  console.log('Clearing tables...');

  await prisma.state.deleteMany();
  await prisma.user.deleteMany();
  await prisma.userCredential.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.customerContact.deleteMany();
  await prisma.product.deleteMany();
  await prisma.productColor.deleteMany();
  await prisma.productInventory.deleteMany();
  await prisma.productSale.deleteMany();
};
