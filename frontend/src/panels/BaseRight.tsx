import React, { FC } from 'react';
import { useMantineTheme } from '@mantine/core';
import { MdTimeline as IconHome } from 'react-icons/md';
import { FaUserFriends as IconMatches } from 'react-icons/fa';
// import NextLink from 'next/link';
import { useAppStore } from '../state';

import PanelAction from '../components/PanelAction';

const BaseRight: FC<any> = () => {
    const theme = useMantineTheme();
    const setView = useAppStore(state => state.setView);

    return (
        <>
            <PanelAction onClick={() => setView('base')}>
                <IconHome style={{ width: '60%', height: '60%' }} color={theme.colors._gray[6]} />
            </PanelAction>
            <PanelAction onClick={() => setView('base')}>
                <IconMatches style={{ width: '60%', height: '60%' }} color={theme.colors._gray[6]} />
            </PanelAction>
        </>
    );
};

export default BaseRight;
