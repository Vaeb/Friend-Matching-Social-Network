import { useEffect, useState } from 'react';
import { Global, MantineProvider } from '@mantine/core';
import { AppProps } from 'next/app';
import { Provider } from 'urql';

import { makeClient } from '../urqlClient';
import myTheme from '../theme';
import { myEmotionCache } from '../emotionCache';
import '../styles/globals.css';
import { useMiscStore } from '../state';

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
    const [client, setClient] = useState(makeClient());
    const setResetClient = useMiscStore(state => state.setResetClient);

    useEffect(() => {
        console.log('Set resetClient...');
        setResetClient(() => {
            console.log('Resetting URQL client!');
            setClient(makeClient());
        });
    }, [setResetClient]);

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
