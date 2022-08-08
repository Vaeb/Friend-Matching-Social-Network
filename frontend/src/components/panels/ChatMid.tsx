import {
    Avatar, Box, Group, ScrollArea, Space, Stack, Text, TextInput, TextInputProps, Title, Tooltip, useMantineTheme, 
} from '@mantine/core';
import React, { FC, useEffect, useRef, useState } from 'react';
import shallow from 'zustand/shallow';

import {
    GetUserQuery, Me, useClearSeenMutation, useGetMessagesQuery, useGetUserQuery, useMeQuery, User, useSendMessageMutation, 
} from '../../generated/graphql';
import { useAppStore, useChatStore } from '../../state';
import { avatarUrl } from '../../utils/avatarUrl';
import { formatTime, getDateString } from '../../utils/formatTime';
import CustomScroll from '../CustomScroll';
import FullLoader from '../FullLoader';
import PaddedArea from '../PaddedArea';
import UserAvatar from '../UserAvatar';

const getElapsedTime = (itemDateRaw: Date | number, nowDate = new Date()) => {
    const itemDate = new Date(itemDateRaw);
    return formatTime(+nowDate - +itemDate);
};

const ChatMid: FC = () => {
    const theme = useMantineTheme();
    const { userId, setView } = useAppStore(
        state => ({ userId: state.mid.viewValue, setView: state.setView }),
        shallow
    );

    const refreshedMessages = useChatStore(state => state.refreshedMessages);

    const [{ data: meData, fetching: meFetching }] = useMeQuery();
    const [{ data: userData, fetching: userFetching }] = useGetUserQuery({ variables: { userId } });
    const [{ data: messagesData, fetching: messagesFetching }] = useGetMessagesQuery({ variables: { target: userId } });
    const [, doSendMessage] = useSendMessageMutation();
    const [, doClearSeen] = useClearSeenMutation();

    const me = meData?.me;
    const user = !userFetching ? userData?.getUser : null;

    const [nowDate, setNowDate] = useState(new Date());
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLInputElement>(null);

    // console.log('resData', res.data);

    const messages = (!messagesFetching && messagesData?.getMessages.messages) || [];

    // const lastMessage = messages?.[messages.length - 1];
    // const lastMessageJson = lastMessage ? JSON.stringify(lastMessage) : undefined;
    const lastMessageId = messages?.at(-1)?.id;
    // console.log('Rendering ChatMid', lastMessageId, nowDate, messages.length);
    // console.log(lastMessageJson);

    const isMe = u => u.id == me.id;

    const users: Record<any, Partial<User | Me>> = {
        [me?.id ?? -1]: me,
        [userId]: user,
    };

    useEffect(() => {
        console.log('Clearing seen:', userId);
        // setNowDate(new Date());
        doClearSeen({ userId });
    }, [userId, doClearSeen]);

    // useEffect(() => {
    //     console.log('Resetting date:');
    //     setNowDate(new Date());
    // }, [userId, lastMessageId]);

    const scrollToBottom = () => {
        // console.log(11, scrollRef, scrollRef.current, scrollRef.current?.scrollTop, scrollRef.current?.scrollHeight);
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
        // console.log(22, scrollRef, scrollRef.current, scrollRef.current?.scrollTop, scrollRef.current?.scrollHeight);
    };

    useEffect(() => {
        scrollToBottom();
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [userId, lastMessageId]);

    const onKeyDown = async (props: TextInputProps & React.RefAttributes<HTMLInputElement>) => {
        const { key } = props;
        if (key === 'Enter') {
            const msg = inputRef.current.value;
            inputRef.current.value = '';
            await doSendMessage({
                to: userId,
                text: msg,
            });
            setNowDate(new Date());
        }
    };

    const onUserClick = (message: typeof messages[0]) => {
        setView('user', null, message.from.id);
    };

    // {`flex w-full ${isMe(message.from) ? 'justify-end' : ''}`}
    return (
        <PaddedArea full y className='pt-[0px]'>
            <Stack className='h-full' spacing={0}>
                <Stack spacing={0}>
                    <PaddedArea x className='h-[50px] flex flex-col justify-center'>
                        <Text className='text-[16px] font-[600] text-_gray-600'>
                            Welcome to the @{me?.username ?? 'me'} @{user?.username ?? 'username'} channel.
                        </Text>
                    </PaddedArea>
                    <div className='h-[1px] shadow-_box6' />
                </Stack>
                <CustomScroll scrollPadded needsP ref={scrollRef}>
                    <Stack className='mt-[18px] mb-[18px]' spacing={22}>
                        {messages.map(message => (
                            <Box className='flex w-full' key={message.id}>
                                {/* <IconPerson className='h-10 w-10 cursor-pointer' onClick={() => onUserClick(message)} /> */}
                                <UserAvatar className='rounded-full w-10 h-10 mt-[2px] cursor-pointer' url={avatarUrl(message.from)} onClick={() => onUserClick(message)} />
                                <Stack ml={16} spacing={0}>
                                    <div className='flex gap-[5px] items-center'>
                                        <Text
                                            className='font-medium cursor-pointer text-_gray-800'
                                            style={{ color: users[message.from.id]?.color }}
                                            onClick={() => onUserClick(message)}
                                        >{`${users[message.from.id]?.name ?? 'Name'}`}</Text>
                                        <Text className='text-xs text-_gray-800'>·</Text>
                                        <Tooltip className='opacity-50' label={getDateString(new Date(message.createdAt))} withArrow openDelay={400}>
                                            <Text className='text-xs text-_gray-400'>{getElapsedTime(message.createdAt, nowDate)}</Text>
                                        </Tooltip>
                                    </div>
                                    <Text className='text-base text-gray-300'>{message.text}</Text>
                                </Stack>
                            </Box>
                        ))}
                    </Stack>
                </CustomScroll>
                <PaddedArea x className='flex flex-col justify-end'>
                    <TextInput autoComplete='off' ref={inputRef} className='' size='md' radius='md' placeholder='Send a message!' onKeyDown={onKeyDown} />
                </PaddedArea>
            </Stack>
        </PaddedArea>
    );
};

export default ChatMid;
