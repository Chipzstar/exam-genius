import { withAccelerate } from '@prisma/extension-accelerate';
import { PrismaClient } from '@exam-genius/shared/prisma';
import { env } from '~/env';

function createPrismaClient() {
	return new PrismaClient({
		accelerateUrl: env.DATABASE_URL,
		log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
	}).$extends(withAccelerate());
}

const globalForDb = globalThis as unknown as {
	prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForDb.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForDb.prisma = prisma;
