import type { PrismaClient } from '#app/generated/prisma/client.ts';

export const createUserFTS = async (prisma: PrismaClient) => {
  console.log('Create User FTS...');

  // Create the FTS virtual table for User
  await prisma.$executeRawUnsafe(`
    CREATE VIRTUAL TABLE User_Fts USING fts5(id, firstName, lastName, email, jobTitle, tokenize='trigram');
  `);

  console.log(`Created User_Fts virtual table`);

  // Seed the FTS table with existing User data
  await prisma.$executeRawUnsafe(`
    INSERT INTO User_Fts (rowid, id, firstName, lastName, email, jobTitle)
    SELECT rowid, id, firstName, lastName, email, jobTitle FROM User;
  `);

  console.log('Seeded User_Fts with existing data');

  // Create triggers to keep the FTS table in sync with the User table
  await prisma.$executeRawUnsafe(`
    CREATE TRIGGER update_user_fts_after_update
      AFTER UPDATE OF firstName, lastName, email, jobTitle ON User
      FOR EACH ROW
      WHEN
        OLD.firstName <> NEW.firstName
        OR OLD.lastName <> NEW.lastName
        OR OLD.email <> NEW.email
        OR OLD.jobTitle <> NEW.jobTitle
      BEGIN
        UPDATE User_Fts
        SET firstName = NEW.firstName,
            lastName = NEW.lastName,
            email = NEW.email,
            jobTitle = NEW.jobTitle
        WHERE rowid = NEW.rowid;
      END;

      CREATE TRIGGER update_user_fts_after_insert
      AFTER INSERT ON User
      FOR EACH ROW
      BEGIN
        INSERT INTO User_Fts (id, firstName, lastName, email, jobTitle)
        VALUES (NEW.id, NEW.firstName, NEW.lastName, NEW.email, NEW.jobTitle);
      END;

      CREATE TRIGGER update_user_fts_after_delete
      AFTER DELETE ON User
      FOR EACH ROW
      BEGIN
        DELETE FROM User_Fts
        WHERE rowid = OLD.rowid;
      END;
  `);

  console.log('User FTS setup complete');
};
