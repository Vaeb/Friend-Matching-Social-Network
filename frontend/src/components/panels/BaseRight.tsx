import React, { FC } from 'react';
import {
    Indicator, ScrollArea, Stack, Text, UnstyledButton, useMantineTheme, 
} from '@mantine/core';
import { MdTimeline as IconHome } from 'react-icons/md';
import { FaUserFriends as IconFriends } from 'react-icons/fa';
import { MdEmojiPeople as IconMatches } from 'react-icons/md';
// import { BsPersonBadge as IconPerson } from 'react-icons/bs';

import { useAppStore } from '../../state';
import PanelAction from '../PanelAction';
import { useGetChatsQuery, useGetFriendRequestsQuery, useGetMatchesQuery } from '../../generated/graphql';
import UserAvatar from '../UserAvatar';
import { avatarUrl } from '../../utils/avatarUrl';

const BaseRight: FC<any> = () => {
    const theme = useMantineTheme();
    const setView = useAppStore(state => state.setView);
    const [{ data: chatsData, fetching: chatsFetching }] = useGetChatsQuery();
    const [{ data: matchesData, fetching: matchesFetching }] = useGetMatchesQuery();
    const [{ data: frData, fetching: frFetching }] = useGetFriendRequestsQuery();

    const chats = !chatsFetching ? chatsData?.getChats.users : null;
    const numMatches = matchesData?.getMatches?.matches.length ?? 0;
    const numFr = frData?.getFriendRequests?.users.length ?? 0;

    return (
        <>
            <div>
                <PanelAction onClick={() => setView('base', 'all')}>
                    <IconHome style={{ width: '60%', height: '60%' }} color={theme.colors._gray[6]} />
                </PanelAction>
            </div>
            <Indicator inline disabled={frFetching || !numFr} label={numFr} color='blue' size={17} offset={5}>
                <PanelAction onClick={() => setView('fr', 'right')}>
                    <IconFriends style={{ width: '60%', height: '60%' }} color={theme.colors._gray[6]} />
                </PanelAction>
            </Indicator>
            <Indicator inline disabled={matchesFetching || !numMatches} label={numMatches} color='blue' size={17} offset={5}>
                <PanelAction onClick={() => setView('matches', 'right')}>
                    <IconMatches style={{ width: '60%', height: '60%' }} color={theme.colors._gray[6]} />
                </PanelAction>
            </Indicator>
            <ScrollArea type='never' className='grow'>
                <Stack align='center' spacing={20}>
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
                                <Text
                                    sx={{ color: user.color ?? theme.colors._gray[8] }}
                                    className='text-sm truncate text-center w-[69px] cursor-pointer'
                                    onClick={() => setView('user', null, user.id)}
                                >
                                    @{user.username}
                                </Text>
                            </Stack>
                        ))
                        : null}
                </Stack>
            </ScrollArea>
        </>
    );
};

export default BaseRight;
