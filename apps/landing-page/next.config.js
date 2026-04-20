//@ts-check

const isPrd = process.env.DOPPLER_ENVIRONMENT === 'prd';

/**
 * PostHog reverse-proxy rewrites (EU region).
 * Active only in production to prevent ad-blockers from dropping analytics.
 * Paths deliberately avoid obvious names per PostHog guidance.
 * @see https://posthog.com/docs/advanced/proxy/nextjs
 */
async function posthogRewrites() {
	if (!isPrd) return [];
	return [
		{
			source: '/ph/static/:path*',
			destination: 'https://eu-assets.i.posthog.com/static/:path*'
		},
		{
			source: '/ph/array/:path*',
			destination: 'https://eu-assets.i.posthog.com/array/:path*'
		},
		{
			source: '/ph/:path*',
			destination: 'https://eu.i.posthog.com/:path*'
		}
	];
}

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
	// Required so PostHog's trailing-slash API paths (e.g. /e/) are not redirected away.
	skipTrailingSlashRedirect: isPrd,
	rewrites: posthogRewrites
};

module.exports = nextConfig;
