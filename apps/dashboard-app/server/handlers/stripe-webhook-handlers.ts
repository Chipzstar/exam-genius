import type { PrismaClient } from '@prisma/client';
import type Stripe from 'stripe';
import { SignedInAuthObject } from '@clerk/nextjs/dist/api';

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
				clerkId: userId
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
				clerkId: userId
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

export const handlePaymentCreatedOrUpdated = async ({
	event,
	prisma
}: {
	event: Stripe.Event;
	prisma: PrismaClient;
}) => {
	const session = event.data.object as Stripe.Checkout.Session;
	console.log(session)
	// verify that the session has the userId attached to it
	if (!session?.metadata?.userId) {
		throw new Error('Session does not belong to a system user');
	}
	// Check if the user with the corresponding ID already exists
	const user = await prisma.user.findUnique({
		where: {
            id: Number(session.metadata.userId)
        }
	})
	if (!user) throw new Error('User not found');
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
	console.log("USER ID:", userId);
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

export const validateLineItems = async ({
	auth,
	prisma,
	price_id
}: {
	auth: SignedInAuthObject;
	prisma: PrismaClient;
	price_id: string;
}): Promise<{
	line_items: Stripe.Checkout.SessionCreateParams.LineItem[];
	mode: Stripe.Checkout.SessionCreateParams.Mode;
}> => {
	try {
		let mode: Stripe.Checkout.SessionCreateParams.Mode = 'payment';
		const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
		const user = await prisma.user.findUniqueOrThrow({
			where: {
				clerkId: auth.userId
			}
		});
		// check if the user is already subscribed to a plan
		// if not subscribed add, the Genius Plan product to the checkout
		if (user.stripe_subscription_status !== 'active') {
			line_items.push({
				// Provide the exact Price ID (for example, pr_1234) of the product you want to sell
				price: 'price_1MvmiEJOIoW2Wbjc8fdJPWer',
				quantity: 1
			});
			// set mode of the checkout session to "subscription
			mode = 'subscription';
		}
		line_items.push({
			price: price_id,
			quantity: 1
		});
		return { line_items, mode };
	} catch (err) {
		console.error(err);
		throw err;
	}
};
