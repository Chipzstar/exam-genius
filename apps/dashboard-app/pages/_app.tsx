import { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';
import { createEmotionCache, MantineProvider } from '@mantine/core';
import { ClerkProvider } from '@clerk/nextjs';
import { trpc } from '../utils/trpc';
import { Notifications } from '@mantine/notifications';
import localFont from '@next/font/local';
import Layout from '../layout/Layout';

const poppins = localFont({
	src: [
		{
			path: '../public/static/fonts/Poppins/Poppins-Thin.ttf',
			weight: '300',
			style: 'normal'
		},
		{
			path: '../public/static/fonts/Poppins/Poppins-Regular.ttf',
			weight: '400',
			style: 'normal'
		},
		{
			path: '../public/static/fonts/Poppins/Poppins-Italic.ttf',
			weight: '400',
			style: 'italic'
		},
		{
			path: '../public/static/fonts/Poppins/Poppins-Medium.ttf',
			weight: '500',
			style: 'normal'
		},
		{
			path: '../public/static/fonts/Poppins/Poppins-SemiBold.ttf',
			weight: '600',
			style: 'normal'
		},
		{
			path: '../public/static/fonts/Poppins/Poppins-Bold.ttf',
			weight: '700'
		},
		{
			path: '../public/static/fonts/Poppins/Poppins-BoldItalic.ttf',
			weight: '700',
			style: 'italic'
		}
	],
	variable: '--font-poppins'
});

const appendCache = createEmotionCache({ key: 'mantine', prepend: false });

function CustomApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>Exam Genius</title>
			</Head>
			<ClerkProvider {...pageProps}>
				<MantineProvider
					emotionCache={appendCache}
					withGlobalStyles
					withNormalizeCSS
					theme={{
						/** Put your mantine theme override here */
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
						primaryShade: 5,
						colorScheme: 'light',
						fontFamily: 'Poppins',
						fontFamilyMonospace: 'Monaco, Courier, monospace',
						headings: { fontFamily: 'Poppins' },
						components: {
							Input: {
								styles: theme => ({
									input: {
										borderColor: '#2742F5',
										borderWidth: '1px',
										borderStyle: 'solid'
									}
								})
							}
						}
					}}
				>
					<main className={`${poppins.variable}`}>
						<Notifications />
						<Layout>
							<Component {...pageProps} />
						</Layout>
					</main>
				</MantineProvider>
			</ClerkProvider>
		</>
	);
}

export default trpc.withTRPC(CustomApp);
