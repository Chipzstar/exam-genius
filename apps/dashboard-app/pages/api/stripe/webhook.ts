import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';
import prisma from '../../../server/prisma';
import {
	handlePaymentCreatedOrUpdated,
	handleSubscriptionCanceled,
	handleSubscriptionCreatedOrUpdated
} from '../../../server/handlers/stripe-webhook-handlers';
import stripe from '../../../server/stripe';

// Stripe requires the raw body to construct the event.
export const config = {
	api: {
		bodyParser: false,
	},
};

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = String(process.env.STRIPE_WEBHOOK_SECRET);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'POST') {
		const buf = await buffer(req);
		const sig = req.headers['stripe-signature'];
		let event: Stripe.Event;
		try {
			if (!sig) {
				throw new Error('No stripe-signature header found');
			} else {
				event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
			}
			// Handle the event
			switch (event.type) {
				case 'checkout.session.async_payment_failed':
					const checkoutSessionAsyncPaymentFailed = event.data.object;
					// Then define and call a function to handle the event checkout.session.async_payment_failed
					break;
				case 'checkout.session.async_payment_succeeded':
					await handlePaymentCreatedOrUpdated({
						event,
						prisma
					});
					break;
				case 'checkout.session.completed':
					await handlePaymentCreatedOrUpdated({
						event,
						prisma
					});
					break;
				case 'checkout.session.expired':
					const checkoutSessionExpired = event.data.object;
					// Then define and call a function to handle the event checkout.session.expired
					break;
				case 'customer.created':
					const customerCreated = event.data.object;
					// Then define and call a function to handle the event customer.created
					break;
				case 'customer.updated':
					const customerUpdated = event.data.object;
					// Then define and call a function to handle the event customer.updated
					break;
				case 'customer.subscription.created':
					await handleSubscriptionCreatedOrUpdated({
						event,
						prisma
					});
					break;
				case 'customer.subscription.cancelled':
					await handleSubscriptionCanceled({ event, prisma });
					break;
				case 'customer.subscription.updated':
					await handleSubscriptionCanceled({ event, prisma });
					break;
				// ... handle other event types
				default:
					console.log(`Unhandled event type ${event.type}`);
			}
			// record the event in the database
			await prisma.stripeEvent.create({
				data: {
					id: event.id,
					type: event.type,
					object: event.object,
					api_version: event.api_version,
					account: event.account,
					created: new Date(event.created * 1000), // convert to milliseconds
					data: {
						object: event.data.object,
						previous_attributes: event.data.previous_attributes,
					},
					livemode: event.livemode,
					pending_webhooks: event.pending_webhooks,
					request: {
						id: event.request?.id,
						idempotency_key: event.request?.idempotency_key,
					},
				},
			});
			// Return a 200 response to acknowledge receipt of the event
			return res.status(200).json({ received: true, message: 'Event processed successfully' });
		} catch (err) {
			return res.status(400).send(`Webhook Error: ${err.message}`);
			return;
		}
	} else {
		res.setHeader('Allow', 'POST');
		res.status(405).end('Method Not Allowed');
	}
}
