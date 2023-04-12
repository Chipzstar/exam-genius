import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

const courseRouter = createTRPCRouter({
	getCourses: protectedProcedure.query(async ({ctx}) => {
		try {
			console.log("-----------------------------------------")
			console.log(ctx.auth)
			console.log("-----------------------------------------")
			const user = await ctx.prisma.user.findUniqueOrThrow({
				where: {
					clerk_id: ctx.auth.userId
				}
			})
			const courses = await ctx.prisma.course.findMany({
				where: {
					user_id: ctx.auth.userId
				}
			})
			return []
		} catch (err) {
			console.error(err.message);
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: err.message });
		}
	})
})

export default courseRouter;