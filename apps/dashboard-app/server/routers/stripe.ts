import { createTRPCRouter, protectedProcedure } from '../trpc';
import { getOrCreateStripeCustomerIdForUser } from '../handlers/stripe-webhook-handlers';
import { z } from 'zod';

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
			const customerId = await getOrCreateStripeCustomerIdForUser({
				prisma,
				stripe,
				userId: Number(auth?.userId)
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
			if (session.url) return session.url;
		})
});

export default stripeRouter;