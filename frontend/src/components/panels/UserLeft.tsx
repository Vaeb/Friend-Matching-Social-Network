import { Avatar, Box, Button, Divider, Stack, useMantineTheme } from '@mantine/core';
import React from 'react';
import shallow from 'zustand/shallow';

import { useAddFriendMutation, useGetUserQuery, useMeQuery } from '../../generated/graphql';
import { useAppStore } from '../../state';
import { avatarUrl } from '../../utils/avatarUrl';
import { FriendButton } from '../FriendButton';

const UserLeft = () => {
    const theme = useMantineTheme();
    const { userId, setView } = useAppStore(
        state => ({ userId: state.mid.viewValue, setView: state.setView }),
        shallow
    );

    const [{ data: userData, fetching: userFetching }] = useGetUserQuery({ variables: { userId } });
    const [, doAddFriend] = useAddFriendMutation();
    const [{ data: meData, fetching: meFetching }] = useMeQuery();

    const user = !userFetching ? userData?.getUser : null;
    const me = meData?.me;

    const isMe = userId === me.id;

    const addFriend = async (remove = false) => {
        const result = await doAddFriend({
            userId,
            remove,
        });
        console.log('qq', result);
    };

    return (user ? (
        <Stack className='w-full items-center mt-[20px]' spacing={22}>
            <Box className='relative w-[85%] aspect-square mb-[0px]'>
                <Avatar
                    radius='xl'
                    classNames={{ root: 'rounded-full w-full h-full' }} // 180-40
                    color='blue'
                    src={avatarUrl(user, true)}
                    alt='Profile image'
                />
            </Box>
            <Divider className='w-[85%]' size='xs' color={theme.colors._dividerT[0]} />
            <FriendButton user={user} isMe={isMe} addFriend={addFriend} />
            {user.areFriends || user.haveMatched ?
                <Button variant='outline' className='w-[80%]' onClick={() => setView('chat', null, user.id)}>Open Chat</Button>
                : null}
        </Stack>
    ) : null);
};

export default UserLeft;