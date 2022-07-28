import {
    Box, ScrollArea, Stack, Text, TextInput, TextInputProps, Title, Tooltip, useMantineTheme, 
} from '@mantine/core';
import React, { FC, useEffect, useRef } from 'react';
import { BsPersonCircle as IconPerson } from 'react-icons/bs';

import { useGetPostsFromFriendsQuery, useSendPostMutation } from '../../generated/graphql';
import { useAppStore, useTimelineStore } from '../../state';
// import { useAppStore, useConvoStore } from '../../state';
import { formatTime, getDateString } from '../../utils/formatTime';
import { getPostsFromFriendsLimits } from '../../utils/limits';

const getPostTime = (postDateRaw: Date | number, nowDate = new Date()) => {
    const postDate = new Date(postDateRaw);
    return formatTime(+nowDate - +postDate);
};

const TimelineMid: FC = () => {
    const theme = useMantineTheme();
    // const [{ data: meData, fetching: meFetching }] = useMeQuery();

    const [{ data: postsData, fetching: postsFetching }] = useGetPostsFromFriendsQuery();
    const [, doSendPost] = useSendPostMutation();
    const setScrollToTop = useTimelineStore(state => state.setScrollToTop);
    const setView = useAppStore(state => state.setView);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLInputElement>(null);

    const posts = !postsFetching ? postsData?.getPostsFromFriends : [];
    // console.log('posts', posts);

    // const me = meData?.me;
    // const isMe = user => user.id == me.id;

    useEffect(() => {
        // console.log('new effect', scrollRef.current);
        setScrollToTop(() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' }));
    }, [setScrollToTop]);

    const onKeyDown = (props: TextInputProps & React.RefAttributes<HTMLInputElement>) => {
        const { key } = props;
        if (key === 'Enter') {
            const msg = inputRef.current.value;
            doSendPost({
                text: msg,
            });
            inputRef.current.value = '';
        }
    };

    const onUserClick = (post: typeof posts[0]) => {
        setView('user', null, post.creator.id);
    };

    // {`flex w-full ${isMe(message.from) ? 'justify-end' : ''}`}
    return (
        <Stack className='h-full'>
            {/* Your Timeline */}
            {/* Should have timeline 'For You' (Weighted 'Friends' 'Recent', 'Likes', 'Interest Compatibility' (if allowed)): Can tick individual boxes for algorithm */}
            <Title className='text-[26px] font-bold text-_gray-800'>Timeline</Title>
            <ScrollArea className='grow px-0 pb-0' viewportRef={scrollRef} offsetScrollbars>
                <Stack className='' spacing={23}>
                    <Box className='flex flex-col justify-end'>
                        <TextInput
                            autoComplete='off'
                            ref={inputRef}
                            className=''
                            styles={{
                                input: {
                                    '::placeholder': {
                                        fontSize: '18px',
                                        color: theme.colors._gray[6],
                                    },
                                    height: '70px',
                                    minHeight: '70px',
                                    lineHeight: '68px',
                                    color: theme.colors._gray[8],
                                },
                            }}
                            size='xl'
                            radius='md'
                            placeholder={'What\'s on your mind?'}
                            icon={<IconPerson className='h-10 w-10' color={theme.colors._gray[8]} />}
                            onKeyDown={onKeyDown}
                        />
                    </Box>
                    {posts.map(post => (
                        <Box className='flex items-center w-full text-_gray-800 px-[10px]' key={post.id}>
                            <IconPerson className='h-10 w-10 cursor-pointer' onClick={() => onUserClick(post)} />
                            <Stack ml={9} spacing={0}>
                                <div className='flex gap-[5px] items-center'>
                                    <Text className='font-bold cursor-pointer' onClick={() => onUserClick(post)}>{post.creator.name}</Text>
                                    <Text className='text-_gray-400 cursor-pointer' onClick={() => onUserClick(post)}>(@{post.creator.username})</Text>
                                    <Text className='text-xs'>·</Text>
                                    <Tooltip label={getDateString(new Date(post.createdAt))} withArrow openDelay={400}>
                                        <Text className='text-xs text-_gray-400'>{getPostTime(post.createdAt)}</Text>
                                    </Tooltip>
                                </div>
                                <Text className='text-base text-gray-_800'>{post.text}</Text>
                            </Stack>
                        </Box>
                    ))}
                </Stack>
            </ScrollArea>
        </Stack>
    );
};

export default TimelineMid;
