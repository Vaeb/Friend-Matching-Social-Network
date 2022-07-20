import {
    Avatar,
    Box, Group, ScrollArea, Stack, Text, TextInput, TextInputProps, Title, useMantineTheme, 
} from '@mantine/core';
import React, { FC, useEffect, useRef } from 'react';
import { BsPersonCircle as IconPerson } from 'react-icons/bs';
// import shallow from 'zustand/shallow';

import { GetMatchesQuery, useGetMessagesQuery, useMeQuery, User, useSendMessageMutation } from '../../generated/graphql';
import { useAppStore, useConvoStore } from '../../state';

const getDateString = (date = new Date()): string => {
    // const iso = date.toISOString();
    // return `${iso.substring(0, 10)} ${iso.substring(11, 19)}`;
    return date.toLocaleString();
};

const MatchMid: FC = () => {
    // const theme = useMantineTheme();
    const match: GetMatchesQuery['getMatches'][0]['user'] = useAppStore(state => state.mid.viewValue);
    const [{ data: meData, fetching: meFetching }] = useMeQuery();
    const inputRef = useRef<HTMLInputElement>(null);

    const [{ data: messagesData, fetching: messagesFetching }] = useGetMessagesQuery({ variables: { target: match.id } });
    const [, doSendMessage] = useSendMessageMutation();

    // const { messages, addMessage } = useConvoStore(state => ({ messages: state.messages[match.id] ?? [], addMessage: state.addMessage }), shallow);
    // if (messages.length === 0 && messagesData?.getMessages.length) {
    //     for (const message of messagesData.getMessages) addMessage(String(match.id), message);
    // }
    const messages = !messagesFetching ? messagesData?.getMessages : [];
    // for (const message of messagesData?.getMessages ?? []) messages.push({ ...message);

    const me = meData?.me;
    const isMe = user => user.id == me.id;

    const users: Record<any, Partial<User>> = {
        [me.id]: me,
        [match.id]: match,
    };

    // console.log(messages);
    // console.log(users);
    // console.log(me);
    // console.log(match);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
            console.log('set focus');
        }
    }, [match.id]);

    const onKeyDown = (props: TextInputProps & React.RefAttributes<HTMLInputElement>) => {
        const { key } = props;
        if (key === 'Enter') {
            const msg = inputRef.current.value;
            doSendMessage({
                to: match.id,
                text: msg,
            });
            // addMessage(String(match.id), { id: +new Date(), text: msg, from: { id: me.id }, createdAt: +new Date() });
            inputRef.current.value = '';
        }
    };

    // {`flex w-full ${isMe(message.from) ? 'justify-end' : ''}`}
    return (
        <Stack className='h-full'>
            <Title className='text-base font-bold' color='dimmed'>Welcome to the @{me.username} @{match.username} chat.</Title>
            <ScrollArea className='grow px-0 pb-0'>
                <Stack className='' spacing={23}>
                    {messages.map(message => (
                        <Box className={`flex items-center w-full ${isMe(message.from) ? 'text-sky-400' : 'text-red-400'}`} key={message.id}>
                            <IconPerson className='h-10 w-10' />
                            <Stack ml={9} spacing={0}>
                                <Group spacing={8}>
                                    <Text className=' font-medium'>{`${users[message.from.id].name}`}</Text>
                                    <Text className='text-xs text-_gray-400'>{getDateString(new Date(message.createdAt))}</Text>
                                </Group>
                                <Text className='text-base text-gray-300'>{message.text}</Text>
                            </Stack>
                        </Box>
                    ))}
                </Stack>
            </ScrollArea>
            <Box className='flex flex-col justify-end'>
                <TextInput autoComplete='off' ref={inputRef} className='' size='md' radius='md' placeholder='Send a message!' onKeyDown={onKeyDown} />
            </Box>
        </Stack>
    );
};

export default MatchMid;
