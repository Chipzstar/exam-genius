import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextRequest, NextResponse } from 'next/server';
import { createNewUser, deleteUser, updateUser } from '~/server/handlers/clerk-webhook-handlers';
import { log } from '~/server/logtail';
import { prisma } from '~/server/prisma';
import { ClerkEvent } from '~/utils/types';

export async function POST(req: NextRequest) {
	try {
		const payload = await req.text();
		log.info(payload);
		let event: ClerkEvent | null = null;
		event = await verifyWebhook(req) as unknown as ClerkEvent;

		switch (event.type) {
			case 'user.created':
				await createNewUser({event, prisma})
				break;
			case 'user.updated':
				await updateUser({event, prisma})
				break;
			case 'user.deleted':
				await deleteUser({event, prisma})
				break;
			default:
				console.log(`Unhandled event type ${event.type}`);
		}
		return NextResponse.json({ received: true, message: `Webhook received!` });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Server error!' }, { status: 500 });
	}
}

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

