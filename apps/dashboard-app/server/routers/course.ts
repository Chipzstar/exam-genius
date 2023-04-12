import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

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
	})
});

export default courseRouter;