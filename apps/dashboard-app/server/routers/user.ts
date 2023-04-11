import { createTRPCRouter, protectedProcedure } from '../trpc';

const userRouter = createTRPCRouter({
	subscriptionStatus: protectedProcedure.query(async ({ ctx }) => {
		const { auth, prisma } = ctx;

		if (!auth.session) {
			throw new Error('Not authenticated');
		}

		const data = await prisma.user.findUnique({
			where: {
				id: Number(auth.userId)
			},
			select: {
				stripe_subscription_status: true
			}
		});

		if (!data) {
			throw new Error('Could not find user');
		}

		return data.stripe_subscription_status;
	})
});

export default userRouter;
