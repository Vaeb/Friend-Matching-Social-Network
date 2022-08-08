import React, { FC, ReactNode } from 'react';
import Head from 'next/head';
import shallow from 'zustand/shallow';

import { HasChildren } from '../types';
import { useMobileDetect } from '../utils/useMobileDetect';
import { useAppStore } from '../state';
// import { useCheckAuth } from '../utils/useCheckAuth';

type Type = 'regular' | 'center';

interface PageProps {
    children?: ReactNode;
    type?: Type;
    needsAuth?: boolean;
    title?: string;
}

const Regular: FC<HasChildren> = ({ children }) => {
    const { leftOpenMobile, rightOpenMobile, setOpenMobile } = useAppStore(
        state => ({
            leftOpenMobile: state.left.openMobile,
            rightOpenMobile: state.right.openMobile,
            setOpenMobile: state.setOpenMobile,
        }),
        shallow
    );
    const device = useMobileDetect();
    const isMobile = device.isMobile();
    const isActive = !isMobile || (!leftOpenMobile && !rightOpenMobile);

    const handleClick = () => {
        if (!isActive) {
            setOpenMobile({ left: false, right: false });
        }
    };

    return (
        <div className='flex w-full h-full' onClick={handleClick}>
            {children}
        </div>
    );
};

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
    const PageEl = type === 'center' ? Center : Regular;
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
                <meta name='description' content='Social media for universities' />
            </Head>
            <PageEl>{children}</PageEl>
        </>
    );
};

export default Page;
