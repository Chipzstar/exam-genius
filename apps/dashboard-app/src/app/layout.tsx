import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { ColorSchemeScript } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/carousel/styles.css';
import 'katex/dist/katex.min.css';
import '../../styles/globals.css';
import Favicon from '~/components/Favicon';
import { Providers } from './Providers';
import { ThemeToggleFloating } from '~/components/ThemeToggle';
import { env } from '~/env';
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { extractRouterConfig } from 'uploadthing/server';
import { ourFileRouter } from '~/app/api/uploadthing/core';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

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
	},
};

function getBaseUrl() {
	// Server-only: used when passing to client so client bundle never touches server env
	return env.APP_BASE_URL || `http://localhost:${env.PORT ?? 3000}`;
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
				<ColorSchemeScript defaultColorScheme="dark" />
				<Favicon />
			</head>
			<body className="font-sans">
				<NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
				<NuqsAdapter>
					<Providers baseUrl={baseUrl}>
						<>
							{children}
							<ThemeToggleFloating />
						</>
					</Providers>
				</NuqsAdapter>
			</body>
		</html>
	);
}

