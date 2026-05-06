import { withAxiom, type AxiomRequest } from 'next-axiom';
import { NextResponse } from 'next/server';
import {
	handleCheckoutSessionComplete,
	handleSubscriptionCanceled,
	handleSubscriptionCreatedOrUpdated
} from '~/server/handlers/stripe-webhook-handlers';
import { prisma } from '~/server/prisma';
import stripe from '~/server/stripe';
import { env } from '~/env';

const endpointSecret = env.STRIPE_WEBHOOK_SECRET;

export const POST = withAxiom(async (req: AxiomRequest) => {
	try {
		const body = await req.text();
		const sig = req.headers.get('stripe-signature');

		if (!sig) {
			return NextResponse.json({ error: 'No stripe-signature header found' }, { status: 400 });
		}

		const event = stripe.webhooks.constructEvent(body, sig, endpointSecret);

		switch (event.type) {
			case 'invoice.payment_succeeded':
				req.log.info('Stripe webhook: invoice.payment_succeeded');
				break;
			case 'checkout.session.completed':
				await handleCheckoutSessionComplete({
					stripe,
					event,
					prisma,
					log: req.log
				});
				break;
			case 'customer.created':
				break;
			case 'customer.updated':
				break;
			case 'customer.subscription.created':
				await handleSubscriptionCreatedOrUpdated({
					event,
					prisma,
					log: req.log
				});
				break;
			case 'customer.subscription.deleted':
				await handleSubscriptionCanceled({ event, prisma, log: req.log });
				break;
			case 'customer.subscription.updated':
				await handleSubscriptionCreatedOrUpdated({
					event,
					prisma,
					log: req.log
				});
				break;
			default:
				req.log.info('Unhandled Stripe event type', { type: event.type });
		}

		return NextResponse.json({ received: true, message: 'Event processed successfully' });
	} catch (err: any) {
		req.log.error('Stripe webhook error', { error: err.message });
		return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
	}
});

