import { Avatar, Box, Button, Stack } from '@mantine/core';
import React from 'react';

import { GetUserQuery, useAddFriendMutation, useGetUserQuery, useMeQuery } from '../../generated/graphql';
import { useAppStore } from '../../state';
import { avatarUrl } from '../../utils/avatarUrl';

type FriendButtonProps = {
    user: GetUserQuery['getUser'];
    isMe: boolean;
    addFriend: (remove?: boolean) => void;
};

const FriendButton = ({ user, isMe, addFriend }: FriendButtonProps) => {
    if (isMe) return null;
    if (user.areFriends) {
        return (
            <Button variant='outline' className='w-[80%]' onClick={() => addFriend(true)}>Remove Friend</Button>
        );
    }
    if (user.sentFrTo) {
        return (
            <Button classNames={{ inner: 'cursor-default' }} variant='light' className='w-[80%]'>Pending Friend</Button>
        );
    }
    if (user.receivedFrFrom) {
        return (
            <Button variant='outline' className='w-[80%]' onClick={() => addFriend()} color='green'>Accept Friend</Button>
        );
    }
    return (
        <Button variant='outline' className='w-[80%]' onClick={() => addFriend()}>Add Friend</Button>
    );
};

const UserLeft = () => {
    const userId = useAppStore(state => state.mid.viewValue);
    const [{ data: userData, fetching: userFetching }] = useGetUserQuery({ variables: { userId } });
    const [, doAddFriend] = useAddFriendMutation();
    const [{ data: meData, fetching: meFetching }] = useMeQuery();

    const user = !userFetching ? userData?.getUser : null;
    const me = meData?.me;

    const isMe = userId === me.id;

    const addFriend = (remove = false) => {
        doAddFriend({
            userId,
            remove,
        });
    };



    return (user ? (
        <Stack spacing={16} mt={20} className='w-full items-center'>
            <Box className='relative w-[85%] aspect-square mb-[4px]'>
                <Avatar
                    radius='xl'
                    classNames={{ root: 'rounded-full w-full h-full' }} // 180-40
                    color='blue'
                    src={avatarUrl(user, true)}
                    alt='Profile image'
                />
            </Box>
            <FriendButton user={user} isMe={isMe} addFriend={addFriend} />
        </Stack>
    ) : null);
};

export default UserLeft;