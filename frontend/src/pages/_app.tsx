import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { Provider } from 'urql';

import { client } from '../urqlClient';
import theme from '../theme';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Provider value={client}>
            <ChakraProvider resetCSS theme={theme}>
                <Component {...pageProps} />
            </ChakraProvider>
        </Provider>
    );
}

export default MyApp;
