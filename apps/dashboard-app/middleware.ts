// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
    '/login(.*)',
    '/signup(.*)',
    '/api/panel',
    '/api/clerk(.*)',
    '/api/openai(.*)',
    '/api/stripe(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
        await auth.protect();
    }
});

/*const isPublic = (path: string) => {
	return publicPaths.find(x => path.match(new RegExp(`^${x}$`.replace('*$', '($|/)'))));
};*/

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
    matcher: [
        '/((?!.*\\..*|_next).*)', '/',
        // '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)'
    ]
};
