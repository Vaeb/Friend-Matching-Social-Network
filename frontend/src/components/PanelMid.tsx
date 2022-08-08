import React, { FC, useEffect } from 'react';
import { useMantineTheme, Box } from '@mantine/core';

import {
    useClearSeenMutation,
    useFriendRequestSubscription,
    useGetPostsWeightedQuery,
    useManualMatchAvailableSubscription,
    useMeQuery,
    useNewAutoMatchSubscription,
    useNewChatsSubscription,
    useNewManualMatchSubscription,
    useNewMessageSubscription,
    useNewPostsSubscription,
} from '../generated/graphql';
import { useAppStore, useChatStore, useTimelineStore } from '../state';
import SettingsMid from './panels/SettingsMid';
import ChatMid from './panels/ChatMid';
import TimelineMid from './panels/TimelineMid';
import UserMid from './panels/UserMid';
import SearchModal from './SearchModal';
import Heartbeat from './Heartbeat';
import shallow from 'zustand/shallow';

const handleSubscription = (prev: any, next: any) => {
    console.log('handling', prev, next);
    return next;
};

interface PanelMProps {
    children?: React.ReactNode;
}

const PanelM: FC<PanelMProps> = () => { // #36393f
    const theme = useMantineTheme();
    const [{ data }] = useMeQuery();
    const { leftView, midValue } = useAppStore(
        state => ({ leftView: state.left.view, midValue: state.mid.viewValue }),
        shallow
    );
    const setPosts = useTimelineStore(state => state.setPosts);
    const setRefreshed = useChatStore(state => state.setRefreshed);

    const [{ data: postsData, fetching: postsFetching, stale }] = useGetPostsWeightedQuery({ variables: { view: 'all' } });
    const [messagesRes] = useNewMessageSubscription();
    useNewChatsSubscription();
    useFriendRequestSubscription();
    useNewAutoMatchSubscription();
    useNewManualMatchSubscription();
    useManualMatchAvailableSubscription();
    const [postsRes] = useNewPostsSubscription();
    const [, doClearSeen] = useClearSeenMutation();

    const gotPosts = postsData?.getPostsWeighted?.posts;
    // const messages = messagesRes?.data?.newMessage.messages;
    // const meId = messagesRes?.data?.newMessage.id;
    // const lastMessage = messages?.[messages.length - 1];
    // const lastMessageId = lastMessage?.id;
    // const fromId = messages?.[0]?.from.id;
    // const toId = messages?.[0]?.to.id;
    // const lastMessageJson = lastMessage ? JSON.stringify(lastMessage) : undefined;
    // const validUpdate = messagesRes?.data?.newMessage && !messagesRes.fetching && !messagesRes.stale && !messagesRes.error && messagesRes.data.newMessage.messages.length;

    // console.log('postsFetching', postsFetching);

    useEffect(() => {
        console.log('Set initial posts');
        const posts = !postsFetching ? gotPosts : [];
        setPosts(posts);
    }, [gotPosts, postsFetching, setPosts]);

    useEffect(() => {
        if (postsRes?.data?.newPosts && !postsRes.fetching && !postsRes.stale && !postsRes.error) {
            setPosts(postsRes.data.newPosts);
        }
        // console.log('useNewPostsSubscription', postsRes);
    }, [postsRes, setPosts]);

    useEffect(() => {
        const messages = messagesRes?.data?.newMessage.messages;
        // console.log('new data:', messagesRes?.data?.newMessage);
        // console.log('Checking', messages?.at(-1));
        setRefreshed();
        if (messages && !messagesRes.fetching && !messagesRes.stale && !messagesRes.error && messages.length) {
            const userId = messagesRes.data.newMessage.id;

            if (userId === midValue) {
                console.log('Clearing messages while reading', userId);
                doClearSeen({ userId });
            }

            // console.log('refreshing for:', lastMessageId, meId, validUpdate, fromId, toId);
            // setRefreshed(userId);
            // setMessages(userId, messages);
        }
        // console.log('useNewMessageSubscription');
    }, [messagesRes, midValue, setRefreshed, doClearSeen]);

    return (
        <Box className='bg-_black-300 h-full grow'>
            <Heartbeat />
            <SearchModal />
            {{
                settings: <SettingsMid data={data} />,
                chat: <ChatMid />,
                match: <ChatMid />,
                timeline: <TimelineMid />,
                user: <UserMid />,
            }[leftView]}
        </Box>
    );
};

export default PanelM;
