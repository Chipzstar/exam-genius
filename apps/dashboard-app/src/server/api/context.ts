import { auth } from '../auth';
import { prisma } from '../prisma';
import stripe from '../stripe';
import type { AuthObject } from '@clerk/backend';

export interface Context {
	auth: AuthObject;
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

