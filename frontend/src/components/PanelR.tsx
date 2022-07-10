import React, { FC } from 'react';
import { ActionIcon, Box, Stack, useMantineTheme } from '@mantine/core';
// import { Box, Icon } from '@chakra-ui/react';
import { MdSettings as IconSettings } from 'react-icons/md';
// import NextLink from 'next/link';

import { useAppStore } from '../state';
import BaseRight from '../panels/BaseRight';
import PanelAction from './PanelAction';
// import { IconType } from 'react-icons/lib';

const ItemBoxShadow = `
    0 2.3px 3.6px #4f4f4f,
    0 .3px 10px rgba(0, 0, 0, 0.046),
    0 15.1px 24.1px rgba(0, 0, 0, 0.051),
    0 30px 40px rgba(0, 0, 0, 0.5)
`;

interface PanelRProps {
    children?: React.ReactNode;
}

const PanelR: FC<PanelRProps> = ({ children }) => {
    const theme = useMantineTheme();
    const setView = useAppStore(state => state.setView);

    return (
        <Stack sx={{ width: '80px', boxShadow: theme.shadows.md }} justify='space-between' align='center' py={20}>
            <Stack align='center' spacing={20}>
                {children ?? <BaseRight />}
            </Stack>
            <Box>
                <PanelAction onClick={() => setView('settings')} color='blue'>
                    <IconSettings style={{ width: '60%', height: '60%' }} color={theme.colors._gray[6]} />
                </PanelAction>
            </Box>
        </Stack>
    );
};

export default PanelR;
