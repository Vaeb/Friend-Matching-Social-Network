import React, { FC, useEffect } from 'react';
import { useMantineTheme, Box } from '@mantine/core';

import { useGetPostsWeightedQuery, useMeQuery, useNewMessageSubscription, useNewPostsSubscription } from '../generated/graphql';
import { useAppStore, useTimelineStore } from '../state';
import SettingsMid from './panels/SettingsMid';
import ChatMid from './panels/ChatMid';
import TimelineMid from './panels/TimelineMid';
import UserMid from './panels/UserMid';
import SearchModal from './SearchModal';

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
    const [res] = useNewPostsSubscription();

    const gotPosts = postsData?.getPostsWeighted?.posts;

    console.log('postsFetching', postsFetching);

    useEffect(() => {
        console.log('Set initial posts');
        const posts = !postsFetching ? gotPosts : [];
        setPosts(posts);
    }, [gotPosts, postsFetching, setPosts]);

    useEffect(() => {
        if (res?.data?.newPosts && !res.fetching && !res.stale && !res.error) {
            setPosts(res.data.newPosts);
        }
        console.log('useNewPostsSubscription', res);
    }, [res, setPosts]);

    return (
        <Box className={`h-full grow bg-_black-300 ${view === 'settings' ? 'px-[50px] py-[30px]' : 'px-10 py-5'}`}>
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
