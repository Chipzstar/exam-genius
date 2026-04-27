import type { PrismaClient, Subject, ExamBoard } from '@exam-genius/shared/prisma';
import type Stripe from 'stripe';
import type { Logger } from 'next-axiom';
import { CHECKOUT_TYPE } from '../../utils/constants';
import { capitalize, genCourseOrPaperName, genID, sanitize } from '../../utils/functions';
import { GeneratePaperPayload } from '../../utils/types';
import { env } from '~/env';
import { backendApi } from '~/server/backend-headers';

export const getOrCreateStripeCustomerIdForUser = async ({
	stripe,
	prisma,
	userId
}: {
	stripe: Stripe;
	prisma: PrismaClient;
	userId: string | null;
}) => {
	console.log('[Stripe] getOrCreateStripeCustomerIdForUser called', { userId });
	try {
		if (!userId) throw new Error('User not logged in!');
		console.log('[Stripe] Looking up user by clerk_id', { userId });
		const user = await prisma.user.findUniqueOrThrow({
			where: {
				clerk_id: userId
			}
		});

		if (!user) throw new Error('User not found');
		console.log('[Stripe] User found', { userId: user.clerk_id, stripeCustomerId: user.stripe_customer_id });

		if (user.stripe_customer_id) {
			console.log('[Stripe] Returning existing stripe_customer_id', { stripe_customer_id: user.stripe_customer_id });
			return user.stripe_customer_id;
		}

		// create a new customer
		console.log('[Stripe] Creating new Stripe customer');
		const customer = await stripe.customers.create({
			email: user.email ?? undefined,
			name: user.full_name ?? undefined,
			// use metadata to link this Stripe customer to internal user id
			metadata: {
				userId
			}
		});

		// update with new customer id
		console.log('[Stripe] Updating user with new stripe_customer_id', { customerId: customer.id });
		const updatedUser = await prisma.user.update({
			where: {
				clerk_id: userId
			},
			data: {
				stripe_customer_id: customer.id
			}
		});

		if (updatedUser.stripe_customer_id) {
			console.log('[Stripe] Returning newly created stripe_customer_id', { stripe_customer_id: updatedUser.stripe_customer_id });
			return updatedUser.stripe_customer_id;
		}
		console.log('[Stripe] Returning customer.id', { customerId: customer.id });
		return customer.id;
	} catch (err) {
		console.error('[Stripe] getOrCreateStripeCustomerIdForUser error', err);
		throw err;
	}
};

export const handleCheckoutSessionComplete = async ({
	stripe,
	event,
	prisma,
	log
}: {
	stripe: Stripe;
	event: Stripe.Event;
	prisma: PrismaClient;
	log: Logger;
}) => {
	console.log('[Stripe Checkout] handleCheckoutSessionComplete called', { eventId: event.id, eventType: event.type });
	try {
		const session = event.data.object as Stripe.Checkout.Session;
		console.log('[Stripe Checkout] Session details', { sessionId: session.id, metadata: session?.metadata ?? {}, customerEmail: session.customer_email });
		const checkout_type = String(session?.metadata?.type);
		const metadataUserId = session?.metadata?.userId ?? '';
		console.log('[Stripe Checkout] Looking up user', { metadataUserId, checkout_type });
		const user = await prisma.user.findUniqueOrThrow({
			where: {
				clerk_id: metadataUserId
			}
		});
		console.log('[Stripe Checkout] User found', { clerk_id: user.clerk_id });
		const line_items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 5 });
		console.log('[Stripe Checkout] Line items count', { count: line_items.data.length });
		for (const item of line_items.data) {
			console.log('[Stripe Checkout] Processing line item', { priceId: item.price?.id });
			if (!item.price) throw new Error('No price found');
			const price = await stripe.prices.retrieve(String(item.price.id));
			console.log('[Stripe Checkout] Price retrieved', { priceId: price.id, productId: price.product });
			if (checkout_type === CHECKOUT_TYPE.COURSE) {
				console.log('[Stripe Checkout] Course checkout branch', { subject: session?.metadata?.subject, exam_board: session?.metadata?.exam_board });
				if (session?.metadata?.subject && session?.metadata?.exam_board) {
					const subject = session.metadata.subject as Subject;
					const exam_board = session.metadata.exam_board as ExamBoard;
					const product_id = price.product;
					const course = await prisma.course.create({
						data: {
							name: price?.nickname ?? genCourseOrPaperName(subject, exam_board),
							subject,
							exam_board,
							user_id: user.clerk_id,
							course_id: genID("course"),
							product_id: String(product_id) ?? null,
							year_level: 13
						}
					});
					console.log('[Stripe Checkout] Course created', { courseId: course.course_id });
					console.log('[Stripe Checkout] New course created', course);
				}
			} else {
				console.log('[Stripe Checkout] Paper checkout branch', { metadataKeys: session?.metadata ? Object.keys(session.metadata) : [] });
				if (session?.metadata && [
					'exam_board',
					'subject',
					'unit',
					'course_id',
					'paper_name',
					'num_questions',
					'num_marks'
					//@ts-ignore
				].every(key => Object.keys(session.metadata).includes(key))) {
					const subject = session.metadata.subject as Subject;
					const exam_board = session.metadata.exam_board as ExamBoard;
					const unit_name = session.metadata.unit as string;
					const course_id = session.metadata.course_id as string;
					const paper_name = session.metadata.paper_name as string;
					const paper_code = session.metadata.paper_code as string;
					const num_questions = session.metadata.num_questions as string;
					const num_marks = session.metadata.num_marks as string;
					const paper = await prisma.paper.create({
						data: {
							name: paper_name,
							user_id: user.clerk_id,
							subject,
							exam_board,
							course_id,
							unit_name,
							paper_id: genID("paper"),
							paper_code,
							content: ''
						}
					});
					console.log('[Stripe Checkout] Paper created', { paperId: paper.paper_id });
					console.log('[Stripe Checkout] Triggering paper generate API', { paper_id: paper.paper_id });
					backendApi
						.post('/server/paper/generate', {
							paper_id: paper.paper_id,
							paper_name: paper.name,
							subject: capitalize(paper.subject),
							exam_board: capitalize(paper.exam_board),
							course: capitalize(sanitize(paper.unit_name)),
							num_questions: num_questions,
							num_marks: num_marks
						} as GeneratePaperPayload)
						.catch(err => {
							console.error('[Stripe Checkout] Paper generate API error', err);
						});
				}
			}
		}
		console.log('[Stripe Checkout] handleCheckoutSessionComplete completed successfully');
		return;
	} catch (err) {
		console.error('[Stripe Checkout] Handle checkout session error', err);
		throw err;
	}
};

