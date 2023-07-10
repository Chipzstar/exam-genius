import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
export const cors = Cors({
	methods: ['POST', 'GET', 'HEAD'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
export function runMiddleware(
	req: NextApiRequest,
	res: NextApiResponse,
	fn: (req, res, Function) => void
) {
	return new Promise((resolve, reject) => {
		fn(req, res, (result: any) => {
			if (result instanceof Error) {
				return reject(result)
			}
			return resolve(result)
		})
	})
}
