import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import { createEmotionCache, MantineProvider } from '@mantine/core';

const appendCache = createEmotionCache({ key: 'mantine', prepend: false });
function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to dashboard-app!</title>
      </Head>
      <MantineProvider
        emotionCache={appendCache}
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: 'light'
        }}
      >
        <main className='app'>
          <Component {...pageProps} />
        </main>
      </MantineProvider>
    </>
  );
}

export default CustomApp;
