//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withPlausibleProxy } = require('next-plausible');

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = withPlausibleProxy()({
	// Add any Next.js config options here
});

module.exports = nextConfig;
