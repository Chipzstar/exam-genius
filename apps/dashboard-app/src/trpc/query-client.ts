import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

export const makeQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 30 * 1000
			}
		}
	});

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
	if (typeof window === 'undefined') {
		return makeQueryClient();
	} else {
		if (!browserQueryClient) browserQueryClient = makeQueryClient();
		return browserQueryClient;
	}
}

