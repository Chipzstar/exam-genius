'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { loggerLink, httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import superjson from 'superjson';
import type { AppRouter } from '~/server/api/routers/_app';
import { getQueryClient } from './query-client';

function getBaseUrl() {
	if (typeof window !== 'undefined') return '';
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
	if (process.env.RENDER_INTERNAL_HOSTNAME)
		return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
	return `http://localhost:${process.env.PORT ?? 4200}`;
}

export const api = createTRPCReact<AppRouter>();

export function TRPCReactProvider(props: { children: React.ReactNode }) {
	const queryClient = getQueryClient();

	return (
		<api.Provider client={api.createClient({
			links: [
				loggerLink({
					enabled: (opts) =>
						process.env.NODE_ENV === 'development' ||
						(opts.direction === 'down' && opts.result instanceof Error),
				}),
				httpBatchLink({
					url: `${getBaseUrl()}/api/trpc`,
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

