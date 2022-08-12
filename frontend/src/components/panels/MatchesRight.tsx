import React, { FC, useEffect, useState } from 'react';
import {
    ScrollArea, Stack, Text, Tooltip, UnstyledButton, useMantineTheme, 
} from '@mantine/core';
import { IoMdArrowBack as IconBack } from 'react-icons/io';
// import { BsPersonBadge as IconPerson } from 'react-icons/bs';
import { TbRefreshDot as IconRefresh } from 'react-icons/tb';
import Countdown from 'react-countdown';

import { useAppStore, useMeStore } from '../../state';
import PanelAction from '../PanelAction';
import { useGetMatchesQuery, useManualMatchMutation, useMeQuery } from '../../generated/graphql';
import UserAvatar from '../UserAvatar';
import { avatarUrl } from '../../utils/avatarUrl';
import shallow from 'zustand/shallow';

// const CountdownRender = ({ days, hours, minutes, seconds, completed }) => {
//     if (completed) {
//         return <span>...</span>;
//     } else {
//         return (
//             <span>
//                 {days}d {hours}h {minutes}m {seconds}s
//             </span>
//         );
//     }
// };

const MatchesRight: FC<any> = () => {
    const theme = useMantineTheme();
    const setView = useAppStore(state => state.setView);
    const { nextMatch, refreshNextMatch } = useMeStore(state => ({ nextMatch: state.nextMatch, refreshNextMatch: state.refreshNextMatch }), shallow);

    const [{ data: meData, fetching: meFetching }] = useMeQuery();
    const [{ data: matchesData, fetching: matchesFetching }] = useGetMatchesQuery();
    const [, doManualMatch] = useManualMatchMutation();

    const me = !meFetching ? meData?.me : null;
    const matches = matchesData?.getMatches.matches;

    const hasMatch = me.manualEnabled && me?.nextManualMatchId != null;

    useEffect(() => {
        console.log('useEffect autoFreq updating match countdown');
        refreshNextMatch(me.autoFreq);
    }, [refreshNextMatch, me.autoFreq]);

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
            {me.autoFreq > 0 ? (
                <Tooltip label={'When is your next match:'} withArrow openDelay={400} position='left'>
                    <div>
                        <Text className='text-sm w-full text-center' color='dimmed'>Next:</Text>
                        <Text className='text-sm w-full text-center' color='dimmed'>
                            <Countdown date={nextMatch} overtime={true} daysInHours={true} onComplete={() => refreshNextMatch(me.autoFreq, true)} />
                        </Text>
                    </div>
                </Tooltip>) : null}
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
