import {
    Card, Group, ScrollArea, SimpleGrid, Stack, Text, Title, Tooltip, 
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import React from 'react';

import { useGetPostsFromUserQuery, useGetUserQuery } from '../../generated/graphql';
import { useAppStore } from '../../state';
import { formatTime, getDateString } from '../../utils/formatTime';
import CustomScroll from '../CustomScroll';
import FullLoader from '../FullLoader';
import PaddedArea from '../PaddedArea';

const UserMid = () => {
    const userId = useAppStore(state => state.mid.viewValue);
    const [{ data: userData, fetching: userFetching }] = useGetUserQuery({ variables: { userId } });
    const [{ data: postsData, fetching: postsFetching }] = useGetPostsFromUserQuery({ variables: { userId } });
    const user = !userFetching ? userData?.getUser : null;
    const posts = !postsFetching ? postsData?.getPostsFromUser : null;

    const cols4 = useMediaQuery('(min-width: 1580px)'); // Will not work with SSR
    const cols3 = useMediaQuery('(min-width: 1280px)'); // Will not work with SSR
    const cols2 = useMediaQuery('(min-width: 1000px)'); // Will not work with SSR

    return (
        user ?
            <Stack className='h-full'>
                <Stack spacing={0}>
                    <PaddedArea x className='h-[50px] flex flex-col justify-center'>
                        <div className='flex gap-[5px] items-center text-[22px]'>
                            <p className='font-[700] text-_gray-800'>{user.name}</p>
                            <p className=''>·</p>
                            <p className='text-_gray-400'>@{user.username}</p>
                        </div>
                    </PaddedArea>
                    <div className='h-[1px] shadow-_box6' />
                </Stack>

                <CustomScroll scrollPadded>
                    <SimpleGrid cols={cols4 ? 4 : cols3 ? 3 : cols2 ? 2 : 1}>
                        {posts ? posts.map(post => (
                            <Card key={post.id} shadow='sm' p='lg' radius='md' withBorder>
                                <Card.Section />

                                <Group position='apart' mt='md' mb='xs'>
                                    <Tooltip label={getDateString(new Date(post.createdAt))} withArrow openDelay={400}>
                                        <Text weight={500}>{formatTime(post.createdAt, true)}</Text>
                                    </Tooltip>
                                    {/* <Badge color='pink' variant='light'>
                            5 Likes
                        </Badge> */}
                                </Group>

                                <Text size='sm' color='dimmed'>{post.text}</Text>

                                {/* <Button variant='light' color='blue' fullWidth mt='md' radius='md'>
                        Go to post
                    </Button> */}
                            </Card>
                        )) : null}
                    </SimpleGrid>
                </CustomScroll>
            </Stack>
            : <FullLoader />
    );
};

export default UserMid;