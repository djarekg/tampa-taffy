import { PrismaClient } from '#app/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:../../packages/db/dev.db',
});
const prisma = new PrismaClient({ adapter });

export default prisma;
