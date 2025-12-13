import { env } from '~/env';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@exam-genius/shared/prisma';

const connectionString = `${env.DATABASE_URL}`;
const adapter = new PrismaNeon({ connectionString });


const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
