import type { Subject, ExamBoard } from '@exam-genius/shared/prisma';
import { logger } from '@exam-genius/shared/utils';
import type { Stripe } from 'stripe/cjs/stripe.core';
import type { Logger } from 'next-axiom';
import { CHECKOUT_TYPE } from '../../utils/constants';
import { capitalize, genCourseOrPaperName, genID, sanitize } from '../../utils/functions';
import { GeneratePaperPayload } from '../../utils/types';
import { env } from '~/env';
import { backendApi } from '~/server/backend-headers';
import { assertAsLevelExamFlowAllowedPlain } from '~/server/exam-level-guard';
import type { AppPrismaClient } from '~/server/prisma';
import { normalizeExamLevelInput } from '~/utils/exam-level';

export const getOrCreateStripeCustomerIdForUser = async ({
	stripe,
	prisma,
	userId
}: {
	stripe: Stripe;
	prisma: AppPrismaClient;
	userId: string | null;
}) => {
	logger.info('[Stripe] getOrCreateStripeCustomerIdForUser called', { userId });
	try {
		if (!userId) throw new Error('User not logged in!');
		logger.info('[Stripe] Looking up user by clerk_id', { userId });
		const user = await prisma.user.findUniqueOrThrow({
			where: {
				clerk_id: userId
			}
		});

		if (!user) throw new Error('User not found');
		logger.info('[Stripe] User found', { userId: user.clerk_id, stripeCustomerId: user.stripe_customer_id });

		if (user.stripe_customer_id) {
			logger.info('[Stripe] Returning existing stripe_customer_id', { stripe_customer_id: user.stripe_customer_id });
			return user.stripe_customer_id;
		}

		// create a new customer
		logger.info('[Stripe] Creating new Stripe customer');
		const customer = await stripe.customers.create({
			email: user.email ?? undefined,
			name: user.full_name ?? undefined,
			// use metadata to link this Stripe customer to internal user id
			metadata: {
				userId
			}
		});

		// update with new customer id
		logger.info('[Stripe] Updating user with new stripe_customer_id', { customerId: customer.id });
		const updatedUser = await prisma.user.update({
			where: {
				clerk_id: userId
			},
			data: {
				stripe_customer_id: customer.id
			}
		});

		if (updatedUser.stripe_customer_id) {
			logger.info('[Stripe] Returning newly created stripe_customer_id', { stripe_customer_id: updatedUser.stripe_customer_id });
			return updatedUser.stripe_customer_id;
		}
		logger.info('[Stripe] Returning customer.id', { customerId: customer.id });
		return customer.id;
	} catch (err) {
		logger.error('[Stripe] getOrCreateStripeCustomerIdForUser error', err);
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
	prisma: AppPrismaClient;
	log: Logger;
}) => {
	logger.info('[Stripe Checkout] handleCheckoutSessionComplete called', { eventId: event.id, eventType: event.type });
	try {
		const session = event.data.object as Stripe.Checkout.Session;
		logger.info('[Stripe Checkout] Session details', { sessionId: session.id, metadata: session?.metadata ?? {}, customerEmail: session.customer_email });
		const checkout_type = String(session?.metadata?.type);
		const metadataUserId = session?.metadata?.userId ?? '';
		logger.info('[Stripe Checkout] Looking up user', { metadataUserId, checkout_type });
		const user = await prisma.user.findUniqueOrThrow({
			where: {
				clerk_id: metadataUserId
			}
		});
		logger.info('[Stripe Checkout] User found', { clerk_id: user.clerk_id });
		const line_items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 5 });
		logger.info('[Stripe Checkout] Line items count', { count: line_items.data.length });
		for (const item of line_items.data) {
			logger.info('[Stripe Checkout] Processing line item', { priceId: item.price?.id });
			if (!item.price) throw new Error('No price found');
			const price = await stripe.prices.retrieve(String(item.price.id));
			logger.info('[Stripe Checkout] Price retrieved', { priceId: price.id, productId: price.product });
			if (checkout_type === CHECKOUT_TYPE.COURSE) {
				logger.info('[Stripe Checkout] Course checkout branch', { subject: session?.metadata?.subject, exam_board: session?.metadata?.exam_board });
				if (session?.metadata?.subject && session?.metadata?.exam_board) {
					const subject = session.metadata.subject as Subject;
					const exam_board = session.metadata.exam_board as ExamBoard;
					const exam_level = normalizeExamLevelInput(session.metadata.exam_level);
					assertAsLevelExamFlowAllowedPlain(exam_level);
					const year_level = exam_level === 'as_level' ? 12 : 13;
					const product_id = price.product;
					const course = await prisma.course.create({
						data: {
							name:
								price?.nickname ??
								genCourseOrPaperName(subject, exam_board, null, exam_level),
							subject,
							exam_board,
							exam_level,
							user_id: user.clerk_id,
							course_id: genID("course"),
							product_id: String(product_id) ?? null,
							year_level
						}
					});
					logger.info('[Stripe Checkout] Course created', course);
				}
			} else {
				logger.info('[Stripe Checkout] Paper checkout branch', { metadataKeys: session?.metadata ? Object.keys(session.metadata) : [] });
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
					const owningCourse = await prisma.course.findFirst({
						where: {
							course_id,
							user_id: user.clerk_id
						}
					});
					if (!owningCourse) {
						throw new Error('Course not found for paper checkout');
					}
					assertAsLevelExamFlowAllowedPlain(owningCourse.exam_level);
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
					logger.info('[Stripe Checkout] Paper created', { paperId: paper.paper_id });
					logger.info('[Stripe Checkout] Triggering paper generate API', { paper_id: paper.paper_id });
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
							logger.error('[Stripe Checkout] Paper generate API error', err);
						});
				}
			}
		}
		logger.info('[Stripe Checkout] handleCheckoutSessionComplete completed successfully');
		return;
	} catch (err) {
		logger.error('[Stripe Checkout] Handle checkout session error', err);
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
	prisma: AppPrismaClient;
	log?: Logger;
}) => {
	const invoice = event.data.object as Stripe.Invoice;
	logger.info('[Stripe Invoice] handleInvoicePaid called', { invoiceId: invoice.id, customerId: invoice.customer });
	if (!invoice.customer) throw new Error('No stripe customer found');
	// Check if the user with the corresponding ID already exists
	try {
		logger.info('[Stripe Invoice] Looking up user by stripe_customer_id', { stripeCustomerId: invoice.customer });
		const user = await prisma.user.findUnique({
			where: {
				stripe_customer_id: String(invoice.customer)
			}
		});
		if (!user) throw new Error('User not found');
		logger.info('[Stripe Invoice] User found', { clerk_id: user.clerk_id });
		// for each line item, check if the item is a subject
		// if so create the course under the user that purchased it
		for (const item of invoice.lines.data) {
			const priceRef = item.pricing?.price_details?.price;
			const priceId = priceRef == null ? null : typeof priceRef === 'string' ? priceRef : priceRef.id;
			logger.info('[Stripe Invoice] Processing line item', { priceId });
			if (!priceId) throw new Error('No price found');
			const price = await stripe.prices.retrieve(priceId);
			logger.info('[Stripe Invoice] Price retrieved', price);
			if (price?.metadata?.subject && price?.metadata?.exam_board) {
				const subject = price.metadata.subject as Subject;
				const exam_board = price.metadata.exam_board as ExamBoard;
				const exam_level = normalizeExamLevelInput(price.metadata.exam_level);
				assertAsLevelExamFlowAllowedPlain(exam_level);
				const year_level = exam_level === 'as_level' ? 12 : 13;
				const product_id = price.product;
				const course = await prisma.course.create({
					data: {
						name: price?.nickname ?? genCourseOrPaperName(subject, exam_board, null, exam_level),
						subject,
						exam_board,
						exam_level,
						user_id: user.clerk_id,
						course_id: genID("course"),
						product_id: String(product_id) ?? null,
						year_level
					}
				});
				logger.info('[Stripe Invoice] Course created', course);
			}
		}
		logger.info('[Stripe Invoice] handleInvoicePaid completed successfully');
		return;
	} catch (err) {
		logger.error('[Stripe Invoice] handleInvoicePaid error', err);
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
	prisma: AppPrismaClient;
	log?: Logger;
}) => {
	const subscription = event.data.object as Stripe.Subscription;
	const customer_id =
		typeof subscription.customer === 'string'
			? subscription.customer
			: subscription.customer?.id;
	logger.info('[Stripe Subscription] handleSubscriptionCreatedOrUpdated called', { subscriptionId: subscription.id, customerId: customer_id, status: subscription.status });
	if (!customer_id || typeof customer_id !== 'string') {
		logger.error('[Stripe Subscription] Subscription missing customer id', {
			subscriptionId: subscription.id
		});
		throw new Error('No stripe customer found');
	}
	const plan = resolvePlanFromStripeSubscription(subscription);
	logger.info('[Stripe Subscription] Updating user with subscription data', { stripeCustomerId: customer_id, plan });
	await prisma.user.update({
		where: {
			stripe_customer_id: customer_id
		},
		data: {
			stripe_subscription_id: subscription.id,
			stripe_subscription_status: subscription.status,
			plan
		}
	});
	logger.info('[Stripe Subscription] handleSubscriptionCreatedOrUpdated completed');
	return;
};

