import { Button, Stack } from '@mantine/core';
import React from 'react';

import { useAddFriendMutation, useGetUserQuery, useMeQuery } from '../../generated/graphql';
import { useAppStore } from '../../state';

const UserLeft = () => {
    const userId = useAppStore(state => state.mid.viewValue);
    const [{ data: userData, fetching: userFetching }] = useGetUserQuery({ variables: { userId } });
    const [, doAddFriend] = useAddFriendMutation();
    const [{ data: meData, fetching: meFetching }] = useMeQuery();

    const user = !userFetching ? userData?.getUser : null;
    const me = meData?.me;

    const atMe = userId === me.id;

    const addFriend = (remove = false) => {
        doAddFriend({
            userId,
            remove,
        });
    };

    return (
        <Stack mt={25} className='w-full items-center'>
            {user && user.areFriends ?
                <Button variant='outline' className='w-[80%]' onClick={() => addFriend(true)}>Remove Friend</Button>
                : !atMe ? <Button variant='outline' className='w-[80%]' onClick={() => addFriend()}>Add Friend</Button>
                    : null
            }
        </Stack>
    );
};

export default UserLeft;