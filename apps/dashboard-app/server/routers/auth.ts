import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { hashPassword } from '../../utils/functions';

const authRouter = router({
	clerk: publicProcedure.input(Object).mutation(async ({ input, ctx }) => {
		try {
			console.log('-----------------------------------------------');
			console.log(input)
			console.log('-----------------------------------------------');
			return { message: "Success" };
		} catch (err) {
			console.error(err);
			throw new TRPCError({code: "UNPROCESSABLE_CONTENT", message: err.message});
		}
	}),
	signup: publicProcedure
		.input(
			z.object({
				full_name: z.string(),
				email: z.string(),
				password: z.string(),
				role: z.string(),
				year: z.string()
			})
		)
		.mutation(async ({ input, ctx }) => {
			try {
				// hash the user's password
				const hashed_password = await hashPassword(input.password);
				// store the user in db
				const user = await ctx.prisma.user.create({
					data: {
						email: input.email,
						password: hashed_password,
						full_name: input.full_name,
						year: input.year,
						role: input.role
					}
				});
				console.log('-----------------------------------------------');
				console.log(user);
				console.log('-----------------------------------------------');
				return { ...user, hashed_password };
			} catch (e) {
				console.error(e);
				throw new TRPCError({ code: 'BAD_REQUEST', message: e.message });
			}
		})
});

export default authRouter;
