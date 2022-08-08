// import { useRouter } from 'next/router';
import { useMantineTheme, Box } from '@mantine/core';
import React, { FC } from 'react';

import { useAppStore } from '../state';
import SettingsLeft from './panels/SettingsLeft';
import ChatLeft from './panels/ChatLeft';
import TimelineLeft from './panels/TimelineLeft';
import UserLeft from './panels/UserLeft';
import shallow from 'zustand/shallow';
import { useMobileDetect } from '../utils/useMobileDetect';

// import { useLogoutMutation, useMeQuery } from '../generated/graphql';

interface PanelLProps {
    children?: React.ReactNode;
}

const PanelL: FC<PanelLProps> = () => {
    // const router = useRouter();
    // const [{ data, fetching: _ }] = useMeQuery();
    // const [{ fetching: __ }, logout] = useLogoutMutation();
    // const doLogout = async () => {
    //     await logout();
    //     router.push('/');
    // };
    // const [{ data, fetching: _ }] = useMeQuery();

    const theme = useMantineTheme();
    const { view, openMobile, setOpenMobile } = useAppStore(
        state => ({ view: state.left.view, openMobile: state.left.openMobile, setOpenMobile: state.setOpenMobile }),
        shallow
    );
    const device = useMobileDetect();
    // const isDesktop = device.isDesktop();
    const isMobile = device.isMobile();
    const activeMobile = isMobile && openMobile;
    console.log(activeMobile);

    return (
        (openMobile || !isMobile) ? (
            <Box className='relative flex' sx={{ backgroundColor: theme.colors._black[6], boxShadow: theme.shadows.xl, zIndex: 2 }}>
                <Box className={`flex z-[2] justify-end ${activeMobile ? 'w-[50vw]' : view === 'settings' ? 'w-[26vw]' : 'w-[initial]'}`}>
                    <Box className={`flex ${activeMobile ? 'w-full' : 'w-[11vw] sm:w-[175px] md:w-[200px] xl:w-[225px]'}`} sx={{ minWidth: 'fit-content', zIndex: 2 }} px={2} py={3}>
                        {/* {isMobile ? (
                            <div className='absolute right-0 top-0'>
                                <Burger transitionDuration={0} opened={openMobile} onClick={() => { console.log(123); setOpenMobile({ left: !openMobile }); }} aria-label='Close left' />
                            </div>
                        ) : null} */}
                        {/* {data?.me ? <Button variant="ghost" fontSize="large" fontWeight="semibold" onClick={doLogout}>@{data.me.username}</Button> : null} */}
                        {{
                            settings: <SettingsLeft />,
                            chat: <ChatLeft />,
                            match: <ChatLeft />,
                            timeline: <TimelineLeft />,
                            user: <UserLeft />,
                        }[view]}
                    </Box>
                </Box>
            </Box>
        ) : null
    );
};

export default PanelL;
