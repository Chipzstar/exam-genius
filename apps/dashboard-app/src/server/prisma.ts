import { env } from '~/env';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@exam-genius/shared/prisma';

const globalForDb = globalThis as unknown as {
	prisma: PrismaClient | undefined;
	pgPool: Pool | undefined;
};

const pool =
	globalForDb.pgPool ??
	new Pool({
		connectionString: env.DATABASE_URL
	});

if (process.env.NODE_ENV !== 'production') {
	globalForDb.pgPool = pool;
}

const adapter = new PrismaPg(pool);

export const prisma =
	globalForDb.prisma ??
	new PrismaClient({
		adapter,
		log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
	});

if (process.env.NODE_ENV !== 'production') globalForDb.prisma = prisma;
