// import { useRouter } from 'next/router';
import { useMantineTheme, Stack, Box } from '@mantine/core';
import React, { FC } from 'react';

import { useAppStore } from '../state';
import SettingsLeft from './panels/SettingsLeft';
import ChatLeft from './panels/ChatLeft';
import TimelineLeft from './panels/TimelineLeft';
import UserLeft from './panels/UserLeft';

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
    const view = useAppStore(state => state.left.view);

    return (
        <Box sx={{ backgroundColor: theme.colors._black[6], boxShadow: theme.shadows.xl, zIndex: 2 }}>
            <Stack sx={{ width: view === 'settings' ? '26vw' : 'initial', zIndex: 2 }} align='flex-end'>
                <Stack sx={{ width: view === 'settings' ? '11vw' : '11vw', minWidth: 'fit-content', zIndex: 2 }} px={2} py={3}>
                    {/* {data?.me ? <Button variant="ghost" fontSize="large" fontWeight="semibold" onClick={doLogout}>@{data.me.username}</Button> : null} */}
                    {{
                        settings: <SettingsLeft />,
                        chat: <ChatLeft />,
                        match: <ChatLeft />,
                        timeline: <TimelineLeft />,
                        user: <UserLeft />,
                    }[view]}
                </Stack>
            </Stack>
        </Box>
    );
};

export default PanelL;
