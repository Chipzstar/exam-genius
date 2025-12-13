import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './context';
import superjson from 'superjson';

const t = initTRPC.context<Context>().create({
	transformer: superjson,
	errorFormatter({ shape }) {
		return shape;
	}
});

const isAuthed = t.middleware(({ next, ctx }) => {
	if (!ctx.auth.userId) throw new TRPCError({ code: 'UNAUTHORIZED' });
	return next({
		ctx: {
			...ctx,
			auth: ctx.auth,
		}
	});
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const adminProcedure = t.procedure;

export const createCallerFactory = t.createCallerFactory;
export { createContext as createTRPCContext } from './context';

