import { createTRPCRouter, protectedProcedure } from '../trpc';
import { getOrCreateStripeCustomerIdForUser } from '../handlers/stripe-webhook-handlers';
import { validateLineItems } from '../handlers';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { getAuth } from '@clerk/nextjs/server';
import { log } from 'next-axiom';
import { CHECKOUT_TYPE, PAPER_PRICE_IDS, PATHS, SUBJECT_STRIPE_IDS } from '../../utils/constants';

const courseSchema = z.object({
	type: z.literal(CHECKOUT_TYPE.COURSE),
	exam_board: z.enum(['ocr', 'aqa', 'edexcel']),
	subject: z.enum(['maths', 'physics', 'chemistry', 'biology', 'economics', 'psychology']),
	price_id: z.string()
});

const paperSchema = z.object({
	type: z.literal(CHECKOUT_TYPE.PAPER),
	price_id: z.string(),
	course_id: z.string(),
	exam_board: z.enum(['ocr', 'aqa', 'edexcel']),
	subject: z.enum(["maths", "physics", "chemistry", "biology", "economics", "psychology"]),
	paper_href: z.string(),
	paper_name: z.string(),
	paper_code: z.string(),
	unit: z.string(),
	num_questions: z.number(),
	marks: z.number()
})

const stripeRouter = createTRPCRouter({
	createCheckoutSession: protectedProcedure
		.input(z.discriminatedUnion('type', [courseSchema, paperSchema]))
		.mutation(async ({ input, ctx }) => {
			let session;
			const { stripe, auth, prisma, req, res } = ctx;
			console.log(auth);
			const { type, exam_board, subject } = input;
			try {
				const auth = getAuth(req);
				if (!auth?.userId) throw new Error('Not authenticated');
				log.debug('Auth:', auth);
				const customer_id = await getOrCreateStripeCustomerIdForUser({
					prisma,
					stripe,
					userId: auth.userId
				});
				if (!customer_id) throw new Error('Could not create customer');
				if (type === CHECKOUT_TYPE.PAPER) {
					const price_id = PAPER_PRICE_IDS[subject]
					session = await stripe.checkout.sessions.create({
						line_items: [
							{
								price: price_id,
								quantity: 1
							}
						],
						mode: 'payment',
						success_url: `${req.headers.origin}/${PATHS.COURSE}/${input?.course_id}/${input?.unit}/${input?.paper_href}/?subject=${subject}&board=${exam_board}&code=${input?.paper_code}&success=true`,
						cancel_url: `${req.headers.origin}/${PATHS.COURSE}/${input?.course_id}/${input?.unit}/?subject=${subject}&board=${exam_board}&canceled=true`,
						customer: customer_id,
						metadata: {
							type: CHECKOUT_TYPE.PAPER,
							userId: auth.userId,
							exam_board: exam_board,
							subject: subject,
							unit: input?.unit,
							course_id: input?.course_id,
							paper_name: input?.paper_name,
							paper_code: input?.paper_code,
							num_questions: input?.num_questions,
                            num_marks: input?.marks
						}
					});
					if (!session) {  throw new Error("Could not create checkout session");  }
				} else {
					const price_id = SUBJECT_STRIPE_IDS[subject][exam_board]
					const { line_items, mode } = await validateLineItems(price_id);
					session = await stripe.checkout.sessions.create({
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
						}
					});
					if (!session) {  throw new Error("Could not create checkout session");  }
				}
				return { checkout_url: session.url };
			} catch (err) {
				console.error(err);
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: err.message ?? 'Unknown error occurred.'
				});
			}
		})
});

export default stripeRouter;
