import { Color, type PrismaClient, ProductType } from '#app/generated/prisma/client.ts';

export const createProductColors = async (prisma: PrismaClient) => {
  console.log('Seeding ProductColor...');

  // A wait is need for previous seeding to complete
  await new Promise(resolve => setTimeout(() => resolve(true)));

  const createProductColors = async () =>
    prisma.productColor.createMany({
      data: [
        {
          productId: (await prisma.product.findFirst({
            where: { productType: ProductType.DRESS },
          }))!.id,
          color: Color.BLACK,
        },
        {
          productId: (await prisma.product.findFirst({
            where: { productType: ProductType.HAT },
          }))!.id,
          color: Color.GREEN,
        },
        {
          productId: (await prisma.product.findFirst({
            where: { productType: ProductType.HOODIE },
          }))!.id,
          color: Color.BLUE,
        },
        {
          productId: (await prisma.product.findFirst({
            where: { productType: ProductType.JACKET },
          }))!.id,
          color: Color.PINK,
        },
        {
          productId: (await prisma.product.findFirst({
            where: { productType: ProductType.PANTS },
          }))!.id,
          color: Color.BLUE,
        },
        {
          productId: (await prisma.product.findFirst({
            where: { productType: ProductType.SHIRT },
          }))!.id,
          color: Color.RED,
        },
        {
          productId: (await prisma.product.findFirst({
            where: { productType: ProductType.SHOES },
          }))!.id,
          color: Color.WHITE,
        },
        {
          productId: (await prisma.product.findFirst({
            where: { productType: ProductType.SHORTS },
          }))!.id,
          color: Color.YELLOW,
        },
        {
          productId: (await prisma.product.findFirst({
            where: { productType: ProductType.SOCKS },
          }))!.id,
          color: Color.WHITE,
        },
        {
          productId: (await prisma.product.findFirst({
            where: { productType: ProductType.SWEATER },
          }))!.id,
          color: Color.BLACK,
        },
        {
          productId: (await prisma.product.findFirst({
            where: { productType: ProductType.UNDERWEAR },
          }))!.id,
          color: Color.ORANGE,
        },
      ],
    });

  await createProductColors();
};
