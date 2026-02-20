import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { ClerkProvider } from '@clerk/nextjs';
import { AxiomWebVitals } from 'next-axiom';
import { TRPCReactProvider } from '~/trpc/react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '../../styles/globals.css';
import Favicon from '~/components/Favicon';

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

export default function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider>
			<html lang="en-GB" className={poppins.variable}>
				<head>
					<ColorSchemeScript defaultColorScheme="light" />
					<Favicon />
				</head>
				<body className="font-sans">
					<AxiomWebVitals />
					<MantineProvider
						defaultColorScheme="light"
						theme={{
							colors: {
								brand: [
									'#D6DCFD',
									'#C3CAFC',
									'#9CA8FA',
									'#7586F9',
									'#4E64F7',
									'#2742F5',
									'#0A25DA',
									'#081CA4',
									'#05136F',
									'#030A39'
								]
							},
							primaryColor: 'brand',
							fontFamily: poppins.style.fontFamily,
							fontFamilyMonospace: 'Monaco, Courier, monospace',
							headings: { fontFamily: poppins.style.fontFamily },
							components: {
								Input: {
									styles: {
										input: {
											borderColor: '#2742F5',
											borderWidth: '1px',
											borderStyle: 'solid'
										}
									}
								}
							}
						}}
					>
						<Notifications position="top-right" />
						<TRPCReactProvider>
							{children}
						</TRPCReactProvider>
					</MantineProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}

