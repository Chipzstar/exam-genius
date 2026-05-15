import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextResponse } from 'next/server';
import { withAxiom, type AxiomRequest } from 'next-axiom';
import { createNewUser, deleteUser, updateUser } from '~/server/handlers/clerk-webhook-handlers';
import { prisma } from '~/server/prisma';
import { ClerkEvent } from '~/utils/types';
import stripe from '~/server/stripe';

export const POST = withAxiom(async (req: AxiomRequest) => {
	console.log('[Clerk Webhook] POST received');
	try {
		// Verify first – do not read req.body before this; verifyWebhook consumes the body
		const event = (await verifyWebhook(req)) as unknown as ClerkEvent;
		console.log('[Clerk Webhook] Verification successful', { eventType: event?.type, eventId: (event as any)?.id });

		switch (event.type) {
			case 'user.created':
				console.log('[Clerk Webhook] Dispatching user.created');
				await createNewUser({ event, prisma, log: req.log });
				console.log('[Clerk Webhook] user.created completed');
				break;
			case 'user.updated':
				console.log('[Clerk Webhook] Dispatching user.updated');
				await updateUser({ event, prisma, log: req.log });
				console.log('[Clerk Webhook] user.updated completed');
				break;
			case 'user.deleted':
				console.log('[Clerk Webhook] Dispatching user.deleted');
				await deleteUser({ event, prisma, log: req.log, stripe });
				console.log('[Clerk Webhook] user.deleted completed');
				break;
			default:
				console.log('[Clerk Webhook] Unhandled event type', { type: event.type });
		}
		console.log('[Clerk Webhook] Success, returning 200');
		return NextResponse.json({ received: true, message: `Webhook received!` });
	} catch (error) {
		console.error('[Clerk Webhook] Error', error);
		return NextResponse.json({ message: 'Server error!' }, { status: 500 });
	}
});

export async function OPTIONS() {
	return new NextResponse(null, {
		status: 200,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, svix-id, svix-timestamp, svix-signature',
		},
	});
}

