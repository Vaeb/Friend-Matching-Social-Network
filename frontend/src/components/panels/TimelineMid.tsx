import {
    Box, Button, ScrollArea, Stack, Text, Textarea, TextInput, TextInputProps, Title, Tooltip, useMantineTheme, 
} from '@mantine/core';
import React, { FC, useEffect, useRef } from 'react';
import { BsPersonCircle as IconPerson } from 'react-icons/bs';
import shallow from 'zustand/shallow';

import { useGetPostsWeightedQuery, useMeQuery, useSendPostMutation } from '../../generated/graphql';
import { useAppStore, useTimelineStore } from '../../state';
// import { useAppStore, useConvoStore } from '../../state';
import { formatTime, getDateString } from '../../utils/formatTime';

const getPostTime = (postDateRaw: Date | number, nowDate = new Date()) => {
    const postDate = new Date(postDateRaw);
    return formatTime(+nowDate - +postDate);
};

const TimelineMid: FC = () => {
    const theme = useMantineTheme();
    const [{ data: meData, fetching: meFetching }] = useMeQuery();

    const { posts, refreshedPosts } = useTimelineStore(state => ({ posts: state.posts, refreshedPosts: state.refreshedPosts }), shallow);
    const [, doSendPost] = useSendPostMutation();
    const setScrollToTop = useTimelineStore(state => state.setScrollToTop);
    const setView = useAppStore(state => state.setView);
    const inputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    // const divtextRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLInputElement>(null);

    // console.log('stale', stale);
    // console.log(posts);
    // const posts = !postsFetching ? postsData?.getPostsWeighted?.posts : [];
    // console.log('posts', posts);

    const me = meData?.me;
    // const isMe = user => user.id == me.id;

    useEffect(() => {
        // console.log('new effect', scrollRef.current);
        setScrollToTop(() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' }));
    }, [setScrollToTop]);

    // const onKeyDown = (props: TextInputProps & React.RefAttributes<HTMLInputElement>) => {
    //     const { key } = props;
    //     // if (key === 'Enter') {
    //     //     const msg = textareaRef.current.value;
    //     //     doSendPost({
    //     //         text: msg,
    //     //     });
    //     //     textareaRef.current.value = '';
    //     // }
    // };

    const sendPost = () => {
        const msg = textareaRef.current.value;
        doSendPost({
            text: msg,
        });
        textareaRef.current.value = '';
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
                        <Box className='flex w-full'>
                            {/* <Box>
                            <IconPerson className='text-_gray-800 h-10 w-10 mt-[15px] cursor-pointer' onClick={() => setView('user', null, me.id)} />
                        </Box> */}
                            <Textarea
                                ref={textareaRef}
                                // contentEditable='true' data-testid='tweetTextarea_0' role='textbox' spellCheck='true' tabIndex={0}
                                autoComplete='off'
                                className='grow'
                                styles={{
                                    input: {
                                        '::placeholder': {
                                            fontSize: '18px',
                                            color: theme.colors._gray[6],
                                        // lineHeight: '68px',
                                        },
                                        height: '90px',
                                        minHeight: '70px',
                                        paddingTop: '20px !important',
                                        // lineHeight: '48px',
                                        color: theme.colors._gray[8],
                                    },
                                    icon: {
                                        alignItems: 'flex-start',
                                        marginTop: 15,
                                    },
                                }}
                                size='xl'
                                radius='md'
                                rightSection={
                                    <Box className='w-30 self-end mb-[14px]'>
                                        <Button className='float-left' styles={{ root: { width: 130 } }} size='md' variant='gradient' onClick={sendPost}>Send post</Button>
                                    </Box>
                                }
                                rightSectionWidth={160}
                                rightSectionProps={{
                                    className: 'flex flex-col self-end',
                                }}
                                placeholder={'What\'s on your mind?'}
                                icon={<IconPerson className='h-10 w-10' color={theme.colors._gray[8]} />}
                                // onKeyDown={onKeyDown}
                                autosize
                            // minRows={2}
                            />
                        </Box>
                        {/* <Box>
                            <Button className='float-left' size='sm' variant='default'>Send post</Button>
                        </Box> */}
                    </Box>
                    {posts.map(post => (
                        <Box className='flex w-full text-_gray-800 px-[10px]' key={post.id}>
                            <Box>
                                <IconPerson className='h-10 w-10 mt-[5px] cursor-pointer' onClick={() => onUserClick(post)} />
                            </Box>
                            <Stack ml={9} spacing={0}>
                                <div className='flex gap-[5px] items-center'>
                                    <Text className='font-bold cursor-pointer' onClick={() => onUserClick(post)}>{post.creator.name}</Text>
                                    <Text className='text-_gray-400 cursor-pointer' onClick={() => onUserClick(post)}>(@{post.creator.username})</Text>
                                    <Text className='text-xs'>·</Text>
                                    <Tooltip label={getDateString(new Date(post.createdAt))} withArrow openDelay={400}>
                                        <Text className='text-xs text-_gray-400'>{getPostTime(post.createdAt, refreshedPosts)}</Text>
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
