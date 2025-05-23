//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withNx } = require('@nx/next/plugins/with-nx');
const { withPlausibleProxy } = require('next-plausible');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = withPlausibleProxy()({
	nx: {
		// Set this to true if you would like to use SVGR
		// See: https://github.com/gregberge/svgr
		svgr: false
	}
});

module.exports = withNx(nextConfig);
