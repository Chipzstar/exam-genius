'use client';

import { Suspense } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { AxiomWebVitals } from 'next-axiom';
import { TRPCReactProvider } from '~/trpc/react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { ColorSchemeSync } from '~/components/ThemeToggle';
import { ui } from '@clerk/ui';
import { PostHogTracker } from '~/components/PostHogTracker';

const theme = {
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
	fontFamily: 'var(--font-poppins), sans-serif',
	fontFamilyMonospace: 'Monaco, Courier, monospace',
	headings: { fontFamily: 'var(--font-poppins), sans-serif' },
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
} as const;

export function Providers({
	children,
	baseUrl = ''
}: {
	children: React.ReactNode;
	baseUrl?: string;
}) {
	// #region agent log
	fetch('http://127.0.0.1:7377/ingest/6c027480-495e-40ec-ba01-a117ac2c8793', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '1cb770' },
		body: JSON.stringify({
			sessionId: '1cb770',
			runId: 'post-fix',
			hypothesisId: 'H1',
			location: 'Providers.tsx:Providers',
			message: 'Providers render; PostHogTracker wrapped in Suspense for useSearchParams',
			data: { postHogSuspenseWrapped: true },
			timestamp: Date.now()
		})
	}).catch(() => {});
	// #endregion
	return (
		<ClerkProvider ui={ui}>
			<Suspense fallback={null}>
				<PostHogTracker />
			</Suspense>
			<AxiomWebVitals />
			<MantineProvider defaultColorScheme="dark" theme={theme}>
				<ModalsProvider>
					<ColorSchemeSync />
					<Notifications position="top-right" />
					<TRPCReactProvider baseUrl={baseUrl}>{children}</TRPCReactProvider>
				</ModalsProvider>
			</MantineProvider>
		</ClerkProvider>
	);
}
