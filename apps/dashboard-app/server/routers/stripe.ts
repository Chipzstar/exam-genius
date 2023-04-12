import { createTRPCRouter, protectedProcedure } from '../trpc';
import { getOrCreateStripeCustomerIdForUser } from '../handlers/stripe-webhook-handlers';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

const stripeRouter = createTRPCRouter({
	createCheckoutSession: protectedProcedure
		.input(
			z.object({
				mode: z.enum(['subscription', 'payment']),
				price_id: z.string()
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { stripe, auth, prisma, req, res } = ctx;
			console.log(auth);
			try {
				const customerId = await getOrCreateStripeCustomerIdForUser({
					prisma,
					stripe,
					userId: auth?.userId
				});
				if (!customerId) {
					throw new Error('Could not create customer');
				}
				const session = await stripe.checkout.sessions.create({
					line_items: [
						{
							// Provide the exact Price ID (for example, pr_1234) of the product you want to sell
							price: input.price_id,
							quantity: 1
						}
					],
					mode: input.mode,
					success_url: `${req.headers.origin}/?success=true`,
					cancel_url: `${req.headers.origin}/exam-board?canceled=true`
				});
				return session.url;
			} catch (err) {
				console.error(err);
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: err.message ?? 'Unknown error occurred.'
				});
			}
		})
});

export default stripeRouter;
