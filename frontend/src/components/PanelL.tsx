import { Box, Button, Text } from '@chakra-ui/react';
// import { useRouter } from 'next/router';
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

    const view = useAppStore(state => state.left.view);

    return (
        <Box h='100%' w='11vw' bg='black8' px={2} py={3} display='flex' boxShadow='xl' zIndex={2}>
            {/* {data?.me ? <Button variant="ghost" fontSize="large" fontWeight="semibold" onClick={doLogout}>@{data.me.username}</Button> : null} */}
            {{
                settings: <SettingsLeft />,
            }[view]}
        </Box>
    );
};

export default PanelL;
