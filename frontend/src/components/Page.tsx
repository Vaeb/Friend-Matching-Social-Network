import React, { FC, ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import { HasChildren } from '../types';

type Type = 'regular' | 'center';

interface PageProps {
    type?: Type;
    children?: ReactNode;
}

const Regular: FC<HasChildren> = ({ children }) => (
    <Box mx="auto" mt={6} w="100%" maxW="780px">
        {children}
    </Box>
);

const Center: FC<HasChildren> = ({ children }) => (
    <Box display="flex" alignItems="center" justifyContent="center" w="100%" h="100vh" pb="10vh" overflow="hidden">
        {children}
        {/* <Box display="block" height="10vh" width="100%" bg="#f00" /> */}
    </Box>
);

const Page: FC<PageProps> = ({ type, children }) => {
    if (!type) type = 'regular';
    const PageEl = type === 'center' ? Center : Regular;
    return <PageEl>{children}</PageEl>;
};

export default Page;
