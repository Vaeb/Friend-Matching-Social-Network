import { Global, MantineProvider } from '@mantine/core';
import { AppProps } from 'next/app';
import { Provider } from 'urql';
import Head from 'next/head';

import { client } from '../urqlClient';
import myTheme from '../theme';
import { myEmotionCache } from '../emotionCache';
import '../styles/globals.css';

function MyGlobalStyles() {
    return (
        <Global
            styles={theme => ({
                'html, body, #__next, #root, .App': {
                    width: '100%',
                    height: '100%',
                    backgroundColor: theme.colors._black[6],
                    borderColor: theme.colors._black[8],
                },
                body: {
                    color: theme.colors._gray[4],
                },
            })}
        />
    );
}

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Social Media Platform</title>
                <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
            </Head>
            <Provider value={client}>
                <MantineProvider
                    emotionCache={myEmotionCache}
                    withGlobalStyles
                    withNormalizeCSS
                    theme={myTheme}
                >
                    <MyGlobalStyles />
                    <Component {...pageProps} />
                </MantineProvider>
            </Provider>
        </>
    );
}

export default MyApp;
