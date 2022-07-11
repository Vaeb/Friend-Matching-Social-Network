import React, { FC, ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import { HasChildren } from '../types';
import { useCheckAuth } from '../utils/useCheckAuth';
import Head from 'next/head';

type Type = 'regular' | 'center';

interface PageProps {
    children?: ReactNode;
    type?: Type;
    needsAuth?: boolean;
    title?: string;
}

const Regular: FC<HasChildren> = ({ children }) => (
    <Box display='flex' w='100%' h='100%'>
        {children}
    </Box>
);

const Center: FC<HasChildren> = ({ children }) => (
    <Box display='flex' alignItems='center' justifyContent='center' w='100%' h='100vh' pb='10vh' overflow='hidden'>
        {children}
        {/* <Box display="block" height="10vh" width="100%" bg="#f00" /> */}
    </Box>
);

const Page: FC<PageProps> = ({ children, type, needsAuth, title }) => {
    if (type === undefined) type = 'regular';
    if (needsAuth === undefined) needsAuth = true;
    if (title === undefined) title = 'Uni Social Media';
    useCheckAuth(needsAuth);
    const PageEl = type === 'center' ? Center : Regular;
    return (
        <PageEl>{children}</PageEl>
    );
};

export default Page;
