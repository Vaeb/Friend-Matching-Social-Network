import React, { FC, useEffect } from 'react';
import { useMantineTheme, Box, ScrollArea } from '@mantine/core';

import { useFriendRequestSubscription, useGetPostsWeightedQuery, useMeQuery, useNewMessageSubscription, useNewPostsSubscription } from '../generated/graphql';
import { useAppStore, useTimelineStore } from '../state';
import SettingsMid from './panels/SettingsMid';
import ChatMid from './panels/ChatMid';
import TimelineMid from './panels/TimelineMid';
import UserMid from './panels/UserMid';
import SearchModal from './SearchModal';
import Heartbeat from './Heartbeat';

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
    const view = useAppStore(state => state.left.view);
    const setPosts = useTimelineStore(state => state.setPosts);

    const [{ data: postsData, fetching: postsFetching, stale }] = useGetPostsWeightedQuery();
    useNewMessageSubscription();
    useFriendRequestSubscription();
    const [postsRes] = useNewPostsSubscription();

    const gotPosts = postsData?.getPostsWeighted?.posts;

    console.log('postsFetching', postsFetching);

    useEffect(() => {
        console.log('Set initial posts');
        const posts = !postsFetching ? gotPosts : [];
        setPosts(posts);
    }, [gotPosts, postsFetching, setPosts]);

    useEffect(() => {
        if (postsRes?.data?.newPosts && !postsRes.fetching && !postsRes.stale && !postsRes.error) {
            setPosts(postsRes.data.newPosts);
        }
        console.log('useNewPostsSubscription', postsRes);
    }, [postsRes, setPosts]);

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
            }[view]}
        </Box>
    );
};

export default PanelM;
