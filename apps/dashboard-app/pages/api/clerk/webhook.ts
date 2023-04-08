import type { NextApiRequest, NextApiResponse } from 'next';
import { cors, runMiddleware } from '../cors';
import prisma from '../../../prisma';
import { log } from 'next-axiom';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	console.log(req.method);
	if (req.method === 'POST') {
		try {
			// Validate the incoming data and return 400 if it's not what is expected
			const payload = typeof req.body === 'object' ? req.body : JSON.parse(req.body);
			log.info(payload);
			// store the user in db
			const user = await prisma.user.create({
				data: {
					email: payload.data.email_addresses[0].email_address,
					full_name: `${payload.data.first_name} ${payload.data.last_name}`,
					firstname: payload.data.first_name,
					lastname: payload.data.last_name
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
