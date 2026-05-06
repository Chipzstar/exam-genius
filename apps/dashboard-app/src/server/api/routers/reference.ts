import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure, rateLimited } from '../trpc';

const referenceRouter = createTRPCRouter({
	list: protectedProcedure
		.input(z.object({ courseId: z.string().optional() }).optional())
		.query(async ({ ctx, input }) => {
			return ctx.prisma.paperReference.findMany({
				where: {
					user_id: ctx.auth.userId,
					...(input?.courseId ? { course_id: input.courseId } : {})
				},
				orderBy: { created_at: 'desc' },
				cacheStrategy: { swr: 60, ttl: 120 }
			});
		}),

	remove: protectedProcedure
		.use(rateLimited('reference_upload'))
		.input(z.object({ referenceId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const r = await ctx.prisma.paperReference.deleteMany({
				where: { reference_id: input.referenceId, user_id: ctx.auth.userId }
			});
			if (r.count === 0) throw new TRPCError({ code: 'NOT_FOUND' });
			return { ok: true };
		})
});

export default referenceRouter;
