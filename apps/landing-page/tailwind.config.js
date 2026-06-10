const { join } = require('path');
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		join(__dirname, 'app/**/*.{ts,tsx,html}'),
		join(__dirname, '{components,containers,modals,layout,context}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
		join(__dirname, '../../libs/shared/ui/src/**/*.{ts,tsx,html}'),
		join(__dirname, '../../libs/shared/utils/src/**/*.{ts,tsx,html}')
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-poppins)', ...fontFamily.sans]
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#2742F5',
					foreground: '#FFFFFF',
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
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				}
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: []
};
