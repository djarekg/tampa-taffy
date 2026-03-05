import type { PrismaClient } from '#app/generated/prisma/client.ts';

export const createProductFTS = async (prisma: PrismaClient) => {
  console.log('Create Product FTS...');

  // Create the FTS virtual table for Product
  await prisma.$executeRawUnsafe(`
    CREATE VIRTUAL TABLE Product_Fts USING fts5(id, name, description, tokenize='trigram');
  `);

  console.log(`Created Product_Fts virtual table`);

  // Seed the FTS table with existing Product data
  await prisma.$executeRawUnsafe(`
    INSERT INTO Product_Fts (rowid, id, name, description)
    SELECT rowid, id, name, description FROM Product;
  `);

  console.log('Seeded Product_Fts with existing data');

  // Create triggers to keep the FTS table in sync with the Product table
  await prisma.$executeRawUnsafe(`
    CREATE TRIGGER update_product_fts_after_update
      AFTER UPDATE OF name, description ON Product
      FOR EACH ROW
      WHEN OLD.name <> NEW.name OR OLD.description <> NEW.description
      BEGIN
        UPDATE Product_Fts
        SET name = NEW.name,
            description = NEW.description
        WHERE rowid = NEW.rowid;
      END;

      CREATE TRIGGER update_product_fts_after_insert
      AFTER INSERT ON Product
      FOR EACH ROW
      BEGIN
        INSERT INTO Product_Fts (id, name, description)
        VALUES (NEW.id, NEW.name, NEW.description);
      END;

      CREATE TRIGGER update_product_fts_after_delete
      AFTER DELETE ON Product
      FOR EACH ROW
      BEGIN
        DELETE FROM Product_Fts
        WHERE rowid = OLD.rowid;
      END;
  `);

  console.log('Product FTS setup complete');
};
