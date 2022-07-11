import React, { FC } from 'react';
import { ActionIcon, Box, Stack, useMantineTheme } from '@mantine/core';
import { MdSettings as IconSettings } from 'react-icons/md';
// import NextLink from 'next/link';
import shallow from 'zustand/shallow';

import { useAppStore } from '../state';
import BaseRight from './panels/BaseRight';
import PanelAction from './PanelAction';
// import { IconType } from 'react-icons/lib';

interface PanelRProps {
    children?: React.ReactNode;
}

const PanelR: FC<PanelRProps> = ({ children }) => {
    const theme = useMantineTheme();
    const { view, setView } = useAppStore(state => ({ view: state.right.view, setView: state.setView }), shallow);

    return (
        <Box sx={{ boxShadow: theme.shadows.md }}>
            <Stack sx={{ height: '100%', width: '80px' }} justify='space-between' align='center' mr={view === 'settings' ? '22vw' : 0} py={20}>
                <Stack align='center' spacing={20}>
                    {children ?? <BaseRight />}
                </Stack>
                <Box>
                    <PanelAction onClick={() => setView('settings')} color='blue'>
                        <IconSettings style={{ width: '60%', height: '60%' }} color={theme.colors._gray[6]} />
                    </PanelAction>
                </Box>
            </Stack>
        </Box>
    );
};

export default PanelR;
