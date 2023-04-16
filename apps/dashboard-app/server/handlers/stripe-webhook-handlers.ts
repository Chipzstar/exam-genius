import type { PrismaClient } from '@prisma/client';
import Prisma from '@prisma/client';
import type Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';
import { log } from 'next-axiom';
import { CHECKOUT_TYPE, PORT } from '../../utils/constants';
import { capitalize, genCourseOrPaperName, sanitize } from '../../utils/functions';
import axios from 'axios';

// retrieves a Stripe customer id for a given user if it exists or creates a new one
export const getOrCreateStripeCustomerIdForUser = async ({
	stripe,
	prisma,
	userId
}: {
	stripe: Stripe;
	prisma: PrismaClient;
	userId: string | null;
}) => {
	try {
		if (!userId) throw new Error('User not logged in!');
		const user = await prisma.user.findUniqueOrThrow({
			where: {
				clerk_id: userId
			}
		});

		if (!user) throw new Error('User not found');

		if (user.stripe_customer_id) {
			return user.stripe_customer_id;
		}

		// create a new customer
		const customer = await stripe.customers.create({
			email: user.email ?? undefined,
			name: user.full_name ?? undefined,
			// use metadata to link this Stripe customer to internal user id
			metadata: {
				userId
			}
		});

		// update with new customer id
		const updatedUser = await prisma.user.update({
			where: {
				clerk_id: userId
			},
			data: {
				stripe_customer_id: customer.id
			}
		});

		if (updatedUser.stripe_customer_id) {
			return updatedUser.stripe_customer_id;
		}
		return customer.id;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

export const handleCheckoutSessionComplete = async ({
	stripe,
    event,
    prisma
} : {
	stripe: Stripe;
	event: Stripe.Event;
	prisma: PrismaClient;
}) => {
	try {
		const session = event.data.object as Stripe.Checkout.Session;
		console.log('-----------------------------------------------');
		console.table(session?.metadata)
		console.log('-----------------------------------------------');
		const checkout_type = String(session?.metadata?.type);
		const user = await prisma.user.findUniqueOrThrow({
			where: {
				clerk_id: session?.metadata?.userId ?? ""
			}
		})
		// uses the session id to retrieve the checkout line items
		const line_items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 5 })
		log.debug("line items", line_items.data)
		for (const item of line_items.data) {
			if (!item.price) throw new Error('No price found');
			const price = await stripe.prices.retrieve(
				String(item.price.id)
			);
			if (checkout_type === CHECKOUT_TYPE.COURSE) {
				if (price?.metadata?.subject && price?.metadata?.exam_board) {
					const subject = price.metadata.subject as Prisma.Subject;
					const exam_board = price.metadata.exam_board as Prisma.ExamBoard;
					const product_id = price.product;
					const course = await prisma.course.create({
						data: {
							name: price?.nickname ?? genCourseOrPaperName(subject, exam_board),
							subject,
							exam_board,
							user_id: user.clerk_id,
							course_id: `course_${nanoid(16)}`,
							product_id: String(product_id) ?? null,
							year_level: 13
						}
					})
					console.log('*****************************************');
					console.log("NEW COURSE", course)
					console.log('*****************************************');
				}
			} else {
				// @ts-ignore
				const validKeys = ['exam_board', 'subject', 'unit', 'course_id'].every(key => Object.keys(session?.metadata).includes(key))
				console.log(validKeys)
				if (session?.metadata && validKeys) {
					const subject = session.metadata.subject as Prisma.Subject;
					const exam_board = session.metadata.exam_board as Prisma.ExamBoard;
					const unit_name = session.metadata.unit as string;
					const course_id = session.metadata.course_id as string;
					console.log('************************************************');
					console.table({subject, exam_board, unit_name, course_id})
					let paper = await prisma.paper.create({
						data: {
							name: genCourseOrPaperName(subject, exam_board, unit_name),
							user_id: user.clerk_id,
							subject,
							exam_board,
							course_id: course_id,
							unit_name: unit_name,
							paper_id: `paper_${nanoid(16)}`,
							paper_code: `PM02/A2`,
							content: ""
						}
					})
					console.log('*****************************************');
					console.log("NEW PAPER:", paper)
					console.log('*****************************************');
					// call the API endpoint for generating a predicted paper
					const baseUrl = process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : `http://localhost:${PORT}`
					axios.post(`${baseUrl}/api/openai/generate`, {
						subject: capitalize(subject),
						exam_board: capitalize(exam_board),
						course: capitalize(sanitize(unit_name)),
						num_questions: 16,
						num_marks: 100
					}).then(({data}) => {
						console.log('-----------------------------------------------');
						console.log(data)
						console.log('-----------------------------------------------');
						const content : string = data.result
						const sanitizedContent = content.replace(/\\n\s+|\\n/g, '')
						console.log(sanitizedContent)
						prisma.paper.update({
							where: {
								paper_id: paper.paper_id
							},
							data: {
                                content: sanitizedContent
                            }
						}).then((paper ) => {
							console.log('=======================================');
							console.log(paper)
							console.log('=======================================');
						}).catch(err => {
							console.log('************************************************');
							console.error(err)
							console.log('************************************************');
						})
					}).catch(err => {
						console.error(err)
					})
				}
			}
		}
		return;
	} catch (err) {
		console.error(err);
		throw err;
	}
}

