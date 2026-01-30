import { type PrismaClient, ProductType, Size } from '#app/generated/prisma/client.ts';

export const createProductInventories = async (prisma: PrismaClient) => {
  console.log('Seeding ProductInventory...');

  const idCache: Record<ProductType, string> = {} as Record<ProductType, string>;
  const getProductId = async (type: ProductType) => {
    if (!idCache[type]) {
      idCache[type] = (await prisma.product.findFirst({ where: { productType: type } }))!.id;
    }
    return idCache[type];
  };

  const createInventories = async () =>
    prisma.productInventory.createMany({
      data: [
        {
          productId: await getProductId(ProductType.DRESS),
          size: Size.XSMALL,
          quantity: 10,
        },
        {
          productId: await getProductId(ProductType.DRESS),
          size: Size.SMALL,
          quantity: 8,
        },
        {
          productId: await getProductId(ProductType.DRESS),
          size: Size.MEDIUM,
          quantity: 2,
        },
        {
          productId: await getProductId(ProductType.DRESS),
          size: Size.LARGE,
          quantity: 13,
        },
        {
          productId: await getProductId(ProductType.DRESS),
          size: Size.XLARGE,
          quantity: 10,
        },
        {
          productId: await getProductId(ProductType.DRESS),
          size: Size.XXLARGE,
          quantity: 10,
        },
        {
          productId: await getProductId(ProductType.DRESS),
          size: Size.XXXLARGE,
          quantity: 4,
        },
        {
          productId: await getProductId(ProductType.DRESS),
          size: Size.XSMALL,
          quantity: 44,
        },
        {
          productId: await getProductId(ProductType.HAT),
          size: Size.ONESIZE,
          quantity: 33,
        },
        {
          productId: await getProductId(ProductType.HOODIE),
          size: Size.SMALL,
          quantity: 10,
        },
        {
          productId: await getProductId(ProductType.JACKET),
          size: Size.MEDIUM,
          quantity: 10,
        },
        {
          productId: await getProductId(ProductType.PANTS),
          size: Size.SMALL,
          quantity: 10,
        },
        {
          productId: await getProductId(ProductType.SHIRT),
          size: Size.SMALL,
          quantity: 2,
        },
        {
          productId: await getProductId(ProductType.SHORTS),
          size: Size.SMALL,
          quantity: 10,
        },
        {
          productId: await getProductId(ProductType.SHORTS),
          size: Size.SMALL,
          quantity: 9,
        },
        {
          productId: await getProductId(ProductType.SHORTS),
          size: Size.MEDIUM,
          quantity: 10,
        },
        {
          productId: await getProductId(ProductType.SHORTS),
          size: Size.LARGE,
          quantity: 3,
        },
        {
          productId: await getProductId(ProductType.SOCKS),
          size: Size.MEDIUM,
          quantity: 76,
        },
        {
          productId: await getProductId(ProductType.SWEATER),
          size: Size.SMALL,
          quantity: 4,
        },
        {
          productId: await getProductId(ProductType.SWEATER),
          size: Size.MEDIUM,
          quantity: 4,
        },
        {
          productId: await getProductId(ProductType.UNDERWEAR),
          size: Size.MEDIUM,
          quantity: 50,
        },
      ],
    });

  await createInventories();
};
