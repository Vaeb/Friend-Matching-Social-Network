import React, { FC } from 'react';
import { Indicator, Stack, useMantineTheme } from '@mantine/core';
import { MdTimeline as IconHome } from 'react-icons/md';
import { FaUserFriends as IconMatches } from 'react-icons/fa';

import { useAppStore } from '../../state';
import PanelAction from '../PanelAction';
import { useGetMatchesQuery } from '../../generated/graphql';

const BaseRight: FC<any> = () => {
    const theme = useMantineTheme();
    const setView = useAppStore(state => state.setView);
    const [{ data: matchesData, fetching: matchesFetching }] = useGetMatchesQuery();

    const numMatches = matchesData?.getMatches.length;

    return (
        <Stack align='center' spacing={20}>
            <PanelAction onClick={() => setView('base', 'all')}>
                <IconHome style={{ width: '60%', height: '60%' }} color={theme.colors._gray[6]} />
            </PanelAction>
            <Indicator inline disabled={matchesFetching || !numMatches} label={numMatches} color='blue' size={17} offset={5}>
                <PanelAction onClick={() => setView('matches', 'right')}>
                    <IconMatches style={{ width: '60%', height: '60%' }} color={theme.colors._gray[6]} />
                </PanelAction>
            </Indicator>
        </Stack>
    );
};

export default BaseRight;
