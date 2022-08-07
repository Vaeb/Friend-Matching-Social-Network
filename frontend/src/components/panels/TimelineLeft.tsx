/* eslint-disable @typescript-eslint/indent */
import {
    Button, Divider, Stack, useMantineTheme, 
} from '@mantine/core';
import React, { FC } from 'react';
import shallow from 'zustand/shallow';
import { useMeQuery } from '../../generated/graphql';

import { TimelineState, useAppStore, useTimelineStore } from '../../state';

const RoomButton = ({ children, room, newRoom, setRoom, theme, ...props }) => {
    const selected = room === newRoom;
    return (
        // <Button className={`w-[80%] ${room === newRoom ? 'opacity-75' : ''} bg-_black-300`} variant='filled' onClick={() => setRoom(newRoom)}>{children}</Button>
        <Button
            // className={`
            //     ${selected
            //         ? 'bg-_black-600 text-white'
            //         : 'bg-transparent hover:bg-_blackT-500 text-_gray-600'
            //     } text-base font-[500] text-left w-full h-[36px]
            // `}
            className={`
                ${selected
                    ? 'bg-_blackT-600 text-white'
                    : 'bg-transparent hover:bg-_blackT-500 text-_gray-600'
                } text-base font-[400] text-left w-full h-[38px]
            `}
            classNames={{
                inner: 'justify-start',
            }}
            onClick={() => setRoom(newRoom)}
            {...props}
        >
            {children}
        </Button>
    );
};

const TimelineLeft: FC = () => {
    const theme = useMantineTheme();
    const { room, setRoom, scrollToTop }: Partial<TimelineState> = useTimelineStore(
        state => ({ room: state.room, setRoom: state.setRoom, scrollToTop: state.scrollToTop }),
        shallow
    );

    const [{ data: meData, fetching: meFetching }] = useMeQuery();
    const me = !meFetching ? meData?.me : null;

    console.log('room', room);

    return (
        <Stack className='w-full mt-[25px] items-center' spacing={16}>
            <Button variant='outline' className='w-[80%]' onClick={scrollToTop}>Scroll to top</Button>

            {/* <Divider className='w-[85%] mb-[100px]' size='xs' color={theme.colors._dividerT[0]} /> */}
            <Divider className='w-[85%] mt-[210px]' size='xs' color={theme.colors._dividerT[0]} />

            <Stack className='w-full items-center' spacing={2}>
                <RoomButton theme={theme} room={room} setRoom={setRoom} newRoom='public'>Public Lounge</RoomButton>
                <RoomButton disabled={!me?.uniConfirmed} theme={theme} room={room} setRoom={setRoom} newRoom='student'>Student Lounge</RoomButton>
            </Stack>
            {/* <Button variant='gradient' className='w-[80%]' onClick={() => setRoom('student')}>Student Lounge</Button> */}
            {/* <Divider className='w-[85%]' size='xs' color={theme.colors._dividerT[0]} /> */}
        </Stack>
    );
};

export default TimelineLeft;
