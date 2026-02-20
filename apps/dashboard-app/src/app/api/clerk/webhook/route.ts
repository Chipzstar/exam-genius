import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextResponse } from 'next/server';
import { withAxiom, type AxiomRequest } from 'next-axiom';
import { createNewUser, deleteUser, updateUser } from '~/server/handlers/clerk-webhook-handlers';
import { prisma } from '~/server/prisma';
import { ClerkEvent } from '~/utils/types';

export const POST = withAxiom(async (req: AxiomRequest) => {
	try {
		const payload = await req.text();
		req.log.info('Clerk webhook payload', { payload });
		let event: ClerkEvent | null = null;
		event = (await verifyWebhook(req)) as unknown as ClerkEvent;

		switch (event.type) {
			case 'user.created':
				await createNewUser({ event, prisma, log: req.log });
				break;
			case 'user.updated':
				await updateUser({ event, prisma, log: req.log });
				break;
			case 'user.deleted':
				await deleteUser({ event, prisma, log: req.log });
				break;
			default:
				req.log.info('Unhandled event type', { type: event.type });
		}
		return NextResponse.json({ received: true, message: `Webhook received!` });
	} catch (error) {
		req.log.error('Clerk webhook error', { error: String(error) });
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

