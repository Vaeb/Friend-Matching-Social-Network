import {
    Avatar,
    Box, Group, ScrollArea, Space, Stack, Text, TextInput, TextInputProps, Title, Tooltip, 
} from '@mantine/core';
import React, { FC, useEffect, useRef } from 'react';

import { GetUserQuery, useGetMessagesQuery, useMeQuery, User, useSendMessageMutation } from '../../generated/graphql';
import { useAppStore } from '../../state';
import { avatarUrl } from '../../utils/avatarUrl';
import { formatTime, getDateString } from '../../utils/formatTime';
import UserAvatar from '../UserAvatar';

const ChatMid: FC = () => {
    // const theme = useMantineTheme();
    const user: GetUserQuery['getUser'] = useAppStore(state => state.mid.viewValue);
    const [{ data: meData, fetching: meFetching }] = useMeQuery();
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLInputElement>(null);
    const setView = useAppStore(state => state.setView);

    const [{ data: messagesData, fetching: messagesFetching }] = useGetMessagesQuery({ variables: { target: user.id } });
    const [, doSendMessage] = useSendMessageMutation();

    // console.log('resData', res.data);

    const messages = !messagesFetching ? messagesData?.getMessages : [];

    const me = meData?.me;
    const isMe = u => u.id == me.id;

    const users: Record<any, Partial<User>> = {
        [me.id]: me,
        [user.id]: user,
    };

    const scrollToBottom = () => {
        if (scrollRef) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [user.id, messages.length]);

    const onKeyDown = (props: TextInputProps & React.RefAttributes<HTMLInputElement>) => {
        const { key } = props;
        if (key === 'Enter') {
            const msg = inputRef.current.value;
            doSendMessage({
                to: user.id,
                text: msg,
            });
            inputRef.current.value = '';
        }
    };

    const onUserClick = (message: typeof messages[0]) => {
        setView('user', null, message.from.id);
    };

    // {`flex w-full ${isMe(message.from) ? 'justify-end' : ''}`}
    return (
        <Stack className='h-full' spacing={0}>
            <Title className='text-base font-bold mb-[16px]' color='dimmed'>
                Welcome to the @{me.username} @{user.username} channel.
            </Title>
            <ScrollArea className='grow px-0 pb-0 mb-0' viewportRef={scrollRef} offsetScrollbars>
                <Stack className='' spacing={23}>
                    {messages.map(message => (
                        <Box
                            className='flex w-full'
                            key={message.id}
                        >
                            {/* <IconPerson className='h-10 w-10 cursor-pointer' onClick={() => onUserClick(message)} /> */}
                            <UserAvatar
                                className='rounded-full w-10 h-10 mt-[2px] cursor-pointer'
                                url={avatarUrl(message.from)}
                                onClick={() => onUserClick(message)}
                            />
                            <Stack ml={16} spacing={0}>
                                <div className='flex gap-[5px] items-center'>
                                    <Text
                                        className='font-medium cursor-pointer text-_gray-800'
                                        style={{ color: users[message.from.id].color }}
                                        onClick={() => onUserClick(message)}
                                    >{`${users[message.from.id].name}`}</Text>
                                    <Text className='text-xs text-_gray-800'>·</Text>
                                    <Tooltip className='opacity-50' label={getDateString(new Date(message.createdAt))} withArrow openDelay={400}>
                                        <Text className='text-xs text-_gray-400'>{formatTime(+new Date() - +new Date(message.createdAt))}</Text>
                                    </Tooltip>
                                </div>
                                <Text className='text-base text-gray-300'>{message.text}</Text>
                            </Stack>
                        </Box>
                    ))}
                </Stack>
                <Space h={18} />
            </ScrollArea>
            <Box className='flex flex-col justify-end'>
                <TextInput
                    autoComplete='off'
                    ref={inputRef}
                    className=''
                    size='md'
                    radius='md'
                    placeholder='Send a message!'
                    onKeyDown={onKeyDown}
                />
            </Box>
        </Stack>
    );
};

export default ChatMid;
