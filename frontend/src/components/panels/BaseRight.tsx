import React, { FC } from 'react';
import { Indicator, Stack, Text, UnstyledButton, useMantineTheme } from '@mantine/core';
import { MdTimeline as IconHome } from 'react-icons/md';
import { FaUserFriends as IconMatches } from 'react-icons/fa';
// import { BsPersonBadge as IconPerson } from 'react-icons/bs';

import { useAppStore } from '../../state';
import PanelAction from '../PanelAction';
import { useGetChatsQuery, useGetMatchesQuery } from '../../generated/graphql';
import UserAvatar from '../UserAvatar';
import { avatarUrl } from '../../utils/avatarUrl';

const BaseRight: FC<any> = () => {
    const theme = useMantineTheme();
    const setView = useAppStore(state => state.setView);
    const [{ data: chatsData, fetching: chatsFetching }] = useGetChatsQuery();
    const [{ data: matchesData, fetching: matchesFetching }] = useGetMatchesQuery();

    const chats = !chatsFetching ? chatsData?.getChats : null;
    const numMatches = matchesData?.getMatches.length;

    return (
        <Stack align='center' spacing={20}>
            <PanelAction onClick={() => setView('base', 'all')}>
                <IconHome style={{ width: '60%', height: '60%' }} color={theme.colors._gray[6]} />
            </PanelAction>
            <Indicator inline disabled={matchesFetching || !numMatches} label={numMatches} color='blue' size={17} offset={5}>
                <PanelAction onClick={() => setView('matches', 'right')}>
                    <IconMatches style={{ width: '60%', height: '60%' }} color={theme.colors._gray[6]} />
                </PanelAction>
            </Indicator>
            {chats
                ? chats.map(user => (
                    <Stack className='w-full items-center' key={user.id} spacing={4}>
                        {/* <PanelAction> */}
                        <UnstyledButton aria-label='Friend Chat'>
                            <UserAvatar
                            // className='rounded-full w-full h-full cursor-pointer hover:opacity-75'
                                className='rounded-full w-[51px] h-[51px] cursor-pointer hover:opacity-75'
                                url={avatarUrl(user)}
                                onClick={() => setView('chat', null, user.id)}
                            />
                        </UnstyledButton>
                        {/* </PanelAction> */}
                        <Text className='text-sm text-_gray-800 truncate text-center w-full max-w-full cursor-pointer' px={6} onClick={() => setView('user', null, user.id)}>
                            @{user.username}
                        </Text>
                    </Stack>
                ))
                : null}
        </Stack>
    );
};

export default BaseRight;
