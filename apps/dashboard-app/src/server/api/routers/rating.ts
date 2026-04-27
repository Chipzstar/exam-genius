import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure, rateLimited } from '../trpc';

const ratingRouter = createTRPCRouter({
	submitPaper: protectedProcedure
		.use(rateLimited('rating_submit'))
		.input(
			z.object({
				paperId: z.string(),
				stars: z.number().min(1).max(5),
				comment: z.string().max(2000).optional(),
				dimensions: z.record(z.string(), z.unknown()).optional()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const paper = await ctx.prisma.paper.findFirst({
				where: { paper_id: input.paperId, user_id: ctx.auth.userId }
			});
			if (!paper) throw new TRPCError({ code: 'NOT_FOUND' });
			return ctx.prisma.paperRating.upsert({
				where: { paper_id: input.paperId },
				create: {
					paper_id: input.paperId,
					stars: input.stars,
					comment: input.comment,
					dimensions: input.dimensions ?? undefined
				},
				update: {
					stars: input.stars,
					comment: input.comment,
					dimensions: input.dimensions ?? undefined
				}
			});
		}),

	submitQuestion: protectedProcedure
		.use(rateLimited('rating_submit'))
		.input(
			z.object({
				questionId: z.string(),
				sentiment: z.union([z.literal(-1), z.literal(1)]),
				reason_tags: z.array(z.string()).max(10).default([]),
				note: z.string().max(1000).optional()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const q = await ctx.prisma.question.findFirst({
				where: { question_id: input.questionId, paper: { user_id: ctx.auth.userId } }
			});
			if (!q) throw new TRPCError({ code: 'NOT_FOUND' });
			return ctx.prisma.questionFeedback.upsert({
				where: {
					user_id_question_id: {
						user_id: ctx.auth.userId,
						question_id: input.questionId
					}
				},
				create: {
					question_id: input.questionId,
					user_id: ctx.auth.userId,
					sentiment: input.sentiment,
					reason_tags: input.reason_tags,
					note: input.note
				},
				update: {
					sentiment: input.sentiment,
					reason_tags: input.reason_tags,
					note: input.note
				}
			});
		})
});

export default ratingRouter;
