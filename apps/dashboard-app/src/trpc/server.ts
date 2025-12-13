import 'server-only';

import { createCallerFactory, createTRPCContext } from '~/server/api/trpc';
import { appRouter } from '~/server/api/routers/_app';

const createCaller = createCallerFactory(appRouter);

export async function api() {
	return createCaller(await createTRPCContext());
}

