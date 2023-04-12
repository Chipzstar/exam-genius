import type { NextApiRequest, NextApiResponse } from 'next';
import { cors, runMiddleware } from '../cors';
import stripe from '../../../server/stripe';
import { getOrCreateStripeCustomerIdForUser } from '../../../server/handlers/stripe-webhook-handlers';
import { getAuth } from '@clerk/nextjs/server';
import { prisma } from '../../../server/prisma';
import { log } from 'next-axiom';
import { SignedInAuthObject } from '@clerk/nextjs/dist/api';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { SUBJECT_STRIPE_IDS } from '../../../utils/constants';

export const validateLineItems = async ({
	auth,
	prisma,
	price_id
}: {
	auth: SignedInAuthObject;
	prisma: PrismaClient;
	price_id: string;
}): Promise<{
	line_items: Stripe.Checkout.SessionCreateParams.LineItem[];
	mode: Stripe.Checkout.SessionCreateParams.Mode;
}> => {
	try {
		let mode: Stripe.Checkout.SessionCreateParams.Mode = 'payment';
		const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
		const user = await prisma.user.findUniqueOrThrow({
			where: {
				clerk_id: auth.userId
			}
		});
		// check if the user is already subscribed to a plan
		// if not subscribed add, the Genius Plan product to the checkout
		if (user.stripe_subscription_status !== 'active') {
			line_items.push({
				// Provide the exact Price ID (for example, pr_1234) of the product you want to sell
				price: 'price_1MvmiEJOIoW2Wbjc8fdJPWer',
				quantity: 1
			});
			// set mode of the checkout session to "subscription
			mode = 'subscription';
		}
		line_items.push({
			price: price_id,
			quantity: 1
		});
		return { line_items, mode };
	} catch (err) {
		console.error(err);
		throw err;
	}
};
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	// let mode = req.query.mode as Stripe.Checkout.SessionCreateParams.Mode;
	const { exam_board, subject } = req.body;
	const price_id = SUBJECT_STRIPE_IDS[subject][exam_board]
	console.log("-----------------------------------------")
	console.log("PRICE_ID", price_id)
	console.log("-----------------------------------------")
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
			const { line_items, mode } = await validateLineItems({ auth, prisma, price_id });
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
					description:
						'Our AI technology is continuously learning, so you will always receive the most accurate predicted exam papers.'
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