export const handleInvoicePaid = async ({
	stripe,
	event,
	prisma
}: {
	stripe: Stripe;
	event: Stripe.Event;
	prisma: PrismaClient;
}) => {
	const invoice = event.data.object as Stripe.Invoice;
	if (!invoice.customer) throw new Error('No stripe customer found');
	// Check if the user with the corresponding ID already exists
	try {
		const user = await prisma.user.findUnique({
			where: {
				stripe_customer_id: String(invoice.customer)
			}
		})
		if (!user) throw new Error('User not found');
		// for each line item, check if the item is a subject
		// if so create the course under the user that purchased it
		for (const item of invoice.lines.data) {
			if (!item.price) throw new Error('No price found');
			const price = await stripe.prices.retrieve(
				String(item.price.id)
			);
			console.log("-----------------------------------------")
			console.log(price)
			console.log("-----------------------------------------")
			if (price?.metadata?.subject && price?.metadata?.exam_board) {
				const subject = price.metadata.subject as Prisma.Subject;
				const exam_board = price.metadata.exam_board as Prisma.ExamBoard;
				const product_id = price.product;
				const course = await prisma.course.create({
					data: {
						name: price?.nickname ?? "",
						subject,
						exam_board,
						user_id: user.clerk_id,
						course_id: `course_${uuidv4()}`,
						product_id: String(product_id) ?? null,
						year_level: 13
					}
				})
				console.log('*****************************************');
				console.log(course)
				console.log('*****************************************');
			}
		}
		return;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

export const handleSubscriptionCreatedOrUpdated = async ({
	event,
	prisma
}: {
	event: Stripe.Event;
	prisma: PrismaClient;
}) => {
	const subscription = event.data.object as Stripe.Subscription;
	console.log("-----------------------------------------")
	console.log(subscription)
	console.log("-----------------------------------------")
	const customer_id = subscription.customer
	// update user with subscription data
	await prisma.user.update({
		where: {
			stripe_customer_id: String(customer_id)
		},
		data: {
			stripe_subscription_id: subscription.id,
			stripe_subscription_status: subscription.status
		}
	});
	return;
};

export const handleSubscriptionCanceled = async ({ event, prisma }: { event: Stripe.Event; prisma: PrismaClient }) => {
	const subscription = event.data.object as Stripe.Subscription;
	const userId = subscription.metadata.userId;

	// remove subscription data from user
	await prisma.user.update({
		where: {
			id: Number(userId)
		},
		data: {
			stripe_subscription_id: null,
			stripe_subscription_status: null
		}
	});
};

