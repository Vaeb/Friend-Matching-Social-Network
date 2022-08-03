import {
    Box, Button, Divider, ScrollArea, Stack, Text, Textarea, TextInput, TextInputProps, Title, Tooltip, useMantineTheme, 
} from '@mantine/core';
import React, { FC, useEffect, useRef } from 'react';
import shallow from 'zustand/shallow';

import { useMeQuery, useSendPostMutation } from '../../generated/graphql';
import { useAppStore, useTimelineStore } from '../../state';
import { avatarUrl } from '../../utils/avatarUrl';
import { formatTime, getDateString } from '../../utils/formatTime';
import CustomScroll from '../CustomScroll';
import PaddedArea from '../PaddedArea';
import UserAvatar from '../UserAvatar';

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
            studentsOnly: false,
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
            <Stack spacing={0}>
                <PaddedArea x className='h-[50px] flex flex-col justify-center'>
                    <Text className='text-[22px] font-[700] text-_gray-800'>Timeline</Text>
                </PaddedArea>
                <div className='h-[1px] shadow-_box6' />
            </Stack>
            <CustomScroll ref={scrollRef} scrollPadded>
                <Box className='flex flex-col justify-end'>
                    <Box className='flex w-full'>
                        <Textarea
                            ref={textareaRef}
                            // contentEditable='true' data-testid='tweetTextarea_0' role='textbox' spellCheck='true' tabIndex={0}
                            autoComplete='off'
                            className='grow'
                            classNames={{
                                input: 'h-[90px] min-h-[70px] text-_gray-800 pl-[66px]',
                                icon: 'items-start mt-[15px]',
                            }}
                            styles={{
                                input: {
                                    '::placeholder': {
                                        fontSize: '18px',
                                        color: theme.colors._gray[6],
                                        // lineHeight: '68px',
                                    },
                                    paddingTop: '20px !important',
                                    // // lineHeight: '48px',
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
                            icon={
                                // <IconPerson className='h-10 w-10' color={theme.colors._gray[8]} />
                                <UserAvatar
                                    className='rounded-full w-10 h-10 cursor-pointer'
                                    url={avatarUrl(me)}
                                />
                            }
                            // onKeyDown={onKeyDown}
                            autosize
                            // minRows={2}
                        />
                    </Box>
                    {/* <Box>
                            <Button className='float-left' size='sm' variant='default'>Send post</Button>
                        </Box> */}
                </Box>
                <Stack className='mt-[23px] mb-[18px]' spacing={23}>
                    {posts.map(post => ( // style={{ color: post.creator.color, opacity: 0.7 }}
                        // <>
                        <Box className='flex w-full text-_gray-800 px-[10px]' key={post.id}>
                            <Box>
                                {/* <IconPerson className='h-10 w-10 mt-[5px] cursor-pointer' onClick={() => onUserClick(post)} /> */}
                                <UserAvatar
                                    className='rounded-full w-10 h-10 mt-[2px] cursor-pointer'
                                    url={avatarUrl(post.creator)}
                                    onClick={() => onUserClick(post)}
                                />
                            </Box>
                            <Stack ml={16} spacing={0}>
                                <div className='flex gap-[5px] items-center'>
                                    <Text className='font-[500] cursor-pointer' style={{ color: post.creator.color }} onClick={() => onUserClick(post)}>{post.creator.name}</Text>
                                    <Text className='text-_gray-400 cursor-pointer' onClick={() => onUserClick(post)}>(@{post.creator.username})</Text>
                                    <Text className='text-xs'>·</Text>
                                    <Tooltip label={getDateString(new Date(post.createdAt))} withArrow openDelay={400}>
                                        <Text className='text-xs text-_gray-400'>{getPostTime(post.createdAt, refreshedPosts)}</Text>
                                    </Tooltip>
                                </div>
                                <Text className='text-base text-gray-_800'>{post.text}</Text>
                            </Stack>
                        </Box>
                        // <Divider key={`${post.id}-divider`} size='xs' color={theme.colors._dividerT2[0]} /> </>
                    ))}
                </Stack>
            </CustomScroll>
        </Stack>
    );
};

export default TimelineMid;
