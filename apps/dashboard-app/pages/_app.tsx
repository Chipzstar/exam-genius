import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import { createEmotionCache, MantineProvider } from '@mantine/core';
import { ClerkProvider } from '@clerk/nextjs';
import { trpc } from '../utils/trpc';
import { Notifications } from '@mantine/notifications';

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
						colorScheme: 'light'
					}}
				>
					<Component {...pageProps} />
				</MantineProvider>
			</ClerkProvider>
		</>
	);
}

export default trpc.withTRPC(CustomApp);
