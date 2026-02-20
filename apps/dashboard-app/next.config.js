//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withNx } = require('@nx/next/plugins/with-nx');
const { withAxiom } = require('next-axiom');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
	nx: {
		// Set this to true if you would like to use SVGR
		// See: https://github.com/gregberge/svgr
		svgr: false
	},
	transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
	experimental: {
		optimizePackageImports: ['@mantine/core', '@mantine/hooks', '@mantine/notifications', '@mantine/nprogress', '@mantine/modals', '@mantine/dates', '@mantine/form', '@mantine/carousel'],
	}
};

module.exports = withNx(withAxiom(nextConfig));
