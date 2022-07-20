import React, { FC } from 'react';
import { useMantineTheme, Box } from '@mantine/core';

import { useMeQuery } from '../generated/graphql';
import { useAppStore } from '../state';
import SettingsMid from './panels/SettingsMid';
import MatchMid from './panels/MatchMid';

interface PanelMProps {
    children?: React.ReactNode;
}

const PanelM: FC<PanelMProps> = () => { // #36393f
    const theme = useMantineTheme();
    const [{ data }] = useMeQuery();
    const view = useAppStore(state => state.left.view);

    return (
        <Box className={`h-full grow bg-_black-300 ${view === 'settings' ? 'px-[50px] py-[30px]' : 'px-10 py-5'}`}>
            {{
                settings: <SettingsMid data={data} />,
                match: <MatchMid />,
            }[view]}
        </Box>
    );
};

export default PanelM;
