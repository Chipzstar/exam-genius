// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuth, withClerkMiddleware } from '@clerk/nextjs/server';

// Set the paths that don't require the user to be signed in
const publicPaths = ['/signup*', '/login*', '/api/clerk/**', '/api/trpc/auth.**', '/api/trpc/course.**', '/api/stripe/**'];

const isPublic = (path: string) => {
	return publicPaths.find(x => path.match(new RegExp(`^${x}$`.replace('*$', '($|/)'))));
};

export default withClerkMiddleware((request: NextRequest) => {
	if (isPublic(request.nextUrl.pathname)) {
		// console.log("PUBLIC: ", request.nextUrl.pathname);
		return NextResponse.next();
	}
	// console.log("PRIVATE: ", request.nextUrl.pathname);
	// if the user is not signed in redirect them to the sign-in page.
	const { userId } = getAuth(request);

	if (!userId) {
		// redirect the users to /pages/sign-in/[[...index]].ts
		const signInUrl = new URL('/login', request.url);
		signInUrl.searchParams.set('redirect_url', request.url);
		return NextResponse.redirect(signInUrl);
	}
	return NextResponse.next();
});

export const config = {
	/*
     * Match all request paths except for the ones starting with:
     * - api folder
     * - trpc
     * - _next
     * - static (static files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public folder
     */
	matcher: ['/(.*?trpc.*?|(?!static|.*\\..*|_next|favicon.ico).*)']
};
