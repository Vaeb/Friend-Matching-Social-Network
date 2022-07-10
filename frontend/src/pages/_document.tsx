import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import { ColorModeScript } from '@chakra-ui/react';
// import { createGetInitialProps } from '@mantine/next';

// const getInitialProps = createGetInitialProps();

export default class Document extends NextDocument {
    // static getInitialProps = getInitialProps;

    render() {
        return (
            <Html>
                <Head />
                <body>
                    {/* Make Color mode to persists when you refresh the page. */}
                    <ColorModeScript />
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
