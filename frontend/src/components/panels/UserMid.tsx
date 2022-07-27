import {
    Card, Group, ScrollArea, SimpleGrid, Stack, Text, Title, Tooltip, 
} from '@mantine/core';
import React from 'react';

import { useGetPostsFromUserQuery, useGetUserQuery } from '../../generated/graphql';
import { useAppStore } from '../../state';
import { formatTime, getDateString } from '../../utils/formatTime';
import FullLoader from '../FullLoader';

const UserMid = () => {
    const userId = useAppStore(state => state.mid.viewValue);
    const [{ data: userData, fetching: userFetching }] = useGetUserQuery({ variables: { userId } });
    const [{ data: postsData, fetching: postsFetching }] = useGetPostsFromUserQuery({ variables: { userId } });
    const user = !userFetching ? userData?.getUser : null;
    const posts = !postsFetching ? postsData?.getPostsFromUser : null;

    return (
        user ?
            <Stack className='h-full'>
                <div className='flex gap-[5px] items-center'>
                    <Text className='text-[26px] font-bold text-_gray-800'>{user.name}</Text>
                    <Text className='text-[26px]'>·</Text>
                    <Text className='text-[26px] text-_gray-800'>@{user.username}</Text>
                </div>

                <ScrollArea className='grow px-0 pb-0' offsetScrollbars>
                    <SimpleGrid cols={4}>
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
                </ScrollArea>
            </Stack>
            : <FullLoader />
    );
};

export default UserMid;