'use client';

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
	return (
		<ClerkProvider ui={ui}>
			<PostHogTracker />
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
