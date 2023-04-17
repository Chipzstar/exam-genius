import { NextApiRequest, NextApiResponse } from 'next';
import { log } from 'next-axiom';
import { openai } from '../../../server/openai';
import { cors, runMiddleware } from '../cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Run the middleware
	await runMiddleware(req, res, cors);
	if (req.method === 'POST') {
		try {
			const { subject, exam_board, course, num_questions, num_marks, paper_name } = req.body;
			log.debug('Request:', req.body);
			const completion = await openai.createChatCompletion({
				model: 'gpt-3.5-turbo',
				messages: [
					{
						role: 'system',
						content: `You are a GPT model trained on previous A-level ${subject} past papers`
					},
					{
						role: 'user',
						content:
							`Please generate a new sample past paper for the upcoming A-level ${exam_board} ${subject} ${course} ${paper_name} exam in June` +
							`The questions generated should be based on A-level ${exam_board} ${subject} ${course} past paper questions from the years 2018 to 2022.` +
							`The past paper should have ${num_questions} questions. The total mark for this paper is ${num_marks}. Questions should all be relevant to the ` +
							`${exam_board} ${subject} ${course} specification. For each question, please format it using HTML markup. For example, "'1. Simplify: \n' +
      'a) (2 + sqrt(3)) (2 - sqrt(3))\n' +
      'b) (2 + sqrt(2))(2 - sqrt(2))\n' +
      'c) (1 + i)^5\n' +
      'd) (1 - i)^4\n' +
      '\n' +
      '2. Given that f(x) = x^2 - 1, find the values of x for which f(x+2) = f(x-2). \n' +
      '\n' " should be formatted as follows: "<ol type='1'><li>Simplify: </li><ol type='a'><li>(2 + sqrt(3)) (2 - sqrt(3))</li><li>(2 + sqrt(2))(2 - sqrt(2))</li><li>(1 + i)^5</li><li>(1 - i)^4</li></ol><li>Given that f(x) = x^2 - 1, find the values of x for which f(x+2) = f(x-2).</li></ol>"`
					}
				]
			});
			console.log('-----------------------------------------------');
			console.log(completion.data.choices[0]);
			log.debug('openai completion', completion.data.choices[0]);
			console.log('-----------------------------------------------');
			return res.status(200).json({ result: completion.data.choices[0].message.content });
		} catch (error) {
			if (error.response?.data) {
				console.log(error.response?.data);
				res.status(error.statusCode || 500).json(error.response.data);
			}
			console.error(error);
			res.status(500).json({ error: 'Something went wrong', message: error.message });
		}
	} else {
		res.setHeader('Allow', 'POST');
		return res.status(405).send({ message: 'Method not allowed.' });
	}
}
