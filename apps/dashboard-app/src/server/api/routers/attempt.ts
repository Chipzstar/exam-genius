import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure, rateLimited } from '../trpc';
import { genID } from '~/utils/functions';
import { backendApi } from '~/server/backend-headers';
import { getLatestForPaperOutputSchema } from '~/server/schemas/get-latest-for-paper.schema';

const attemptRouter = createTRPCRouter({
	getLatestForPaper: protectedProcedure
		.input(z.object({ paperId: z.string() }))
		.output(getLatestForPaperOutputSchema)
		.query(async ({ ctx, input }) => {
			const row = await ctx.prisma.attempt.findFirst({
				where: { paper_id: input.paperId, user_id: ctx.auth.userId },
				orderBy: { started_at: 'desc' },
				include: { answers: true }
			});
			return getLatestForPaperOutputSchema.parse(row);
		}),

	start: protectedProcedure
		.input(
			z.object({
				paperId: z.string(),
				mode: z.enum(['mock', 'study']).default('mock'),
				timeLimitSec: z.number().optional()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const paper = await ctx.prisma.paper.findFirst({
				where: { paper_id: input.paperId, user_id: ctx.auth.userId }
			});
			if (!paper) throw new TRPCError({ code: 'NOT_FOUND' });

			const existing = await ctx.prisma.attempt.findFirst({
				where: {
					paper_id: input.paperId,
					user_id: ctx.auth.userId,
					status: 'in_progress'
				}
			});
			if (existing) return existing;

			const attempt_id = genID('attempt');
			const attempt = await ctx.prisma.attempt.create({
				data: {
					attempt_id,
					paper_id: input.paperId,
					user_id: ctx.auth.userId,
					mode: input.mode,
					time_limit_sec: input.timeLimitSec ?? null,
					status: 'in_progress'
				}
			});

			const allQs = await ctx.prisma.question.findMany({
				where: { paper_id: input.paperId }
			});

			for (const q of allQs) {
				await ctx.prisma.attemptAnswer.create({
					data: {
						attempt_id: attempt.attempt_id,
						question_id: q.question_id,
						answer_text: '',
						max_score: q.marks
					}
				});
			}

			return attempt;
		}),

	saveAnswer: protectedProcedure
		.input(
			z.object({
				attemptId: z.string(),
				questionId: z.string(),
				text: z.string().max(50_000)
			})
		)
		.mutation(async ({ ctx, input }) => {
			const a = await ctx.prisma.attempt.findFirst({
				where: {
					attempt_id: input.attemptId,
					user_id: ctx.auth.userId,
					status: 'in_progress'
				}
			});
			if (!a) throw new TRPCError({ code: 'NOT_FOUND' });
			return ctx.prisma.attemptAnswer.update({
				where: {
					attempt_id_question_id: {
						attempt_id: input.attemptId,
						question_id: input.questionId
					}
				},
				data: { answer_text: input.text }
			});
		}),

	submit: protectedProcedure
		.use(rateLimited('attempt_submit'))
		.input(z.object({ attemptId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const a = await ctx.prisma.attempt.findFirst({
				where: { attempt_id: input.attemptId, user_id: ctx.auth.userId }
			});
			if (!a) throw new TRPCError({ code: 'NOT_FOUND' });
			await ctx.prisma.attempt.update({
				where: { attempt_id: input.attemptId },
				data: { status: 'submitted', submitted_at: new Date() }
			});
			await backendApi.post('/server/answer/mark', { attempt_id: input.attemptId });
			return { ok: true };
		})
});

export default attemptRouter;
