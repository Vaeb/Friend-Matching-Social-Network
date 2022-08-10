import {
    Box, Button, Divider, ScrollArea, Stack, Text, Textarea, TextInput, TextInputProps, Title, Tooltip, useMantineTheme, 
} from '@mantine/core';
import React, { FC, useEffect, useRef, useState } from 'react';
import shallow from 'zustand/shallow';
import { RiHeartLine as LikeIcon } from 'react-icons/ri';
import { RiHeartFill as LikeIconFilled } from 'react-icons/ri';
import { FaRegCommentDots as CommentIcon } from 'react-icons/fa';

import { useCommentMutation, useLikeMutation, useMeQuery, useSendPostMutation } from '../../generated/graphql';
import { TimelineState, useAppStore, useTimelineStore } from '../../state';
import { avatarUrl } from '../../utils/avatarUrl';
import { formatTime, getDateString } from '../../utils/formatTime';
import { CustomScroll } from '../CustomScroll';
import PaddedArea from '../PaddedArea';
import UserAvatar from '../UserAvatar';
import { FullPost } from '../../utils/splitPosts';

const getPostTime = (postDateRaw: Date | number, nowDate = new Date()) => {
    const postDate = new Date(postDateRaw);
    return formatTime(+nowDate - +postDate);
};

const roomToFull = {
    public: 'Public Lounge',
    student: 'Student Lounge',
};

const roomToPosts = {
    public: 'pPosts',
    student: 'sPosts',
};

const mainColor = '#b77cee';

interface DynamicLikeIconProps { children?: React.ReactNode; post: FullPost; [x: string | number | symbol]: unknown; }
const DynamicLikeIcon = ({ children, post, ...props }: DynamicLikeIconProps) => post.meLiked
    ? <LikeIconFilled {...props}>{children}</LikeIconFilled>
    : <LikeIcon {...props}>{children}</LikeIcon>;

