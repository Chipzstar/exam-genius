'use client';

import { useEffect, useState } from 'react';
import { createTheme, MantineProvider } from '@mantine/core';
import { emotionTransform, MantineEmotionProvider } from '@mantine/emotion';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { SneakPeakContext } from '../context/SneakPeakContext';
import { trackLandingPageVisit } from '../utils/analytics';

const theme = createTheme({
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
			'#030A39',
		],
	},
	primaryColor: 'brand',
	primaryShade: 5,
	fontFamily: 'var(--font-poppins), Poppins, sans-serif',
	fontFamilyMonospace: 'Monaco, Courier, monospace',
	headings: { fontFamily: 'var(--font-poppins), Poppins, sans-serif' },
	components: {
		Input: {
			styles: () => ({
				input: {
					borderColor: '#2742F5',
					borderWidth: '1px',
					borderStyle: 'solid',
				},
			}),
		},
	},
});

export function Providers({ children }: { children: React.ReactNode }) {
	const [sneak, showSneakPeak] = useState(false);
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const search = searchParams.toString();

	useEffect(() => {
		const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
		const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

		if (!posthogKey) return;

		const posthogClient = posthog as { __loaded?: boolean };
		if (posthogClient.__loaded) return;

		posthog.init(posthogKey, {
			api_host: posthogHost,
			autocapture: true,
			capture_pageview: false,
			capture_pageleave: true,
			persistence: 'localStorage+cookie'
		});
	}, []);

	useEffect(() => {
		trackLandingPageVisit({
			pathname,
			search,
			url: window.location.href
		});
	}, [pathname, search]);

	return (
		<MantineProvider theme={theme} stylesTransform={emotionTransform}>
			<MantineEmotionProvider>
				<SneakPeakContext.Provider value={[sneak, showSneakPeak]}>
					<main>{children}</main>
				</SneakPeakContext.Provider>
			</MantineEmotionProvider>
		</MantineProvider>
	);
}
