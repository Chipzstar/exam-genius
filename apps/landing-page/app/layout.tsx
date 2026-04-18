import type { Metadata } from 'next';
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import localFont from 'next/font/local';
import PlausibleProvider from 'next-plausible';
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '../styles/globals.css';
import { Providers } from './providers';
import { Analytics } from '@vercel/analytics/next';

const poppins = localFont({
	src: [
		{ path: '../public/static/fonts/Poppins/Poppins-Thin.ttf', weight: '300', style: 'normal' },
		{ path: '../public/static/fonts/Poppins/Poppins-Regular.ttf', weight: '400', style: 'normal' },
		{ path: '../public/static/fonts/Poppins/Poppins-Italic.ttf', weight: '400', style: 'italic' },
		{ path: '../public/static/fonts/Poppins/Poppins-Medium.ttf', weight: '500', style: 'normal' },
		{ path: '../public/static/fonts/Poppins/Poppins-SemiBold.ttf', weight: '600', style: 'normal' },
		{ path: '../public/static/fonts/Poppins/Poppins-Bold.ttf', weight: '700', style: 'normal' },
		{ path: '../public/static/fonts/Poppins/Poppins-BoldItalic.ttf', weight: '700', style: 'italic' },
	],
	variable: '--font-poppins',
});

export const metadata: Metadata = {
	title: 'Exam Genius',
	description: '',
	keywords: '',
	metadataBase: new URL('https://www.exam-genius.com'),
	openGraph: {
		type: 'website',
		url: 'https://www.exam-genius.com/',
		title: 'Exam Genius',
		description: '',
		images: ['/static/favicon/web-app-manifest-512x512.png'],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Exam Genius',
		description: '',
		images: ['/static/favicon/web-app-manifest-512x512.png'],
	},
	icons: {
		icon: [
			{ url: '/static/favicon/icon.svg', type: 'image/svg+xml' },
			{ url: '/static/favicon/favicon.ico', sizes: 'any' },
		],
		apple: '/static/favicon/apple-icon.png',
	},
	manifest: '/static/favicon/manifest.json',
	other: {
		'msapplication-TileColor': '#da532c',
		'theme-color': '#2742F5',
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en-GB" {...mantineHtmlProps} className={poppins.variable} suppressHydrationWarning>
			<head>
				<ColorSchemeScript defaultColorScheme="light" />
				<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
			</head>
			<body className="font-sans">
				<PlausibleProvider domain="exam-genius.com">
					<Providers>{children}</Providers>
					<Analytics />
				</PlausibleProvider>
			</body>
		</html>
	);
}
