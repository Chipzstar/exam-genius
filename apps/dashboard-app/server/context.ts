import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { getAuth } from '@clerk/nextjs/server';
import type { SignedInAuthObject, SignedOutAuthObject } from '@clerk/nextjs/dist/api';
import prisma from './prisma';
import stripe from './stripe';
import { NextApiRequest, NextApiResponse } from 'next';

interface AuthContext {
	auth: SignedInAuthObject | SignedOutAuthObject;
	req: NextApiRequest;
	res: NextApiResponse;
}

export const createContextInner = async ({ auth, res, req }: AuthContext) => {
	return {
		auth,
		prisma,
		stripe,
		req,
        res
	};
};

export const createContext = async (opts: trpcNext.CreateNextContextOptions) => {
	const { req, res } = opts;
	return await createContextInner({
		auth: getAuth(opts.req),
		req,
		res
	});
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
