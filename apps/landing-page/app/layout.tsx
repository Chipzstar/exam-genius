import '@mantine/carousel/styles.css';
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import '@mantine/core/styles.css';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import localFont from 'next/font/local';
import '../styles/globals.css';
import { Providers } from './providers';

const poppins = localFont({
	src: [
		{ path: '../public/static/fonts/Poppins/Poppins-Thin.ttf', weight: '300', style: 'normal' },
		{ path: '../public/static/fonts/Poppins/Poppins-Regular.ttf', weight: '400', style: 'normal' },
		{ path: '../public/static/fonts/Poppins/Poppins-Italic.ttf', weight: '400', style: 'italic' },
		{ path: '../public/static/fonts/Poppins/Poppins-Medium.ttf', weight: '500', style: 'normal' },
		{ path: '../public/static/fonts/Poppins/Poppins-SemiBold.ttf', weight: '600', style: 'normal' },
		{ path: '../public/static/fonts/Poppins/Poppins-Bold.ttf', weight: '700', style: 'normal' },
		{ path: '../public/static/fonts/Poppins/Poppins-BoldItalic.ttf', weight: '700', style: 'italic' }
	],
	variable: '--font-poppins'
});

export const metadata: Metadata = {
	title: 'Exam Genius',
	description:
		'Generate AI-powered A-Level predicted papers, practise in mock conditions, study with hints, and review your answers with ExamGenius.',
	keywords: 'A-Level predicted papers, AI exam prep, A-Level revision, exam practice, ExamGenius',
	metadataBase: new URL('https://www.exam-genius.com'),
	openGraph: {
		type: 'website',
		url: 'https://www.exam-genius.com/',
		title: 'Exam Genius',
		description:
			'AI-powered exam practice for A-Level students: predicted papers, mock mode, study hints, review tools and printable revision assets.',
		images: ['/static/favicon/web-app-manifest-512x512.png']
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Exam Genius',
		description:
			'Generate predicted papers and practise with a complete AI exam-prep workspace built around real A-Level formats.',
		images: ['/static/favicon/web-app-manifest-512x512.png']
	},
	icons: {
		icon: [
			{ url: '/static/favicon/icon.svg', type: 'image/svg+xml' },
			{ url: '/static/favicon/favicon.ico', sizes: 'any' }
		],
		apple: '/static/favicon/apple-icon.png'
	},
	manifest: '/static/favicon/manifest.json',
	other: {
		'msapplication-TileColor': '#da532c',
		'theme-color': '#2742F5'
	}
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en-GB' {...mantineHtmlProps} className={poppins.variable} suppressHydrationWarning>
			<head>
				<ColorSchemeScript defaultColorScheme='light' />
				<meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
			</head>
			<body className='font-sans'>
				{/* useSearchParams() in Providers requires Suspense for static prerender (e.g. /_not-found) */}
				<Suspense fallback={null}>
					<Providers>{children}</Providers>
				</Suspense>
				<Analytics />
			</body>
		</html>
	);
}
