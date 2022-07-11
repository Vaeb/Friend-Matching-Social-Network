import React, { FC } from 'react';
import { useMantineTheme, Box } from '@mantine/core';

import { useMeQuery } from '../generated/graphql';
import { useAppStore } from '../state';
import SettingsMid from './panels/SettingsMid';

interface PanelMProps {
    children?: React.ReactNode;
}

const PanelM: FC<PanelMProps> = () => { // #36393f
    const theme = useMantineTheme();
    const [{ data, fetching: _ }] = useMeQuery();
    const view = useAppStore(state => state.left.view);

    return (
        // <Box h='100%' flex='1 1 auto' bg='black3' px={10} py={3}>
        <Box sx={{ height: '100%', flex: '1 1 auto', backgroundColor: theme.colors._black[3] }} px={50} py={30}>
            {{
                settings: <SettingsMid data={data} />,
            }[view]}
        </Box>
    );
};

export default PanelM;
