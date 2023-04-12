import type { NextApiRequest, NextApiResponse } from 'next';
import { cors, runMiddleware } from '../cors';
import stripe from '../../../server/stripe';
import {
	getOrCreateStripeCustomerIdForUser,
	validateLineItems
} from '../../../server/handlers/stripe-webhook-handlers';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '../../../server/prisma';
import { log } from 'next-axiom';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	// let mode = req.query.mode as Stripe.Checkout.SessionCreateParams.Mode;
	if (req.method === 'POST') {
		try {
			const auth = getAuth(req);
			if (!auth?.userId) {
				return res.status(401).json({ error: 'Not authenticated' });
			}
			log.debug('Auth', auth);
			const customer_id = await getOrCreateStripeCustomerIdForUser({
				prisma,
				stripe,
				userId: auth.userId
			});
			if (!customer_id) {
				throw new Error('Could not create customer');
			}
			const { line_items, mode } = await validateLineItems({auth, prisma, price_id: req.body.price_id})

			const session = await stripe.checkout.sessions.create({
				line_items,
				mode,
				success_url: `${req.headers.origin}/?success=true`,
				cancel_url: `${req.headers.origin}/exam-board?canceled=true`,
				customer: customer_id,
				discounts: [
					{
						coupon: '5b1TUPNh'
					}
				],
				subscription_data: {
					description: "Our AI technology is continuously learning, so you will always receive the most accurate predicted exam papers."
				},
				metadata: {
					userId: auth.userId
				}
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
