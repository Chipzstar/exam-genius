import { NextResponse } from 'next/server';
import { withAxiom, type AxiomRequest } from 'next-axiom';
import stripe from '~/server/stripe';
import { getOrCreateStripeCustomerIdForUser } from '~/server/handlers/stripe-webhook-handlers';
import { auth } from '~/server/auth';
import { prisma } from '~/server/prisma';
import { CHECKOUT_TYPE, PATHS } from '~/utils/constants';
import { PAPER_PRICE_IDS, SUBJECT_STRIPE_IDS } from '~/utils/constants.server';
import { validateLineItems } from '~/server/handlers';

export const POST = withAxiom(async (req: AxiomRequest) => {
	try {
		const authData = await auth();
		if (!authData?.userId) {
			return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
		}
		req.log.debug('Stripe checkout auth', { auth: authData });

		const body = await req.json();
		const { type, exam_board, subject, unit, course_id } = body;

		const customer_id = await getOrCreateStripeCustomerIdForUser({
			prisma,
			stripe,
			userId: authData.userId
		});
		if (!customer_id) throw new Error('Could not create customer');

		const baseUrl = process.env.VERCEL_URL
			? `https://${process.env.VERCEL_URL}`
			: process.env.RENDER_INTERNAL_HOSTNAME
			? `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`
			: `http://localhost:${process.env.PORT ?? 4200}`;

		if (type === CHECKOUT_TYPE.PAPER) {
			const price_id = PAPER_PRICE_IDS[subject];
			const session = await stripe.checkout.sessions.create({
				line_items: [
					{
						price: price_id,
						quantity: 1
					}
				],
				mode: 'payment',
				success_url: `${baseUrl}/${PATHS.COURSE}/${course_id}/${unit}/?subject=${subject}&board=${exam_board}&success=true`,
				cancel_url: `${baseUrl}/${PATHS.COURSE}/${course_id}/${unit}/?subject=${subject}&board=${exam_board}&canceled=true`,
				customer: customer_id,
				metadata: {
					type: CHECKOUT_TYPE.PAPER,
					userId: authData.userId,
					exam_board: exam_board,
					subject: subject,
					unit: unit,
					course_id: course_id
				}
			});
			if (session.url) {
				return NextResponse.redirect(session.url, { status: 303 });
			}
		} else {
			const price_id = SUBJECT_STRIPE_IDS[subject][exam_board];
			const { line_items, mode } = await validateLineItems(price_id);
			const session = await stripe.checkout.sessions.create({
				line_items,
				mode,
				success_url: `${baseUrl}/?success=true`,
				cancel_url: `${baseUrl}/${PATHS.EXAM_BOARD}?canceled=true`,
				customer: customer_id,
				metadata: {
					type: CHECKOUT_TYPE.COURSE,
					userId: authData.userId,
					exam_board: exam_board,
					subject: subject,
					unit: unit,
					course_id: course_id
				}
			});
			if (session.url) {
				return NextResponse.redirect(session.url, { status: 303 });
			}
		}

		return NextResponse.json({ error: 'Could not create checkout session' }, { status: 500 });
	} catch (error: any) {
		req.log.error('Stripe checkout error', { error: error.message });
		return NextResponse.json(
			{ error: error.message || 'Something went wrong' },
			{ status: error.statusCode || 500 }
		);
	}
});

export async function OPTIONS() {
	return new NextResponse(null, {
		status: 200,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		},
	});
}

