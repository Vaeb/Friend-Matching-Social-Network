import { Box, Button, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

import { useLogoutMutation, useMeQuery } from '../generated/graphql';

interface PanelLProps {
    children?: React.ReactNode;
}

const PanelL: FC<PanelLProps> = ({ children }) => {
    const router = useRouter();
    const [{ data, fetching }] = useMeQuery();
    const [{ fetching: _ }, logout] = useLogoutMutation();
    const doLogout = async () => {
        await logout();
        router.push('/');
    };
    return (
        <Box h="100%" w="11vw" bg="#202225" p={2} display="flex">
            {data?.me ? <Button variant="ghost" fontSize="large" fontWeight="semibold" onClick={doLogout}>@{data.me.username}</Button> : null}
        </Box>
    );
};

export default PanelL;
