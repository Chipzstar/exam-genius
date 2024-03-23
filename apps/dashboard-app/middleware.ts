// middleware.ts
import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { PATHS } from './utils/constants';

// Set the paths that don't require the user to be signed in
const publicRoutes = [
	'/signup',
	'/login',
	'/api/panel',
	'/api/:clerk*',
	'/api/:openai*',
	'/api/:stripe*'
];

/*const isPublic = (path: string) => {
	return publicPaths.find(x => path.match(new RegExp(`^${x}$`.replace('*$', '($|/)'))));
};*/

export default authMiddleware({
	debug: false,
	afterAuth(auth, req, evt) {
		// handle users who aren't authenticated
		if (!auth.userId && !auth.isPublicRoute) {
			const signInUrl = new URL(PATHS.LOGIN, req.url);
			console.log('Redirecting to LOGIN PAGE');
			return NextResponse.redirect(signInUrl);
		}
	},
	publicRoutes
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
	matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
};
