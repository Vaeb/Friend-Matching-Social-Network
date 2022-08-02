import React, { FC } from 'react';
import { Stack, Text, useMantineTheme } from '@mantine/core';
import { IoMdArrowBack as IconBack } from 'react-icons/io';
import { BsPersonBadge as IconPerson } from 'react-icons/bs';

import { useAppStore } from '../../state';
import PanelAction from '../PanelAction';
import { useGetMatchesQuery } from '../../generated/graphql';
import UserAvatar from '../UserAvatar';
import { avatarUrl } from '../../utils/avatarUrl';

const MatchesRight: FC<any> = () => {
    const theme = useMantineTheme();
    const setView = useAppStore(state => state.setView);
    const [{ data: matchesData, fetching: matchesFetching }] = useGetMatchesQuery();

    const matches = matchesData?.getMatches;

    return (
        <Stack className='w-[80px] overflow-hidden' align='center' spacing={20}>
            <PanelAction onClick={() => setView('base', 'right')}>
                <IconBack style={{ width: '60%', height: '60%' }} color={theme.colors._gray[6]} />
            </PanelAction>
            <Text className='text-sm font-bold w-full text-center' color='dimmed'>Friend<br/>Matches</Text>
            {!matchesFetching
                ? matches.map(match => (
                    <Stack className='w-full items-center' key={match.user.id} spacing={4}>
                        <UserAvatar
                            className='rounded-full w-[51px] h-[51px] cursor-pointer hover:opacity-75'
                            url={avatarUrl(match.user)}
                            onClick={() => setView('match', null, match.user)}
                        />
                        <Text className='text-sm text-_gray-800 truncate text-center w-full max-w-full' px={6}>
                            @{match.user.username}
                        </Text>
                    </Stack>
                ))
                : null}
        </Stack>
    );
};

export default MatchesRight;
