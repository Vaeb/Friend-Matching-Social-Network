// import { Box, Button, Text } from '@chakra-ui/react';
// import { useRouter } from 'next/router';
import { useMantineTheme, Stack, Box } from '@mantine/core';
import React, { FC } from 'react';

import SettingsLeft from './panels/SettingsLeft';
import { useAppStore } from '../state';

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
        <Box sx={{ backgroundColor: theme.colors._black[8], boxShadow: theme.shadows.xl, zIndex: 2 }}>
            <Stack sx={{ width: '11vw', zIndex: 2 }} ml={view === 'settings' ? '15vw' : 0} px={2} py={3}>
                {/* {data?.me ? <Button variant="ghost" fontSize="large" fontWeight="semibold" onClick={doLogout}>@{data.me.username}</Button> : null} */}
                {{
                    settings: <SettingsLeft />,
                }[view]}
            </Stack>
        </Box>
    );
};

export default PanelL;
