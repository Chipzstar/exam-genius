import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

const courseRouter = createTRPCRouter({
	getCourses: protectedProcedure.query(async ({ ctx }) => {
		try {
			return await ctx.prisma.course.findMany({
				where: {
					user_id: ctx.auth.userId
				}
			});
		} catch (err) {
			console.error(err.message);
			throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: err.message });
		}
	}),
	getSingleCourse: protectedProcedure
		.input(
			z.object({
				id: z.string()
			})
		)
		.query(async ({ input, ctx }) => {
			try {
				return await ctx.prisma.course.findFirstOrThrow({
					where: {
						user_id: ctx.auth.userId,
						course_id: input.id
					}
				});
			} catch (err) {
				console.error(err);
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Oops, something went wrong' + err.message
				});
			}
		}),
	checkDuplicateCourse: protectedProcedure
		.input(
			z.object({
				exam_board: z.enum(['ocr', 'aqa', 'edexcel']),
				subject: z.enum(['maths', 'physics', 'chemistry', 'biology', 'economics', 'psychology'])
			})
		)
		.mutation(async ({ input, ctx }) => {
			try {
				const courses = await ctx.prisma.course.findMany({
					where: {
						user_id: ctx.auth.userId,
						exam_board: input.exam_board,
						subject: input.subject
					}
				});
				return Boolean(courses.length);
			} catch (err) {
				console.error(err);
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: err.message });
			}
		})
});

export default courseRouter;
