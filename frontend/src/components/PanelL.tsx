// import { Box, Button, Text } from '@chakra-ui/react';
// import { useRouter } from 'next/router';
import { useMantineTheme, Stack } from '@mantine/core';
import React, { FC } from 'react';

import SettingsLeft from '../panels/SettingsLeft';
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
        // <Box h='100%' w='11vw' bg='black8' px={2} py={3} display='flex' boxShadow='xl' zIndex={2}>
        <Stack sx={{ backgroundColor: theme.colors._black[8], width: '11vw', zIndex: 2, boxShadow: theme.shadows.xl }} px={2} py={3}>
            {/* {data?.me ? <Button variant="ghost" fontSize="large" fontWeight="semibold" onClick={doLogout}>@{data.me.username}</Button> : null} */}
            {{
                settings: <SettingsLeft />,
            }[view]}
        </Stack>
    );
};

export default PanelL;
