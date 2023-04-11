import type { NextApiRequest, NextApiResponse } from 'next';
import { cors, runMiddleware } from '../cors';
import Stripe from 'stripe';
import stripe from '../../../server/stripe';
import { getOrCreateStripeCustomerIdForUser } from '../../../server/handlers/stripe-webhook-handlers';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '../../../server/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	const mode = req.query.mode as Stripe.Checkout.SessionCreateParams.Mode;
	if (req.method === 'POST') {
		try {
			const auth = getAuth(req);
			console.log(auth);
			const customerId = await getOrCreateStripeCustomerIdForUser({
				prisma,
				stripe,
				userId: auth.userId
			});
			if (!customerId) {
				throw new Error('Could not create customer');
			}
			const session = await stripe.checkout.sessions.create({
				line_items: [
					{
						// Provide the exact Price ID (for example, pr_1234) of the product you want to sell
						price: req.body.price_id,
						quantity: 1
					}
				],
				mode,
				success_url: `${req.headers.origin}/?success=true`,
				cancel_url: `${req.headers.origin}/exam-board?canceled=true`
			});
			if (session.url) res.redirect(303, session.url);
		} catch (error) {
			// Catch and log errors - return a 500 with a message
			console.error(error);
			// Sentry.captureException(error);
			res.status(error.statusCode || 500).json(error);
		}
	} else {
		res.setHeader('Allow', 'POST');
		return res.status(405).send({ message: 'Method not allowed.' });
	}
}
