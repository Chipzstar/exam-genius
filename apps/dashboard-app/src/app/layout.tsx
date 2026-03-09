import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { ColorSchemeScript } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '../../styles/globals.css';
import Favicon from '~/components/Favicon';
import { Providers } from './Providers';

const poppins = localFont({
	src: [
		{
			path: '../../public/static/fonts/Poppins/Poppins-Thin.ttf',
			weight: '300',
			style: 'normal'
		},
		{
			path: '../../public/static/fonts/Poppins/Poppins-Regular.ttf',
			weight: '400',
			style: 'normal'
		},
		{
			path: '../../public/static/fonts/Poppins/Poppins-Italic.ttf',
			weight: '400',
			style: 'italic'
		},
		{
			path: '../../public/static/fonts/Poppins/Poppins-Medium.ttf',
			weight: '500',
			style: 'normal'
		},
		{
			path: '../../public/static/fonts/Poppins/Poppins-SemiBold.ttf',
			weight: '600',
			style: 'normal'
		},
		{
			path: '../../public/static/fonts/Poppins/Poppins-Bold.ttf',
			weight: '700'
		},
		{
			path: '../../public/static/fonts/Poppins/Poppins-BoldItalic.ttf',
			weight: '700',
			style: 'italic'
		}
	],
	variable: '--font-poppins'
});

export const metadata: Metadata = {
	title: 'Exam Genius',
	description: '',
	keywords: '',
	other: {
		'content-language': 'en-GB'
	}
};

function getBaseUrl() {
	// Server-only: used when passing to client so client bundle never touches server env
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
	if (process.env.RENDER_INTERNAL_HOSTNAME)
		return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
	return `http://localhost:${process.env.PORT ?? 4200}`;
}

export default function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	const baseUrl = getBaseUrl();
	return (
		<html lang="en-GB" className={poppins.variable}>
			<head>
				<ColorSchemeScript defaultColorScheme="light" />
				<Favicon />
			</head>
			<body className="font-sans">
				<Providers baseUrl={baseUrl}>{children}</Providers>
			</body>
		</html>
	);
}

