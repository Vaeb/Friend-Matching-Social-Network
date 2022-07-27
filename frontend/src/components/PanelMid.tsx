import React, { FC } from 'react';
import { useMantineTheme, Box } from '@mantine/core';

import { useMeQuery } from '../generated/graphql';
import { useAppStore } from '../state';
import SettingsMid from './panels/SettingsMid';
import ChatMid from './panels/ChatMid';
import TimelineMid from './panels/TimelineMid';
import UserMid from './panels/UserMid';
import SearchModal from './SearchModal';

interface PanelMProps {
    children?: React.ReactNode;
}

const PanelM: FC<PanelMProps> = () => { // #36393f
    const theme = useMantineTheme();
    const [{ data }] = useMeQuery();
    const view = useAppStore(state => state.left.view);

    return (
        <Box className={`h-full grow bg-_black-300 ${view === 'settings' ? 'px-[50px] py-[30px]' : 'px-10 py-5'}`}>
            <SearchModal />
            {{
                settings: <SettingsMid data={data} />,
                chat: <ChatMid />,
                match: <ChatMid />,
                timeline: <TimelineMid />,
                user: <UserMid />,
            }[view]}
        </Box>
    );
};

export default PanelM;
