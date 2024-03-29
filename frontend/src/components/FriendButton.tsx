import { Button } from '@mantine/core';

import { GetUserQuery } from '../generated/graphql';

type FriendButtonProps = {
    user: GetUserQuery['getUser'];
    isMe: boolean;
    addFriend: (remove?: boolean) => void;
    fallback?: boolean;
};

export const FriendButton = ({ user, isMe, addFriend, fallback }: FriendButtonProps) => {
    if (isMe) return null;
    if (!user) {
        return fallback ? (
            <Button variant='outline' className='w-[80%]' onClick={() => addFriend()}>Add Friend</Button>
        ) : null;
    }
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
