import { Box, Button, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

import { useLogoutMutation, useMeQuery } from '../generated/graphql';

interface PanelLProps {
    children?: React.ReactNode;
}

const PanelL: FC<PanelLProps> = ({ children }) => {
    const router = useRouter();
    const [{ data, fetching: _ }] = useMeQuery();
    const [{ fetching: __ }, logout] = useLogoutMutation();
    const doLogout = async () => {
        await logout();
        router.push('/');
    };
    return (
        <Box borderRight="1px solid rgba(0, 0, 0, 0.7)" h="100%" w="11vw" bg="#202225" px={2} py={3} display="flex">
            {/* {data?.me ? <Button variant="ghost" fontSize="large" fontWeight="semibold" onClick={doLogout}>@{data.me.username}</Button> : null} */}
            {children}
        </Box>
    );
};

export default PanelL;
