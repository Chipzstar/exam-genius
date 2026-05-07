import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure, rateLimited } from '../trpc';
import { referencesListTag } from '~/server/accelerate-cache-tags';

const referenceRouter = createTRPCRouter({
	list: protectedProcedure
		.input(z.object({ courseId: z.string().optional() }).optional())
		.query(async ({ ctx, input }) => {
			const userId = ctx.auth.userId as string;
			const listTag = referencesListTag(userId, input?.courseId);
			return ctx.prisma.paperReference.findMany({
				where: {
					user_id: userId,
					...(input?.courseId ? { course_id: input.courseId } : {})
				},
				orderBy: { created_at: 'desc' },
				cacheStrategy: { swr: 15, ttl: 30, tags: [listTag] }
			});
		}),

	remove: protectedProcedure
		.use(rateLimited('reference_upload'))
		.input(z.object({ referenceId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.auth.userId as string;
			const existing = await ctx.prisma.paperReference.findFirst({
				where: { reference_id: input.referenceId, user_id: userId },
				select: { course_id: true }
			});
			if (!existing) throw new TRPCError({ code: 'NOT_FOUND' });

			const r = await ctx.prisma.paperReference.deleteMany({
				where: { reference_id: input.referenceId, user_id: userId }
			});
			if (r.count === 0) throw new TRPCError({ code: 'NOT_FOUND' });
			await ctx.prisma.$accelerate.invalidate({
				tags: [referencesListTag(userId), referencesListTag(userId, existing.course_id)]
			});
			return { ok: true };
		})
});

export default referenceRouter;
