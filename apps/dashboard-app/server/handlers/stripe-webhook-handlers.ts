import type { PrismaClient } from '@prisma/client';
import type Stripe from 'stripe';

// retrieves a Stripe customer id for a given user if it exists or creates a new one
export const getOrCreateStripeCustomerIdForUser = async ({
	stripe,
	prisma,
	userId
}: {
	stripe: Stripe;
	prisma: PrismaClient;
	userId: number;
}) => {
	const user = await prisma.user.findUniqueOrThrow({
		where: {
			id: userId
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
			id: userId
		},
		data: {
			stripe_customer_id: customer.id
		}
	});

	if (updatedUser.stripe_customer_id) {
		return updatedUser.stripe_customer_id;
	}
};

export const handleInvoicePaid = async ({
	event,
	stripe,
	prisma
}: {
	event: Stripe.Event;
	stripe: Stripe;
	prisma: PrismaClient;
}) => {
	const invoice = event.data.object as Stripe.Invoice;
	const subscriptionId = invoice.subscription;
	const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
	const userId = subscription.metadata.userId;

	// update user with subscription data
	await prisma.user.update({
		where: {
			id: Number(userId)
		},
		data: {
			stripe_subscription_id: subscription.id,
			stripe_subscription_status: subscription.status
		}
	});
};

export const handleSubscriptionCreatedOrUpdated = async ({
	event,
	prisma
}: {
	event: Stripe.Event;
	prisma: PrismaClient;
}) => {
	const subscription = event.data.object as Stripe.Subscription;
	const userId = subscription.metadata.userId;

	// update user with subscription data
	await prisma.user.update({
		where: {
			id: Number(userId)
		},
		data: {
			stripe_subscription_id: subscription.id,
			stripe_subscription_status: subscription.status
		}
	});
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
