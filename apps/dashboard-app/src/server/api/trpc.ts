import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './context';
import superjson from 'superjson';
import { enforceRateLimit } from '~/server/ratelimit';
import type { RateLimitFeature } from '~/server/plans';
import type { UserPlanKey } from '~/server/plans';

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

export function rateLimited(feature: RateLimitFeature) {
	return t.middleware(async ({ next, ctx }) => {
		if (!ctx.auth.userId) throw new TRPCError({ code: 'UNAUTHORIZED' });
		const user = await ctx.prisma.user.findUnique({
			where: { clerk_id: ctx.auth.userId },
			select: { plan: true }
		});
		const plan = (user?.plan ?? 'free') as UserPlanKey;
		const gate = await enforceRateLimit(ctx.auth.userId, plan, feature);
		if (!gate.ok) {
			throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: gate.message });
		}
		return next({ ctx: { ...ctx, auth: ctx.auth } });
	});
}

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const adminProcedure = t.procedure;

export const createCallerFactory = t.createCallerFactory;
export { createContext as createTRPCContext } from './context';