export const handleSubscriptionCanceled = async ({
	event,
	prisma,
	log
}: {
	event: Stripe.Event;
	prisma: AppPrismaClient;
	log?: Logger;
}) => {
	const subscription = event.data.object as Stripe.Subscription;
	const customer_id =
		typeof subscription.customer === 'string'
			? subscription.customer
			: subscription.customer?.id;
	logger.info('[Stripe Subscription] handleSubscriptionCanceled called', {
		subscriptionId: subscription.id,
		customerId: customer_id
	});

	if (!customer_id || typeof customer_id !== 'string') {
		logger.error('[Stripe Subscription] Canceled subscription missing customer', {
			subscriptionId: subscription.id
		});
		throw new Error('No stripe customer found');
	}

	// Match handleSubscriptionCreatedOrUpdated: checkout metadata uses Clerk `userId`,
	// but the DB row is keyed by `stripe_customer_id`, not numeric `User.id`.
	logger.info('[Stripe Subscription] Clearing subscription fields for customer', {
		stripeCustomerId: customer_id
	});
	await prisma.user.update({
		where: {
			stripe_customer_id: customer_id
		},
		data: {
			stripe_subscription_id: null,
			stripe_subscription_status: null,
			plan: 'free'
		}
	});
	logger.info('[Stripe Subscription] handleSubscriptionCanceled completed');
};
