import type { NextApiRequest, NextApiResponse } from 'next';
import { cors, runMiddleware } from '../cors';
import prisma from '../../../prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Run the middleware
	// await runMiddleware(req, res, cors)
	console.log(req.method)
	if (req.method === 'POST') {
		try {
			// Validate the incoming data and return 400 if it's not what is expected
			const body = typeof req.body === 'object' ? req.body : JSON.parse(req.body);
			// store the user in db
			const user = await prisma.user.create({
				data: {
					email: body.email,
					full_name: `${body.first_name} ${body.last_name}`,
					firstname: body.firstname,
					lastname: body.year,
				}
			});
			console.log('-----------------------------------------------');
			console.log(user);
			console.log('-----------------------------------------------');
			return user;
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
