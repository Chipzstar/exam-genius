import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { type NextRequest } from 'next/server';
import { appRouter } from '~/server/api/routers/_app';
import { createContext } from '~/server/api/context';

const handler = (req: NextRequest) =>
	fetchRequestHandler({
		endpoint: '/api/trpc',
		req,
		router: appRouter,
		createContext: () => createContext(),
		onError:
			process.env.NODE_ENV === 'development'
				? ({ path, error }) => {
						console.error(`❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`);
					}
				: undefined,
	});

export { handler as GET, handler as POST };

