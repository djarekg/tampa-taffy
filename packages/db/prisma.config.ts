import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    path: './prisma/migrations',
    seed: 'bun prisma/seed/seed.ts',
  },
  datasource: {
    // Prefer DIRECT TCP via DATABASE_URL
    // url: env('DATABASE_URL'),
    url: process.env.DATABASE_URL!,
    shadowDatabaseUrl: process.env.DIRECT_URL!,
    // Optional directUrl moved from schema
    // Optionally support shadow DB if present:
    // shadowDatabaseUrl: env('SHADOW_DATABASE_URL'),
  },
});
