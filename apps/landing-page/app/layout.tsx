import type { Metadata } from 'next';
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import localFont from 'next/font/local';
import Script from 'next/script';
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
		images: ['/static/favicon/android-chrome-192x192.png'],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Exam Genius',
		description: '',
		images: ['/static/favicon/android-chrome-192x192.png'],
	},
	icons: {
		icon: [
			{ url: '/static/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
			{ url: '/static/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
		],
		apple: '/static/favicon/apple-touch-icon.png',
	},
	manifest: '/static/favicon/site.webmanifest',
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
				<link rel="mask-icon" href="/static/favicon/safari-pinned-tab.svg" color="#5bbad5" />
			</head>
			<body className="font-sans">
				<PlausibleProvider domain="exam-genius.com">
					<Providers>{children}</Providers>
					<Analytics />
					{process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' && (
						<Script
							type="text/javascript"
							src="/static/script.js"
							onLoad={() => {
								console.log('Script has loaded');
							}}
						/>
					)}
				</PlausibleProvider>
			</body>
		</html>
	);
}
