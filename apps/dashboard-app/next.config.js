//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withAxiom } = require('next-axiom');

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
	transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
	experimental: {
		optimizePackageImports: ['@mantine/core', '@mantine/hooks', '@mantine/notifications', '@mantine/nprogress', '@mantine/modals', '@mantine/dates', '@mantine/form', '@mantine/carousel'],
	}
};

module.exports = withAxiom(nextConfig);
