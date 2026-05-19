import { withAccelerate } from '@prisma/extension-accelerate';
import { PrismaClient } from '@exam-genius/shared/prisma';
import { env } from '~/env';

function createPrismaClient() {
	return new PrismaClient({
		accelerateUrl: env.DATABASE_URL,
		log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
	}).$extends(withAccelerate());
}
type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

const globalForDb = globalThis as unknown as {
	prisma: ExtendedPrismaClient | undefined;
};

export const prisma = globalForDb.prisma ?? createPrismaClient();
export type AppPrismaClient = typeof prisma;

if (process.env.NODE_ENV !== 'production') globalForDb.prisma = prisma;
