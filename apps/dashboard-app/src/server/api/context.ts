import { auth } from '../auth';
import { prisma } from '../prisma';
import stripe from '../stripe';
import { getAuth } from '@clerk/nextjs/server';

export interface Context {
	auth: ReturnType<typeof getAuth>;
	prisma: typeof prisma;
	stripe: typeof stripe;
}

export async function createContext(): Promise<Context> {
	const authData = await auth();
	return {
		auth: authData,
		prisma,
		stripe
	};
}

