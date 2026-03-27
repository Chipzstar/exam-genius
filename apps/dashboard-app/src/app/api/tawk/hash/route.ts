import { createHmac } from 'crypto';
import { NextResponse } from 'next/server';
import { auth } from '~/server/auth';
import { env } from '~/env';

/**
 * Returns a Tawk.to secure-mode HMAC hash for the currently signed-in Clerk user.
 * Hash = HMAC-SHA256(userId, TAWK_API_KEY)
 * @see https://developer.tawk.to/jsapi/#Secure_Mode
 */
export async function GET() {
	const { userId } = await auth();
	if (!userId) {
		return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
	}

	const hash = createHmac('sha256', env.TAWK_API_KEY).update(userId).digest('hex');
	return NextResponse.json({ hash, userId });
}
