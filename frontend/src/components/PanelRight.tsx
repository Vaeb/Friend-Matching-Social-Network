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

interface PanelRProps {}

const PanelR: FC<PanelRProps> = () => {
    const theme = useMantineTheme();
    const { view, midView, setView } = useAppStore(
        state => ({ view: state.right.view, midView: state.mid.view, setView: state.setView }),
        shallow
    );
    const setSearchOpened = useMiscStore(state => state.setSearchOpened);

    return (
        <Box sx={{ boxShadow: theme.shadows.md }}>
            <Stack className={`h-full ${midView === 'settings' ? 'md:w-[26vw] w-[initial]' : ''}`} align='flex-start'>
                <Stack
                    className={`h-full w-[80px] ${midView === 'settings' ? 'min-w-fit' : ''}`}
                    justify='space-between'
                    align='center'
                    py={20}
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
    );
};

export default PanelR;
