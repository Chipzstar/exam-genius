import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { createTRPCRouter, protectedProcedure, rateLimited } from '../trpc';
import { env } from '~/env';
import {
	buildQuestionEditPrompt,
	loadQuestionForEdit,
	parseEditModelText,
	persistQuestionEditFromParsed
} from '~/server/question-edit-logic';
import { questionsForPaperListTag } from '~/server/accelerate-cache-tags';
import { listForPaperOutputSchema } from '~/server/schemas/list-for-paper.schema';

const openaiSdk = createOpenAI({ apiKey: env.OPENAI_API_KEY });

const questionRouter = createTRPCRouter({
	listForPaper: protectedProcedure
		.input(z.object({ paperId: z.string() }))
		.output(listForPaperOutputSchema)
		.query(async ({ ctx, input }) => {
			const paper = await ctx.prisma.paper.findFirst({
				where: { paper_id: input.paperId, user_id: ctx.auth.userId }
			});
			if (!paper) throw new TRPCError({ code: 'NOT_FOUND' });
			const rows = await ctx.prisma.question.findMany({
				where: { paper_id: input.paperId },
				orderBy: [{ order: 'asc' }],
				include: {
					feedback: {
						where: { user_id: ctx.auth.userId },
						select: { sentiment: true }
					}
				},
				cacheStrategy: {
					swr: 30,
					ttl: 60,
					tags: [questionsForPaperListTag(input.paperId)]
				}
			});
			return listForPaperOutputSchema.parse(rows);
		}),

	listRevisions: protectedProcedure
		.input(z.object({ questionId: z.string() }))
		.query(async ({ ctx, input }) => {
			const q = await ctx.prisma.question.findFirst({
				where: {
					question_id: input.questionId,
					paper: { user_id: ctx.auth.userId }
				}
			});
			if (!q) throw new TRPCError({ code: 'NOT_FOUND' });
			return ctx.prisma.questionRevision.findMany({
				where: { question_id: input.questionId },
				orderBy: { revision: 'desc' },
				cacheStrategy: { swr: 15, ttl: 30 }
			});
		}),

	applyEdit: protectedProcedure
		.use(rateLimited('question_edit'))
		.input(
			z.object({
				questionId: z.string(),
				userPrompt: z.string().min(1).max(4000),
				preset: z.string().optional(),
				preserveMarks: z.boolean().default(true)
			})
		)
		.mutation(async ({ ctx, input }) => {
			const q = await loadQuestionForEdit(ctx.prisma, input.questionId, ctx.auth.userId);

			const { text } = await generateText({
				model: openaiSdk(env.OPENAI_QUESTION_EDIT_MODEL ?? 'gpt-4o-mini'),
				prompt: buildQuestionEditPrompt(q, {
					userPrompt: input.userPrompt,
					preset: input.preset,
					preserveMarks: input.preserveMarks
				})
			});

			let parsed;
			try {
				parsed = parseEditModelText(text);
			} catch {
				throw new TRPCError({ code: 'BAD_REQUEST', message: 'Model returned invalid JSON' });
			}

			const updated = await persistQuestionEditFromParsed(ctx.prisma, q, parsed, input.preserveMarks);
			await ctx.prisma.$accelerate.invalidate({
				tags: [questionsForPaperListTag(updated.paper_id)]
			});
			return updated;
		}),

	revertToRevision: protectedProcedure
		.input(z.object({ questionId: z.string(), revision: z.number() }))
		.mutation(async ({ ctx, input }) => {
			const rev = await ctx.prisma.questionRevision.findFirst({
				where: {
					question_id: input.questionId,
					revision: input.revision,
					question: { paper: { user_id: ctx.auth.userId } }
				}
			});
			if (!rev) throw new TRPCError({ code: 'NOT_FOUND' });
			const q = await ctx.prisma.question.findFirst({
				where: { question_id: input.questionId, paper: { user_id: ctx.auth.userId } }
			});
			if (!q) throw new TRPCError({ code: 'NOT_FOUND' });

			await ctx.prisma.questionRevision.create({
				data: {
					question_id: q.question_id,
					revision: q.revision,
					body: q.body as object[],
					marks: q.marks
				}
			});

			const updated = await ctx.prisma.question.update({
				where: { question_id: input.questionId },
				data: {
					body: rev.body as object[],
					marks: rev.marks,
					revision: { increment: 1 }
				}
			});
			await ctx.prisma.$accelerate.invalidate({
				tags: [questionsForPaperListTag(q.paper_id)]
			});
			return updated;
		})
});

export default questionRouter;
