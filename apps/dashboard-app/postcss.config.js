const { join } = require('path');

// Note: If you use library-specific PostCSS/Tailwind configuration then you should remove the `postcssConfig` build
// option from your application's configuration (i.e. project.json).
//
// See: https://nx.dev/guides/using-tailwind-css-in-react#step-4:-applying-configuration-to-libraries

module.exports = {
	plugins: {
		'postcss-preset-mantine': {},
		'postcss-simple-vars': {
			variables: {
				'mantine-breakpoint-xs': '36em',
				'mantine-breakpoint-sm': '48em',
				'mantine-breakpoint-md': '62em',
				'mantine-breakpoint-lg': '75em',
				'mantine-breakpoint-xl': '88em',
			},
		},
		tailwindcss: {
			config: join(__dirname, 'tailwind.config.js'),
		},
		autoprefixer: {},
	},
};
