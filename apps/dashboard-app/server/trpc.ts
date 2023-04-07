import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './context';
import superjson from 'superjson';

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
	transformer: superjson,
	errorFormatter({ shape }) {
		return shape;
	}
});

// check if the user is signed in, otherwise through a UNAUTHORIZED CODE
const isAuthed = t.middleware(({ next, ctx }) => {
	if (!ctx.auth.userId) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}
	return next({
		ctx: {
			auth: ctx.auth
		}
	});
});
// Base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;
// export this procedure to be used anywhere in your application
export const protectedProcedure = t.procedure.use(isAuthed);
export const adminProcedure = t.procedure;
