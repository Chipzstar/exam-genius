const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		join(__dirname, '{src,pages,components,containers,modals,layout}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
		...createGlobPatternsForDependencies(__dirname)
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-poppins)', ...fontFamily.sans]
			},
			colors: {
				primary: {
					DEFAULT: '#2742F5',
					50: '#D6DCFD',
					100: '#C3CAFC',
					200: '#9CA8FA',
					300: '#7586F9',
					400: '#4E64F7',
					500: '#2742F5',
					600: '#0A25DA',
					700: '#081CA4',
					800: '#05136F',
					900: '#030A39',
					950: '#01051E'
				},
				accent: {
					DEFAULT: '#EAEAEA',
					50: '#FFFFFF',
					100: '#FFFFFF',
					200: '#FFFFFF',
					300: '#FFFFFF',
					400: '#FEFEFE',
					500: '#EAEAEA',
					600: '#CECECE',
					700: '#B2B2B2',
					800: '#969696',
					900: '#7A7A7A',
					950: '#6C6C6C'
				}
			}
		}
	},
	plugins: []
};
