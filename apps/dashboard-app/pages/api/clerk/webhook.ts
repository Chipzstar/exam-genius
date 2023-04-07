import type { NextApiRequest, NextApiResponse } from 'next';
import { cors, runMiddleware } from '../cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Run the middleware
	// await runMiddleware(req, res, cors)
	console.log(req.method)
	if (req.method === 'POST') {
		try {
			// Validate the incoming data and return 400 if it's not what is expected
			const body = typeof req.body === 'object' ? req.body : JSON.parse(req.body);
			return res.status(200).json({ userId: 'abc123' });
		} catch (error) {
			// Catch and log errors - return a 500 with a message
			console.error(error);
			// Sentry.captureException(error);
			return res.status(500).send({ message: 'Server error!' });
		}
	} else {
		return res.status(405).send({ message: 'Method not allowed.' });
	}
}