const TimelineMid: FC = () => {
    const theme = useMantineTheme();
    const [{ data: meData, fetching: meFetching }] = useMeQuery();
    
    const setView = useAppStore(state => state.setView);
    const { room, posts, refreshedPosts }: Partial<TimelineState> = useTimelineStore(
        state => ({ room: state.room, posts: state.postGroups[roomToPosts[state.room]], refreshedPosts: state.refreshedPosts }),
        shallow
    );
    const setScrollToTop = useTimelineStore(state => state.setScrollToTop);

    const [, doSendPost] = useSendPostMutation();
    const [, doLike] = useLikeMutation();
    const [, doComment] = useCommentMutation();

    const [postsCommenting, setPostsCommenting] = useState({});

    const inputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    // const divtextRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLInputElement>(null);

    const me = meData?.me;
    // const isMe = user => user.id == me.id;

    useEffect(() => {
        // console.log('new effect', scrollRef.current);
        setScrollToTop(() =>
            setTimeout(() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' }), 400)
        );
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
            studentsOnly: room === 'student',
        });
        textareaRef.current.value = '';
    };

    const onUserClick = (post: typeof posts[0] | typeof posts[0]['comments'][0]) => {
        setView('user', null, post.author.id);
    };

    const likePost = async (post: typeof posts[0]) => {
        await doLike({ id: post.id, onType: 'post', remove: post.meLiked });
    };

    const toggleCommenting = (post: typeof posts[0]) => {
        setPostsCommenting({ [post.id]: !postsCommenting[post.id] });
    };

    const onKeyDownComment = async (e: React.KeyboardEvent<HTMLInputElement>, post: typeof posts[0]) => {
        const { currentTarget: target, key } = e;
        if (key === 'Enter') {
            const text = target.value;
            console.log('Sending comment:', text);
            await doComment({ id: post.id, onType: 'post', text });
            target.value = '';
        }
    };

    // {`flex w-full ${isMe(message.from) ? 'justify-end' : ''}`}
    return (
        <Stack className='h-full'>
            {/* Your Timeline */}
            {/* Should have timeline 'For You' (Weighted 'Friends' 'Recent', 'Likes', 'Interest Compatibility' (if allowed)): Can tick individual boxes for algorithm */}
            <Stack spacing={0}>
                <PaddedArea x className='h-[50px] flex flex-col justify-center'>
                    <Text className='mt-[2px] text-[22px] font-[700] text-_gray-800'>{roomToFull[room ?? 'public']}</Text>
                </PaddedArea>
                <div className='h-[1px] shadow-_box6' />
            </Stack>
            <CustomScroll ref={scrollRef} scrollPadded>
                <Box className='flex flex-col justify-end'>
                    <Box className='flex w-full overflow-x-hidden'>
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
                <Stack className='mt-[23px] mb-[18px]' spacing={19}>
                    {posts.map(post => ( // style={{ color: post.author.color, opacity: 0.7 }}
                        // <>
                        <Box className='flex w-full text-_gray-800 px-[10px]' key={post.id}>
                            <Box>
                                {/* <IconPerson className='h-10 w-10 mt-[5px] cursor-pointer' onClick={() => onUserClick(post)} /> */}
                                <UserAvatar
                                    className='rounded-full w-10 h-10 mt-[2px] cursor-pointer'
                                    url={avatarUrl(post.author)}
                                    onClick={() => onUserClick(post)}
                                />
                            </Box>
                            <Stack className='ml-[16px] grow' spacing={0}>
                                <div className='flex gap-[5px] items-center'>
                                    <Text className='font-[500] cursor-pointer' style={{ color: post.author.color }} onClick={() => onUserClick(post)}>{post.author.name}</Text>
                                    <Text className='text-_gray-400 cursor-pointer' onClick={() => onUserClick(post)}>(@{post.author.username})</Text>
                                    <Text className='text-xs'>·</Text>
                                    <Tooltip label={getDateString(new Date(post.createdAt))} withArrow openDelay={400}>
                                        <Text className='text-xs text-_gray-400'>{getPostTime(post.createdAt, refreshedPosts)}</Text>
                                    </Tooltip>
                                </div>
                                <Text className='text-base text-gray-_800'>{post.text}</Text>
                                <div className='flex mt-[4px] items-center'>
                                    <DynamicLikeIcon post={post} className='opacity-50 cursor-pointer w-[18px] h-[18px]' color={mainColor} onClick={() => likePost(post)} />
                                    {post.numLikes > 0 ? <Text className='ml-[5px] text-xs'>{post.numLikes}</Text> : null}
                                    <CommentIcon className='ml-[14px] opacity-50 cursor-pointer w-[18px] h-[18px]' color={mainColor} onClick={() => toggleCommenting(post)} />
                                </div>
                                {postsCommenting[post.id] ? (
                                    <TextInput
                                        className={`${post.comments.length ? 'mb-[3px]' : 'mb-[5px]'} mt-[10px] mr-[56px]`}
                                        classNames={{ input: 'h-[3px] min-h-[40px] leading-[38px]' }}
                                        autoComplete='off'
                                        ref={inputRef}
                                        size='sm'
                                        radius='sm'
                                        placeholder='Send a comment!'
                                        onKeyDown={e => onKeyDownComment(e, post)}
                                    />) : null}
                                {post.comments.length ? (
                                    <Stack sx={{ borderColor: mainColor }} className='mt-[9px] border-l-2 pl-[10px]' spacing={14}>
                                        {post.comments.map(comment => (
                                            <Box className='flex w-full' key={comment.id}>
                                                <Box>
                                                    <UserAvatar
                                                        className='rounded-full w-10 h-10 mt-[2px] cursor-pointer'
                                                        url={avatarUrl(comment.author)}
                                                        onClick={() => onUserClick(comment)}
                                                    />
                                                </Box>
                                                <Stack className='ml-[16px] grow' spacing={0}>
                                                    <div className='flex gap-[5px] items-center'>
                                                        <Text className='font-[500] cursor-pointer' style={{ color: comment.author.color }}>{comment.author.name}</Text>
                                                        <Text className='text-_gray-400 cursor-pointer'>(@{comment.author.username})</Text>
                                                        <Text className='text-xs'>·</Text>
                                                        <Tooltip label={getDateString(new Date(comment.createdAt))} withArrow openDelay={400}>
                                                            <Text className='text-xs text-_gray-400'>{getPostTime(comment.createdAt, refreshedPosts)}</Text>
                                                        </Tooltip>
                                                    </div>
                                                    <Text className='text-base text-gray-_800'>{comment.text}</Text>
                                                </Stack>
                                            </Box>
                                        ))}
                                    </Stack>) : null}
                            </Stack>
                        </Box>
                        // </>
                    ))}
                </Stack>
            </CustomScroll>
        </Stack>
    );
};

export default TimelineMid;