export const handleInvoicePaid = async ({
	stripe,
	event,
	prisma,
	log
}: {
	stripe: Stripe;
	event: Stripe.Event;
	prisma: PrismaClient;
	log?: Logger;
}) => {
	const invoice = event.data.object as Stripe.Invoice;
	console.log('[Stripe Invoice] handleInvoicePaid called', { invoiceId: invoice.id, customerId: invoice.customer });
	if (!invoice.customer) throw new Error('No stripe customer found');
	// Check if the user with the corresponding ID already exists
	try {
		console.log('[Stripe Invoice] Looking up user by stripe_customer_id', { stripeCustomerId: invoice.customer });
		const user = await prisma.user.findUnique({
			where: {
				stripe_customer_id: String(invoice.customer)
			}
		});
		if (!user) throw new Error('User not found');
		console.log('[Stripe Invoice] User found', { clerk_id: user.clerk_id });
		// for each line item, check if the item is a subject
		// if so create the course under the user that purchased it
		for (const item of invoice.lines.data) {
			console.log('[Stripe Invoice] Processing line item', { priceId: item.price?.id });
			if (!item.price) throw new Error('No price found');
			const price = await stripe.prices.retrieve(String(item.price.id));
			console.log('[Stripe Invoice] Price retrieved', { priceId: price.id, metadata: price.metadata });
			console.log('-----------------------------------------');
			console.log(price);
			console.log('-----------------------------------------');
			if (price?.metadata?.subject && price?.metadata?.exam_board) {
				const subject = price.metadata.subject as Subject;
				const exam_board = price.metadata.exam_board as ExamBoard;
				const product_id = price.product;
				const course = await prisma.course.create({
					data: {
						name: price?.nickname ?? '',
						subject,
						exam_board,
						user_id: user.clerk_id,
						course_id: genID("course"),
						product_id: String(product_id) ?? null,
						year_level: 13
					}
				});
				console.log('[Stripe Invoice] Course created', { courseId: course.course_id });
				console.log('*****************************************');
				console.log(course);
				console.log('*****************************************');
			}
		}
		console.log('[Stripe Invoice] handleInvoicePaid completed successfully');
		return;
	} catch (err) {
		console.error('[Stripe Invoice] handleInvoicePaid error', err);
		throw err;
	}
};

function resolvePlanFromStripeSubscription(subscription: Stripe.Subscription): 'free' | 'plus' | 'pro' {
	const active =
		subscription.status === 'active' ||
		subscription.status === 'trialing' ||
		subscription.status === 'past_due';
	if (!active) return 'free';

	const raw = env.STRIPE_PLAN_MAP;
	if (!raw) return 'plus';
	try {
		const map = JSON.parse(raw) as Record<string, string>;
		for (const item of subscription.items.data) {
			const pid = typeof item.price === 'string' ? item.price : item.price?.id;
			if (pid && map[pid] && ['free', 'plus', 'pro'].includes(map[pid])) {
				return map[pid] as 'free' | 'plus' | 'pro';
			}
		}
	} catch {
		/* ignore */
	}
	return 'plus';
}

export const handleSubscriptionCreatedOrUpdated = async ({
	event,
	prisma,
	log
}: {
	event: Stripe.Event;
	prisma: PrismaClient;
	log?: Logger;
}) => {
	const subscription = event.data.object as Stripe.Subscription;
	console.log('[Stripe Subscription] handleSubscriptionCreatedOrUpdated called', { subscriptionId: subscription.id, customerId: subscription.customer, status: subscription.status });
	const customer_id = subscription.customer;
	const plan = resolvePlanFromStripeSubscription(subscription);
	console.log('[Stripe Subscription] Updating user with subscription data', { stripeCustomerId: customer_id, plan });
	await prisma.user.update({
		where: {
			stripe_customer_id: String(customer_id)
		},
		data: {
			stripe_subscription_id: subscription.id,
			stripe_subscription_status: subscription.status,
			plan
		}
	});
	console.log('[Stripe Subscription] handleSubscriptionCreatedOrUpdated completed');
	return;
};

export const handleSubscriptionCanceled = async ({
	event,
	prisma,
	log
}: {
	event: Stripe.Event;
	prisma: PrismaClient;
	log?: Logger;
}) => {
	const subscription = event.data.object as Stripe.Subscription;
	const userId = subscription.metadata.userId;
	console.log('[Stripe Subscription] handleSubscriptionCanceled called', { subscriptionId: subscription.id, userId });

	// remove subscription data from user
	console.log('[Stripe Subscription] Removing subscription data from user', { userId });
	await prisma.user.update({
		where: {
			id: Number(userId)
		},
		data: {
			stripe_subscription_id: null,
			stripe_subscription_status: null,
			plan: 'free'
		}
	});
	console.log('[Stripe Subscription] handleSubscriptionCanceled completed');
};
