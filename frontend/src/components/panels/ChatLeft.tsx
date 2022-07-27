import {
    Button, Stack, 
} from '@mantine/core';
import React, { FC } from 'react';

import { GetMatchesQuery, GetUserQuery, useAddFriendMutation, useGetUserQuery } from '../../generated/graphql';
import { useAppStore } from '../../state';

// import { GetMatchesQuery } from '../../generated/graphql';
// import { useAppStore } from '../../state';

const ChatLeft: FC = () => {
    // const theme = useMantineTheme();
    // const match: GetMatchesQuery['getMatches'][0]['user'] = useAppStore(state => state.mid.viewValue);
    // const [{ data: meData, fetching: meFetching }] = useMeQuery();
    const basicUser: GetUserQuery['getUser'] = useAppStore(state => state.mid.viewValue);
    const [{ data: userData, fetching: userFetching }] = useGetUserQuery({ variables: { userId: basicUser.id } });

    const user = !userFetching ? userData?.getUser : null;

    const [, doAddFriend] = useAddFriendMutation();

    const addFriend = (remove = false) => {
        doAddFriend({
            userId: basicUser.id,
            remove,
        });
    };

    // {`flex w-full ${isMe(message.from) ? 'justify-end' : ''}`}
    return (
        <Stack mt={25} className='h-full items-center'>
            {user && user.areFriends ?
                <Button variant='outline' className='w-[80%]' onClick={() => addFriend(true)}>Remove Friend</Button>
                : <Button variant='outline' className='w-[80%]' onClick={() => addFriend()}>Add Friend</Button>
            }
        </Stack>
    );
};

export default ChatLeft;
