import { createPrismaClient } from '@tt/db/client';
import { DATABASE_URL } from '#app/config.ts';

const prisma = createPrismaClient({ url: DATABASE_URL });

export default prisma;
