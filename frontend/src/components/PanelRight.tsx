import React, { FC } from 'react';
import { ActionIcon, Box, Stack, useMantineTheme } from '@mantine/core';
import { MdSettings as IconSettings } from 'react-icons/md';
import shallow from 'zustand/shallow';

import { useAppStore } from '../state';
import BaseRight from './panels/BaseRight';
import MatchesRight from './panels/MatchesRight';
import PanelAction from './PanelAction';

interface PanelRProps {}

const PanelR: FC<PanelRProps> = () => {
    const theme = useMantineTheme();
    const { view, setView } = useAppStore(state => ({ view: state.right.view, setView: state.setView }), shallow);

    return (
        <Box sx={{ boxShadow: theme.shadows.md }}>
            <Stack className={`h-full ${view === 'settings' ? 'md:w-[26vw] w-[initial]' : ''}`} align='flex-start'>
                <Stack
                    className={`h-full min-w-[80px] ${view === 'settings' ? 'min-w-fit' : ''}`}
                    justify='space-between'
                    align='center'
                    py={20}
                >
                    {{
                        matches: <MatchesRight />,
                    }[view] ?? <BaseRight />}

                    <Box>
                        <PanelAction onClick={() => setView('settings', 'all')} color='blue'>
                            <IconSettings style={{ width: '60%', height: '60%' }} color={theme.colors._gray[6]} />
                        </PanelAction>
                    </Box>
                </Stack>
            </Stack>
        </Box>
    );
};

export default PanelR;
