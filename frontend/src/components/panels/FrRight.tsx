import React, { FC } from 'react';
import { Stack, Text, UnstyledButton, useMantineTheme } from '@mantine/core';
import { IoMdArrowBack as IconBack } from 'react-icons/io';

import { useAppStore } from '../../state';
import PanelAction from '../PanelAction';
import { useGetFriendRequestsQuery, useMeQuery } from '../../generated/graphql';
import UserAvatar from '../UserAvatar';
import { avatarUrl } from '../../utils/avatarUrl';

const FrRight: FC<any> = () => {
    const theme = useMantineTheme();
    const setView = useAppStore(state => state.setView);

    // const [{ data: meData, fetching: meFetching }] = useMeQuery();
    const [{ data: frData, fetching: frFetching }] = useGetFriendRequestsQuery();

    // const me = !meFetching ? meData?.me : null;
    const fr = (!frFetching && frData?.getFriendRequests.users) || [];

    return (
        <Stack className='w-[80px] overflow-hidden' align='center' spacing={20}>
            <PanelAction onClick={() => setView('base', 'right')}>
                <IconBack style={{ width: '60%', height: '60%' }} color={theme.colors._gray[6]} />
            </PanelAction>
            <Text className='text-sm font-bold w-full text-center' color='dimmed'>Friend<br/>Requests</Text>
            {fr.map(user => (
                <Stack className='w-full items-center' key={user.id} spacing={4}>
                    <UnstyledButton aria-label='Match Chat'>
                        <UserAvatar
                            className='rounded-full w-[51px] h-[51px] cursor-pointer hover:opacity-75'
                            url={avatarUrl(user)}
                            onClick={() => setView('user', null, user.id)}
                        />
                    </UnstyledButton>
                    <Text className='text-sm text-_gray-800 truncate text-center w-[69px] cursor-pointer' onClick={() => setView('user', null, user.id)}>
                        @{user.username}
                    </Text>
                </Stack>
            ))}
        </Stack>
    );
};

export default FrRight;
