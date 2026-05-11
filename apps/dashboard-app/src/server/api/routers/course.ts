import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { Course } from '@exam-genius/shared/prisma';

const examLevelSchema = z.enum(['a_level', 'as_level']);

const courseRouter = createTRPCRouter({
	getCourses: protectedProcedure.query(async ({ ctx }) => {
		try {
			return await ctx.prisma.course.findMany({
				where: {
					user_id: ctx.auth.userId
				},
				cacheStrategy: { swr: 30, ttl: 60 }
			});
		} catch (err) {
			console.error(err);
			throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: err.message });
		}
	}),
	getSingleCourse: protectedProcedure
		.input(
			z.object({
				id: z.string()
			})
		)
		.query(async ({ input, ctx }): Promise<Course> => {
			try {
				const dbCourse = await ctx.prisma.course.findFirstOrThrow({
					where: {
						user_id: ctx.auth.userId,
						course_id: input.id
					},
					cacheStrategy: { swr: 30, ttl: 60 }
				});
				return dbCourse as Course;
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
				subject: z.enum(['maths', 'physics', 'chemistry', 'biology', 'economics', 'psychology']),
				exam_level: examLevelSchema.default('a_level')
			})
		)
		.mutation(async ({ input, ctx }) => {
			try {
				const courses = await ctx.prisma.course.findMany({
					where: {
						user_id: ctx.auth.userId,
						exam_board: input.exam_board,
						subject: input.subject,
						exam_level: input.exam_level
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
