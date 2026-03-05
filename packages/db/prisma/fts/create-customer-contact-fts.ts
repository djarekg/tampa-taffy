import type { PrismaClient } from '#app/generated/prisma/client.ts';

export const createCustomerContactFTS = async (prisma: PrismaClient) => {
  console.log('Create CustomerContact FTS...');

  // Create the FTS virtual table for CustomerContact
  await prisma.$executeRawUnsafe(`
    CREATE VIRTUAL TABLE CustomerContact_Fts USING fts5(id, customerId, firstName, lastName, email, tokenize='trigram');
  `);

  console.log(`Created CustomerContact_Fts virtual table`);

  // Seed the FTS table with existing CustomerContact data
  await prisma.$executeRawUnsafe(`
    INSERT INTO CustomerContact_Fts (rowid, id, customerId, firstName, lastName, email)
    SELECT rowid, id, customerId, firstName, lastName, email FROM CustomerContact;
  `);

  console.log('Seeded CustomerContact_Fts with existing data');

  // Create triggers to keep the FTS table in sync with the CustomerContact table
  await prisma.$executeRawUnsafe(`
    CREATE TRIGGER update_customer_contact_fts_after_update
      AFTER UPDATE OF firstName, lastName, email ON CustomerContact
      FOR EACH ROW
      WHEN
        OLD.firstName <> NEW.firstName
        OR OLD.lastName <> NEW.lastName
        OR OLD.email <> NEW.email
      BEGIN
        UPDATE CustomerContact_Fts
        SET firstName = NEW.firstName,
            lastName = NEW.lastName,
            email = NEW.email
        WHERE rowid = NEW.rowid;
      END;

      CREATE TRIGGER update_customer_contact_fts_after_insert
      AFTER INSERT ON CustomerContact
      FOR EACH ROW
      BEGIN
        INSERT INTO CustomerContact_Fts (id, customerId, firstName, lastName, email)
        VALUES (NEW.id, NEW.customerId, NEW.firstName, NEW.lastName, NEW.email);
      END;

      CREATE TRIGGER update_customer_contact_fts_after_delete
      AFTER DELETE ON CustomerContact
      FOR EACH ROW
      BEGIN
        DELETE FROM CustomerContact_Fts
        WHERE rowid = OLD.rowid;
      END;
  `);

  console.log('CustomerContact FTS setup complete');
};
