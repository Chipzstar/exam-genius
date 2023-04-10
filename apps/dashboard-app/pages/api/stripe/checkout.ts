import type { NextApiRequest, NextApiResponse } from 'next';
import { cors, runMiddleware } from '../cors';
import { stripe } from '../../../utils/clients';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	console.log(req.method, console.table(req.body));
	if (req.method === 'POST') {
		try {
			const session = await stripe.checkout.sessions.create({
				line_items: [
					{
						// Provide the exact Price ID (for example, pr_1234) of the product you want to sell
						price: req.body.price_id,
						quantity: 1
					}
				],
				mode: 'subscription',
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
