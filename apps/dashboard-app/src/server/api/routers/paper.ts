import { createTRPCRouter, protectedProcedure, rateLimited } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { capitalize, genID, sanitize } from '~/utils/functions';
import { Logger } from '~/server/logger';
import { GeneratePaperPayload } from '~/utils/types';
import { backendApi } from '~/server/backend-headers';
import { buildStudentStyleContextDashboard } from '~/server/style-context-dashboard';

const paperRouter = createTRPCRouter({
	getPapers: protectedProcedure.query(async ({ ctx }) => {
		try {
			const user_id = ctx.auth.userId;
			const papers = await ctx.prisma.paper.findMany({
				where: {
					user_id
				}
			});
			return papers;
		} catch (err) {
			console.error(err);
			throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Oops, something went wrong' + err.message });
		}
	}),
	getSinglePaper: protectedProcedure
		.input(
			z.object({
				paperId: z.string()
			})
		)
		.query(async ({ input, ctx }) => {
			try {
				const paper = await ctx.prisma.paper.findFirstOrThrow({
					where: {
						user_id: ctx.auth.userId,
						paper_id: input.paperId
					}
				});
				return paper;
			} catch (err) {
				console.error(err);
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Oops, something went wrong' + err.message
				});
			}
		}),
	getPapersByCode: protectedProcedure
		.input(
			z.object({
				courseId: z.string(),
				code: z.string()
			})
		)
		.query(async ({ input, ctx }) => {
			try {
				const papers = await ctx.prisma.paper.findMany({
					where: {
						course_id: input.courseId,
						paper_code: input.code,
						user_id: ctx.auth.userId
					}
				});
				return papers;
			} catch (err) {
				console.error(err);
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Oops, something went wrong' + err.message
				});
			}
		}),
	getPapersByCourse: protectedProcedure
		.input(
			z.object({
				courseId: z.string()
			})
		)
		.query(async ({ input, ctx }) => {
			try {
				const papers = await ctx.prisma.paper.findMany({
					where: {
						user_id: ctx.auth.userId,
						course_id: input.courseId
					}
				});
				return papers;
			} catch (err) {
				console.error(err);
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Oops, something went wrong' + err.message
				});
			}
		}),
	createPaper: protectedProcedure
		.input(
			z.object({
				exam_board: z.enum(['ocr', 'aqa', 'edexcel']),
				subject: z.enum(['maths', 'physics', 'chemistry', 'biology', 'economics', 'psychology']),
				paper_code: z.string(),
				paper_name: z.string(),
				course_id: z.string(),
				unit_name: z.string(),
				num_questions: z.number(),
				num_marks: z.number()
			})
		)
		.mutation(async ({ input, ctx }) => {
			const log = new Logger();
			try {
				const user_id = ctx.auth.userId;
				const paper_id = genID('paper');
				const paper = await ctx.prisma.paper.create({
					data: {
						name: input.paper_name,
						user_id,
						subject: input.subject,
						exam_board: input.exam_board,
						course_id: input.course_id,
						unit_name: input.unit_name,
						paper_id,
						paper_code: input.paper_code,
						content: '',
						status: 'pending'
					}
				});
				if (!paper)
					throw new TRPCError({
						code: 'BAD_REQUEST',
						message: 'Failed to create paper with id: ' + paper_id
					});
				console.log('[Paper] New paper created', { paper });
				// call the API endpoint for generating a predicted paper
				/*const baseUrl = process.env.VERCEL_URL
					? 'https://' + process.env.VERCEL_URL
					: `http://localhost:${PORT}`;
				axios
					.post(`${baseUrl}/api/openai/generate`, {
						subject: capitalize(input.subject),
						exam_board: capitalize(input.exam_board),
						course: capitalize(sanitize(input.unit_name)),
						paper_name: input.paper_name,
						num_questions: input.num_questions,
						num_marks: input.num_marks
					})
					.then(({ data }) => {
						const content: string = data.result;
						const sanitizedContent = content.replace(/\\n\s+|\\n/g, '');
						log.info('openai response');
						log.info(content);
						ctx.prisma.paper
							.update({
								where: {
									paper_id: paper.paper_id
								},
								data: {
									content: sanitizedContent,
									status: 'success'
								}
							})
							.then(paper => {
								console.log('=======================================');
								console.log(paper);
								log.debug('updated paper', paper);
								console.log('=======================================');
							})
							.catch(err => {
								console.log('************************************************');
								console.error(err);
								log.error(err);
								console.log('************************************************');
							});
					})
					.catch(err => {
						console.log('************************************************');
						console.error(err);
						log.error(err);
						console.log('************************************************');
					});*/
				await log.flush();
				return paper;
			} catch (err) {
				log.error('Create paper error', { error: String(err) });
				await log.flush();
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Oops, something went wrong' + (err as Error).message
				});
			}
		}),

	triggerBackendGenerate: protectedProcedure
		.use(rateLimited('paper_generate'))
		.input(
			z.object({
				paperId: z.string(),
				num_questions: z.coerce.number(),
				num_marks: z.coerce.number(),
				referenceIds: z.array(z.string()).optional()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const paper = await ctx.prisma.paper.findFirst({
				where: { paper_id: input.paperId, user_id: ctx.auth.userId }
			});
			if (!paper) throw new TRPCError({ code: 'NOT_FOUND', message: 'Paper not found' });
			try {
				await backendApi.post('/server/paper/generate', {
					paper_id: paper.paper_id,
					paper_name: paper.name,
					subject: capitalize(paper.subject),
					exam_board: capitalize(paper.exam_board),
					course: capitalize(sanitize(paper.unit_name)),
					num_questions: input.num_questions,
					num_marks: input.num_marks,
					reference_ids: input.referenceIds ?? []
				} as GeneratePaperPayload);
				return { ok: true as const };
			} catch (e) {
				console.error(e);
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Failed to start paper generation'
				});
			}
		}),

	getGenerationHints: protectedProcedure
		.input(z.object({ courseId: z.string(), paperCode: z.string() }))
		.query(async ({ ctx, input }) => {
			return buildStudentStyleContextDashboard(ctx.prisma, {
				userId: ctx.auth.userId,
				courseId: input.courseId,
				paperCode: input.paperCode
			});
		}),

	getMarkScheme: protectedProcedure
		.input(z.object({ paperId: z.string() }))
		.query(async ({ ctx, input }) => {
			const paper = await ctx.prisma.paper.findFirst({
				where: { paper_id: input.paperId, user_id: ctx.auth.userId }
			});
			if (!paper) throw new TRPCError({ code: 'NOT_FOUND' });
			return ctx.prisma.markScheme.findUnique({
				where: { paper_id: input.paperId }
			});
		}),

	ensureStructured: protectedProcedure
		.input(z.object({ paperId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const paper = await ctx.prisma.paper.findFirst({
				where: { paper_id: input.paperId, user_id: ctx.auth.userId }
			});
			if (!paper) throw new TRPCError({ code: 'NOT_FOUND' });
			if (paper.structured_at) return { ok: true as const };
			try {
				await backendApi.post('/server/paper/parse-legacy', { paper_id: input.paperId });
				return { ok: true as const };
			} catch {
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Legacy parse failed' });
			}
		}),

	checkPaperGenerated: protectedProcedure
		.input(
			z.object({
				id: z.string()
			})
		)
		.mutation(async ({ input, ctx }) => {
			try {
				const paper = await ctx.prisma.paper.findUniqueOrThrow({
					where: {
						paper_id: input.id
					}
				});
				console.log('-----------------------------------------------');
				console.log(paper);
				console.log('-----------------------------------------------');
				if (paper.status === 'success' || paper.content) return true;
				else {
					// set status of paper to failed
					await ctx.prisma.paper.update({
						where: {
							paper_id: input.id
						},
						data: {
							status: 'failed'
						}
					});
					return false;
				}
			} catch (err) {
				console.error(err);
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Oops, something went wrong' + err.message
				});
			}
		}),
	regeneratePaper: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				num_questions: z.number(),
				num_marks: z.number()
			})
		)
		.mutation(async ({ input, ctx }) => {
			const log = new Logger();
			try {
				const existing = await ctx.prisma.paper.findFirst({
					where: { paper_id: input.id, user_id: ctx.auth.userId }
				});
				if (!existing) throw new TRPCError({ code: 'NOT_FOUND' });
				const paper = await ctx.prisma.paper.update({
					where: {
						paper_id: input.id
					},
					data: {
						status: 'pending'
					}
				});
				backendApi
					.post('/server/paper/generate', {
						paper_id: paper.paper_id,
						paper_name: paper.name,
						subject: capitalize(paper.subject),
						exam_board: capitalize(paper.exam_board),
						course: capitalize(sanitize(paper.unit_name)),
						num_questions: input.num_questions,
						num_marks: input.num_marks
					} as GeneratePaperPayload)
					.catch(err => {
						log.error('Regenerate paper API error', { error: String(err) });
						void log.flush();
					});
				await log.flush();
				return paper;
			} catch (err) {
				log.error('Regenerate paper error', { error: String(err) });
				await log.flush();
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Oops, something went wrong' + (err as Error).message
				});
			}
		}),
	deletePaper: protectedProcedure
		.input(
			z.object({
				id: z.string()
			})
		)
		.mutation(async ({ input, ctx }) => {
			try {
				const paper = await ctx.prisma.paper.delete({
					where: {
						paper_id: input.id
					}
				});
				console.log(paper);
				return paper;
			} catch (err) {
				console.error(err);
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Oops, something went wrong' + err.message
				});
			}
		})
});

export default paperRouter;
