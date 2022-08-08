import React, { FC } from 'react';
import { Box, Stack, useMantineTheme } from '@mantine/core';
import { MdSettings as IconSettings } from 'react-icons/md';
import { BiSearch as IconSearch } from 'react-icons/bi';
import shallow from 'zustand/shallow';

import { useAppStore, useMiscStore } from '../state';
import BaseRight from './panels/BaseRight';
import MatchesRight from './panels/MatchesRight';
import PanelAction from './PanelAction';
import FrRight from './panels/FrRight';
import { useMobileDetect } from '../utils/useMobileDetect';

interface PanelRProps {}

const PanelR: FC<PanelRProps> = () => {
    const theme = useMantineTheme();
    const { view, openMobile, midView, setView, setOpenMobile } = useAppStore(
        state => ({ view: state.right.view, openMobile:  state.right.openMobile, midView: state.mid.view, setView: state.setView, setOpenMobile: state.setOpenMobile }),
        shallow
    );
    const setSearchOpened = useMiscStore(state => state.setSearchOpened);
    const device = useMobileDetect();
    // const isDesktop = device.isDesktop();
    const isMobile = device.isMobile();
    const activeMobile = isMobile && openMobile;

    return (
        (openMobile || !isMobile) ? (
            <Box className={`relative ${activeMobile ? 'right-0 ml-auto' : ''}`} sx={{ boxShadow: theme.shadows.md }}>
                {/* {isMobile ? (
                    <div className='absolute left-0'>
                        <Burger transitionDuration={0} opened={openMobile} onClick={() => { setOpenMobile({ right: !openMobile }); }} aria-label='Close right' />
                    </div>
                ) : null} */}
                <Stack className={`h-full ${midView === 'settings' ? 'md:w-[26vw] w-[initial]' : ''}`} align='flex-start'>
                    <Stack
                        className={`h-full w-[80px] ${midView === 'settings' ? 'min-w-fit' : ''}`}
                        // justify='space-between'
                        align='center'
                        py={20}
                        spacing={20}
                    >
                        {{
                            matches: <MatchesRight />,
                            fr: <FrRight />,
                        }[view] ?? <BaseRight />}

                        <Stack spacing={20}>
                            <PanelAction onClick={() => setSearchOpened(true)} color='blue'>
                                <IconSearch style={{ width: '60%', height: '60%' }} color={theme.colors._gray[6]} />
                            </PanelAction>
                            <PanelAction onClick={() => setView('settings', null, 'account', null, null)} color='blue'>
                                <IconSettings style={{ width: '60%', height: '60%' }} color={theme.colors._gray[6]} />
                            </PanelAction>
                        </Stack>
                    </Stack>
                </Stack>
            </Box>
        ) : null
    );
};

export default PanelR;
