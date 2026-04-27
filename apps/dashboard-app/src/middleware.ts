import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
	'/login(.*)',
	'/signup(.*)',
	'/api/panel',
	'/api/clerk/webhook',
	'/api/clerk(.*)',
	'/api/openai(.*)',
	'/api/stripe(.*)',
	'/api/trpc(.*)',
	'/api/uploadthing(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
	if (!isPublicRoute(req)) {
		await auth.protect();
	}
});

export const config = {
	matcher: [
		'/((?!.*\\..*|_next).*)',
		'/(api|trpc)(.*)'
	]
};
