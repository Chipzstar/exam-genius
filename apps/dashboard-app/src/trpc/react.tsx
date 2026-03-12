'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { loggerLink, httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import superjson from 'superjson';
import type { AppRouter } from '~/server/api/routers/_app';
import { getQueryClient } from './query-client';

export const api = createTRPCReact<AppRouter>();

export function TRPCReactProvider(props: {
	children: React.ReactNode;
	/** Base URL from server (e.g. https://vercel.app). Empty string = relative URLs (client). */
	baseUrl?: string;
}) {
	const queryClient = getQueryClient();
	const baseUrl = props.baseUrl ?? '';

	return (
		<api.Provider client={api.createClient({
			links: [
				loggerLink({
					enabled: (opts) =>
						process.env.NODE_ENV === 'development' ||
						(opts.direction === 'down' && opts.result instanceof Error),
				}),
				httpBatchLink({
					url: `${baseUrl}/api/trpc`,
					transformer: superjson,
				}),
			],
		})} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				{props.children}
			</QueryClientProvider>
		</api.Provider>
	);
}

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

