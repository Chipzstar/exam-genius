'use client';

import { useState } from 'react';
import { createTheme, MantineProvider } from '@mantine/core';
import { emotionTransform, MantineEmotionProvider } from '@mantine/emotion';
import { SneakPeakContext } from '../context/SneakPeakContext';

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
