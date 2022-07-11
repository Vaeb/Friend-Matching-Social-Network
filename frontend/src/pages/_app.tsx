import { createEmotionCache, Global, MantineProvider } from '@mantine/core';
import { AppProps } from 'next/app';
import { Provider } from 'urql';

import { client } from '../urqlClient';
import myTheme from '../theme';
import '../styles/globals.css';

const myEmotionCache = createEmotionCache({ key: 'mantine', prepend: false });

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
    );
}

export default MyApp;
