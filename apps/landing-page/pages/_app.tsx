import { AppProps } from 'next/app';
import Head from 'next/head';
import Favicon from '../components/Favicon';
import React, { useState } from 'react';
import { createEmotionCache, MantineProvider } from '@mantine/core';
import localFont from '@next/font/local';
import '../styles/globals.css';
import PlausibleProvider from 'next-plausible';
import { SneakPeakContext } from '../context/SneakPeakContext';
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';

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
	const [sneak, showSneakPeak] = useState(false);
	return (
		<PlausibleProvider domain='exam-genius.com'>
			<Head>
				<Favicon />
				<title>Exam Genius</title>
				<meta name='title' content='Exam Genius' />
				<meta name='description' content='' />
				<meta name='keywords' content='' />
				{process.env.NEXT_PUBLIC_VERCEL_ENV === "production" && <Script
					type='text/javascript'
					src='/static/script.js'
					onLoad={() => {
						console.log('Script has loaded');
					}}
				/>}
				{/* Open Graph / Facebook -->*/}
				<meta property='og:type' content='website' />
				<meta property='og:url' content='https://www.exam-genius.com/' />
				<meta property='og:title' content='Exam Genius' />
				<meta property='og:description' content='' />
				<meta property='og:image' content='/static/favicon/android-chrome-192x192.png' />
				{/* <!-- Twitter --> */}
				<meta property='twitter:card' content='summary_large_image' />
				<meta property='twitter:url' content='https://www.exam-genius.com/' />
				<meta property='twitter:title' content='Exam Genius' />
				<meta property='twitter:description' content='' />
				<meta property='twitter:image' content='/static/favicon/android-chrome-192x192.png' />
				<meta httpEquiv='content-language' content='en-GB' />
				<meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
			</Head>
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
					fontFamily: poppins.style.fontFamily,
					fontFamilyMonospace: 'Monaco, Courier, monospace',
					headings: { fontFamily: poppins.style.fontFamily },
					components: {
						Input: {
							styles: () => ({
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
				<SneakPeakContext.Provider value={[sneak, showSneakPeak]}>
					<main className={`${poppins.variable} font-sans`}>
						<Component {...pageProps} />
						<Analytics mode='production' />
					</main>
				</SneakPeakContext.Provider>
			</MantineProvider>
		</PlausibleProvider>
	);
}

export default CustomApp;
