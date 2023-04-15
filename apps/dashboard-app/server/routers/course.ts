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
		})
});

export default courseRouter;
