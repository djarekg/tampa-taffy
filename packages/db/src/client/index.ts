import { PrismaClient } from '#app/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

export type PrismaClientFactoryOptions = {
  url?: string;
};

/**
 * Create a new PrismaClient instance.
 *
 * @param options - Options for creating the PrismaClient. If no URL is provided,
 * it will use the DATABASE_URL environment variable.
 * @return A new PrismaClient instance.
 */
export const createPrismaClient = (options: PrismaClientFactoryOptions = {}) => {
  const resolvedUrl = options.url ?? process.env.DATABASE_URL;

  if (!resolvedUrl) {
    throw new Error(
      '[tt/db] Missing database url. Provide { url } to createPrismaClient(...) or set DATABASE_URL.'
    );
  }

  const adapter = new PrismaLibSql({
    url: resolvedUrl,
  });

  return new PrismaClient({ adapter });
};
