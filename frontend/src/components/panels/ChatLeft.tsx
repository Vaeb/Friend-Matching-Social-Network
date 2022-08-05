import {
    Button, Stack, 
} from '@mantine/core';
import React, { FC } from 'react';
import shallow from 'zustand/shallow';

import { GetMatchesQuery, GetUserQuery, useAddFriendMutation, useGetUserQuery } from '../../generated/graphql';
import { useAppStore } from '../../state';
import { FriendButton } from '../FriendButton';

// import { GetMatchesQuery } from '../../generated/graphql';
// import { useAppStore } from '../../state';

const ChatLeft: FC = () => {
    // const theme = useMantineTheme();
    // const match: GetMatchesQuery['getMatches'][0]['user'] = useAppStore(state => state.mid.viewValue);
    // const [{ data: meData, fetching: meFetching }] = useMeQuery();
    const { userId, setView } = useAppStore(
        state => ({ userId: state.mid.viewValue, setView: state.setView }),
        shallow
    );
    const [{ data: userData, fetching: userFetching }] = useGetUserQuery({ variables: { userId } });

    const user = !userFetching ? userData?.getUser : null;

    const [, doAddFriend] = useAddFriendMutation();

    const addFriend = (remove = false) => {
        doAddFriend({
            userId: userId,
            remove,
        });
    };

    // {`flex w-full ${isMe(message.from) ? 'justify-end' : ''}`}
    return (
        <Stack className='w-full items-center mt-[25px]' spacing={22}>
            <FriendButton user={user} isMe={false} addFriend={addFriend} />
            <Button variant='outline' className='w-[80%]' onClick={() => setView('user', null, user.id)}>Open Profile</Button>
        </Stack>
    );
};

export default ChatLeft;
