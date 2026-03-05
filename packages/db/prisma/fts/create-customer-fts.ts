import type { PrismaClient } from '#app/generated/prisma/client.ts';

export const createCustomerFTS = async (prisma: PrismaClient) => {
  console.log('Create Customer FTS...');

  // Create the FTS virtual table for Customer
  await prisma.$executeRawUnsafe(`
    CREATE VIRTUAL TABLE Customer_Fts USING fts5(id, name, tokenize='trigram');
  `);

  console.log(`Created Customer_Fts virtual table`);

  // Seed the FTS table with existing Customer data
  await prisma.$executeRawUnsafe(`
    INSERT INTO Customer_Fts (rowid, id, name)
    SELECT rowid, id, name FROM Customer;
  `);

  console.log('Seeded Customer_Fts with existing data');

  // Create triggers to keep the FTS table in sync with the Customer table
  await prisma.$executeRawUnsafe(`
    CREATE TRIGGER update_customer_fts_after_update
      AFTER UPDATE OF name ON Customer
      FOR EACH ROW
      WHEN
        OLD.name <> NEW.name
      BEGIN
        UPDATE Customer_Fts
        SET name = NEW.name,
            city = NEW.city,
            phone = NEW.phone
        WHERE rowid = NEW.rowid;
      END;

      CREATE TRIGGER update_customer_fts_after_insert
      AFTER INSERT ON Customer
      FOR EACH ROW
      BEGIN
        INSERT INTO Customer_Fts (id, name)
        VALUES (NEW.id, NEW.name);
      END;

      CREATE TRIGGER update_customer_fts_after_delete
      AFTER DELETE ON Customer
      FOR EACH ROW
      BEGIN
        DELETE FROM Customer_Fts
        WHERE rowid = OLD.rowid;
      END;
  `);

  console.log('Customer FTS setup complete');
};
