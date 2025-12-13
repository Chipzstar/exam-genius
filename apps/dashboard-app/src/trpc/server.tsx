import 'server-only';

import { createCallerFactory, createTRPCContext } from '~/server/api/trpc';
import { appRouter } from '~/server/api/routers/_app';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from './query-client';

const createCaller = createCallerFactory(appRouter);

export async function api() {
	return createCaller(await createTRPCContext());
}

export function HydrateClient(props: { children: React.ReactNode }) {
	const queryClient = getQueryClient();
	return <HydrationBoundary state={dehydrate(queryClient)}>{props.children}</HydrationBoundary>;
}

