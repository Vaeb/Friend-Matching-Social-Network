import React, { FC } from 'react';
import { ScrollArea, Stack, Text, UnstyledButton, useMantineTheme } from '@mantine/core';
import { IoMdArrowBack as IconBack } from 'react-icons/io';
// import { BsPersonBadge as IconPerson } from 'react-icons/bs';
import { TbRefreshDot as IconRefresh } from 'react-icons/tb';

import { useAppStore } from '../../state';
import PanelAction from '../PanelAction';
import { useGetMatchesQuery, useManualMatchMutation, useMeQuery } from '../../generated/graphql';
import UserAvatar from '../UserAvatar';
import { avatarUrl } from '../../utils/avatarUrl';

const MatchesRight: FC<any> = () => {
    const theme = useMantineTheme();
    const setView = useAppStore(state => state.setView);

    const [{ data: meData, fetching: meFetching }] = useMeQuery();
    const [{ data: matchesData, fetching: matchesFetching }] = useGetMatchesQuery();
    const [, doManualMatch] = useManualMatchMutation();

    const me = !meFetching ? meData?.me : null;
    const matches = matchesData?.getMatches.matches;

    const hasMatch = me.manualEnabled && me?.nextManualMatchId != null;

    const manualMatch = async () => {
        console.log('Getting manual match...');
        await doManualMatch();
        console.log('Done!');
    };

    return (
        <>
            <PanelAction onClick={() => setView('base', 'right')}>
                <IconBack style={{ width: '60%', height: '60%' }} color={theme.colors._gray[6]} />
            </PanelAction>
            <PanelAction
                onClick={() => manualMatch()}
                color={hasMatch ? 'green' : 'dark'}
                className={hasMatch ? 'border-2 border-green-400 border-opacity-30' : ''}
                disabled={!hasMatch ? true : false}
            >
                <IconRefresh style={{ width: '60%', height: '60%' }} color={theme.colors._gray[6]} />
            </PanelAction>
            <Text className='text-sm font-bold w-full text-center' color='dimmed'>Friend<br/>Matches</Text>
            <ScrollArea type='never' className='grow'>
                <Stack align='center' spacing={20}>
                    {!matchesFetching
                        ? matches.map(match => (
                            <Stack className='w-full items-center' key={match.user.id} spacing={4}>
                                <UnstyledButton aria-label='Match Chat'>
                                    <UserAvatar
                                        className='rounded-full w-[51px] h-[51px] cursor-pointer hover:opacity-75'
                                        url={avatarUrl(match.user)}
                                        onClick={() => setView('match', null, match.user.id)}
                                    />
                                </UnstyledButton>
                                <Text className='text-sm text-_gray-800 truncate text-center w-[69px] cursor-pointer' onClick={() => setView('user', null, match.user.id)}>
                                    @{match.user.username}
                                </Text>
                            </Stack>
                        ))
                        : null}
                </Stack>
            </ScrollArea>
        </>
    );
};

export default MatchesRight;
