import type { NextApiRequest, NextApiResponse } from 'next';
import { cors, runMiddleware } from '../cors';
import stripe from '../../../server/stripe';
import { getOrCreateStripeCustomerIdForUser } from '../../../server/handlers/stripe-webhook-handlers';
import { getAuth } from '@clerk/nextjs/server';
import { prisma } from '../../../server/prisma';
import { log } from '~/server/logtail';
import { CHECKOUT_TYPE, PAPER_PRICE_IDS, PATHS, SUBJECT_STRIPE_IDS } from '../../../utils/constants';
import { validateLineItems } from '../../../server/handlers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	// let mode = req.query.mode as Stripe.Checkout.SessionCreateParams.Mode;
	const { type, exam_board, subject, unit, course_id } = req.body;
	if (req.method === 'POST') {
		try {
			const auth = getAuth(req);
			if (!auth?.userId) return res.status(401).json({ error: 'Not authenticated' });
			log.debug('Auth:', auth);
			const customer_id = await getOrCreateStripeCustomerIdForUser({
				prisma,
				stripe,
				userId: auth.userId
			});
			if (!customer_id) throw new Error('Could not create customer');
			if (type === CHECKOUT_TYPE.PAPER) {
				const price_id = PAPER_PRICE_IDS[subject];
				const session = await stripe.checkout.sessions.create({
					line_items: [
						{
							price: price_id,
							quantity: 1
						}
					],
					mode: 'payment',
					success_url: `${req.headers.origin}/${PATHS.COURSE}/${course_id}/${unit}/?subject=${subject}&board=${exam_board}?success=true`,
					cancel_url: `${req.headers.origin}/${PATHS.COURSE}/${course_id}/${unit}/?subject=${subject}&board=${exam_board}?canceled=true`,
					customer: customer_id,
					metadata: {
						type: CHECKOUT_TYPE.PAPER,
						userId: auth.userId,
						exam_board: exam_board,
						subject: subject,
						unit: unit,
						course_id: course_id
					}
				});
				if (session.url) res.redirect(303, session.url);
			} else {
				const price_id = SUBJECT_STRIPE_IDS[subject][exam_board];
				const { line_items, mode } = await validateLineItems(price_id);
				const session = await stripe.checkout.sessions.create({
					line_items,
					mode,
					success_url: `${req.headers.origin}/?success=true`,
					cancel_url: `${req.headers.origin}/${PATHS.EXAM_BOARD}?canceled=true`,
					customer: customer_id,
					metadata: {
						type: CHECKOUT_TYPE.COURSE,
						userId: auth.userId,
						exam_board: exam_board,
						subject: subject,
						unit: unit,
						course_id: course_id
					}
				});
				if (session.url) res.redirect(303, session.url);
			}
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
