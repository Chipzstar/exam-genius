import { auth as clerkAuth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export const auth = clerkAuth;

export async function requireAuth() {
	const { userId } = await auth();
	if (!userId) {
		redirect('/login');
	}
	return userId;
}

