import React, { FC, ReactNode } from 'react';
import { Group } from '@mantine/core';
import Head from 'next/head';

import { HasChildren } from '../types';
import { useCheckAuth } from '../utils/useCheckAuth';

type Type = 'regular' | 'center';

interface PageProps {
    children?: ReactNode;
    type?: Type;
    needsAuth?: boolean;
    title?: string;
}

const Regular: FC<HasChildren> = ({ children }) => (
    <div className='flex w-full h-full'>
        {children}
    </div>
);

const Center: FC<HasChildren> = ({ children }) => (
    <div className='flex items-center justify-center w-full h-screen overflow-hidden pb-[10vh]'>
        {children}
        {/* <Box display="block" height="10vh" width="100%" bg="#f00" /> */}
    </div>
);

const Page: FC<PageProps> = ({ children, type, needsAuth, title }) => {
    if (type === undefined) type = 'regular';
    if (needsAuth === undefined) needsAuth = true;
    if (title === undefined) title = 'Uni Social Media';
    useCheckAuth(needsAuth);
    const PageEl = type === 'center' ? Center : Regular;
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
            </Head>
            <PageEl>{children}</PageEl>
        </>
    );
};

export default Page;
